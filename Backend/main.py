from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor

app = FastAPI(
    title="India Unemployment & Economic Policy Engine API",
    version="3.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Unemployment_in_India.csv")

def load_and_clean_data():
    if not os.path.exists(DATA_PATH):
        # Fallback dataset if file is missing during startup
        data = {
            "Region": ["Andhra Pradesh", "Bihar", "Delhi", "Maharashtra"] * 6,
            "Date": [" 31-05-2019", " 30-06-2019", " 31-05-2020", " 30-06-2020", " 31-05-2021", " 30-06-2021"] * 4,
            " Frequency": [" Monthly"] * 24,
            " Estimated Unemployment Rate (%)": [3.65, 10.5, 25.1, 15.2] * 6,
            " Estimated Employed": [11999139, 12086707, 5000000, 15000000] * 6,
            " Estimated Labour Participation Rate (%)": [43.24, 38.5, 41.2, 45.0] * 6,
            "Area": ["Rural", "Urban", "Urban", "Rural"] * 6
        }
        df = pd.DataFrame(data)
    else:
        df = pd.read_csv(DATA_PATH)

    # Clean whitespace in column names
    df.columns = df.columns.str.strip()
    df = df.dropna()

    # Column Renaming
    df.rename(columns={
        'Estimated Unemployment Rate (%)': 'Unemployment_Rate',
        'Estimated Employed': 'Employed',
        'Estimated Labour Participation Rate (%)': 'Labour_Participation_Rate'
    }, inplace=True)

    # Date parsing & Seasonality Feature Engineering
    df['Date'] = pd.to_datetime(df['Date'].str.strip(), format='%d-%m-%Y', errors='coerce')
    df = df.dropna(subset=['Date'])
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.strftime('%b')
    df['Month_Num'] = df['Date'].dt.month

    # Explicit COVID-19 Era Segmentation
    # Pre-COVID: Before March 2020 | Peak COVID Shockwave: March 2020 to Dec 2020 | Recovery Era: Post 2020
    def categorize_covid_era(date):
        if date < pd.Timestamp('2020-03-01'):
            return 'Pre-COVID (Before Mar 2020)'
        elif pd.Timestamp('2020-03-01') <= date <= pd.Timestamp('2020-12-31'):
            return 'Peak COVID Shockwave (Mar-Dec 2020)'
        else:
            return 'Post-Lockdown / Recovery'

    df['Covid_Era'] = df['Date'].apply(categorize_covid_era)
    
    return df

df = load_and_clean_data()

# Machine Learning Model Setup
X = df[['Employed', 'Labour_Participation_Rate']]
y = df['Unemployment_Rate']
ml_model = RandomForestRegressor(n_estimators=100, random_state=42)
ml_model.fit(X, y)

@app.get("/api/overview")
def get_overview():
    total_records = len(df)
    avg_unemployment = round(float(df['Unemployment_Rate'].mean()), 2)
    max_unemployment = round(float(df['Unemployment_Rate'].max()), 2)
    avg_labor_part = round(float(df['Labour_Participation_Rate'].mean()), 2)
    
    # Specific COVID-19 Breakdown Analysis
    pre_covid_df = df[df['Covid_Era'] == 'Pre-COVID (Before Mar 2020)']
    peak_covid_df = df[df['Covid_Era'] == 'Peak COVID Shockwave (Mar-Dec 2020)']
    post_covid_df = df[df['Covid_Era'] == 'Post-Lockdown / Recovery']

    pre_covid_avg = round(float(pre_covid_df['Unemployment_Rate'].mean()), 2) if not pre_covid_df.empty else 0.0
    peak_covid_avg = round(float(peak_covid_df['Unemployment_Rate'].mean()), 2) if not peak_covid_df.empty else 0.0
    post_covid_avg = round(float(post_covid_df['Unemployment_Rate'].mean()), 2) if not post_covid_df.empty else 0.0

    covid_surge_pct = round(((peak_covid_avg - pre_covid_avg) / (pre_covid_avg + 1e-5)) * 100, 2)

    return {
        "metrics": {
            "total_records": total_records,
            "avg_unemployment": avg_unemployment,
            "max_unemployment": max_unemployment,
            "avg_labor_part": avg_labor_part,
            "pre_covid_avg": pre_covid_avg,
            "peak_covid_avg": peak_covid_avg,
            "post_covid_avg": post_covid_avg,
            "covid_surge_pct": covid_surge_pct
        },
        "regions": sorted(df['Region'].unique().tolist()),
        "areas": sorted(df['Area'].unique().tolist())
    }

@app.get("/api/covid-analysis")
def get_covid_analysis():
    # Pre vs Peak vs Post COVID Comparative Analysis
    era_summary = df.groupby('Covid_Era').agg({
        'Unemployment_Rate': 'mean',
        'Labour_Participation_Rate': 'mean',
        'Employed': 'mean'
    }).reset_index()

    # Regional COVID Impact Ranking (Who suffered the most during Lockdown?)
    peak_df = df[df['Covid_Era'] == 'Peak COVID Shockwave (Mar-Dec 2020)']
    pre_df = df[df['Covid_Era'] == 'Pre-COVID (Before Mar 2020)']

    peak_reg = peak_df.groupby('Region')['Unemployment_Rate'].mean()
    pre_reg = pre_df.groupby('Region')['Unemployment_Rate'].mean()

    covid_impact_df = (peak_reg - pre_reg).reset_index()
    covid_impact_df.columns = ['Region', 'Rate_Increase']
    covid_impact_df['Rate_Increase'] = covid_impact_df['Rate_Increase'].round(2)
    covid_impact_df = covid_impact_df.sort_values(by='Rate_Increase', ascending=False)

    return {
        "era_summary": era_summary.to_dict(orient='records'),
        "hardest_hit_regions": covid_impact_df.to_dict(orient='records')
    }

@app.get("/api/seasonal-patterns")
def get_seasonal_patterns():
    # Seasonal patterns by Month
    monthly_patterns = df.groupby(['Month_Num', 'Month']).agg({
        'Unemployment_Rate': 'mean',
        'Labour_Participation_Rate': 'mean'
    }).reset_index().sort_values(by='Month_Num')

    return {
        "monthly_seasonality": monthly_patterns.to_dict(orient='records')
    }

@app.get("/api/trends")
def get_trends(region: str = Query(None), area: str = Query(None)):
    filtered_df = df.copy()
    if region and region != "All":
        filtered_df = filtered_df[filtered_df['Region'] == region]
    if area and area != "All":
        filtered_df = filtered_df[filtered_df['Area'] == area]

    ts_data = filtered_df.groupby('Date').agg({
        'Unemployment_Rate': 'mean',
        'Labour_Participation_Rate': 'mean',
        'Employed': 'sum'
    }).reset_index()
    ts_data['Date'] = ts_data['Date'].dt.strftime('%Y-%m-%d')

    reg_data = filtered_df.groupby('Region')['Unemployment_Rate'].mean().reset_index()
    reg_data = reg_data.sort_values(by='Unemployment_Rate', ascending=False)

    area_data = filtered_df.groupby('Area')['Unemployment_Rate'].mean().reset_index()

    return {
        "time_series": ts_data.to_dict(orient='records'),
        "regional_ranking": reg_data.to_dict(orient='records'),
        "urban_rural": area_data.to_dict(orient='records')
    }

@app.post("/api/predict")
def predict_unemployment(payload: dict):
    try:
        employed = float(payload.get("employed", 10000000))
        participation_rate = float(payload.get("participation_rate", 40.0))
        
        pred = ml_model.predict([[employed, participation_rate]])[0]
        pred_val = round(float(pred), 2)
        
        # Policy Recommendation Matrix based on Bulletin Requirements
        if pred_val > 15.0:
            policy = "CRITICAL POLICY EMERGENCY: Deploy immediate urban/rural emergency relief programs (expand MGNREGA funding), implement cash transfers to low-income households, and freeze direct corporate taxes for small businesses."
            risk_level = "High Emergency"
        elif pred_val > 8.0:
            policy = "MODERATE ECONOMIC STRESS: Provide payroll subsidies for labor-intensive industries, increase capital spending on local infrastructure, and launch targeted skill re-training schemes."
            risk_level = "Moderate Warning"
        else:
            policy = "STABLE LABOR ENVIRONMENT: Focus on structural reforms, digital skill integration, and long-term youth apprenticeship programs."
            risk_level = "Low / Stable"

        return {
            "predicted_unemployment_rate": pred_val,
            "risk_level": risk_level,
            "recommended_policy_action": policy
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))