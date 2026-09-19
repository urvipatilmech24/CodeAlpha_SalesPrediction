from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor

app = FastAPI(title="AdPulse Sales AI API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "Advertising.csv")

def load_data():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        if 'Unnamed: 0' in df.columns:
            df = df.drop(columns=['Unnamed: 0'])
        df.columns = df.columns.str.strip()
        return df.dropna()
    else:
        # Fallback Dataset structure
        return pd.DataFrame({
            "TV": [230.1, 44.5, 17.2, 151.5],
            "Radio": [37.8, 39.3, 45.9, 41.3],
            "Newspaper": [69.2, 45.1, 69.3, 58.5],
            "Sales": [22.1, 10.4, 9.3, 18.5]
        })

df = load_data()

# Global ML Model Training
X = df[['TV', 'Radio', 'Newspaper']].copy()
X['Total_Spend'] = X['TV'] + X['Radio'] + X['Newspaper']
X['TV_Ratio'] = X['TV'] / (X['Total_Spend'] + 1e-5)
X['Radio_Ratio'] = X['Radio'] / (X['Total_Spend'] + 1e-5)
y = df['Sales']

ml_model = RandomForestRegressor(n_estimators=100, random_state=42)
ml_model.fit(X, y)

@app.get("/api/overview")
def get_overview():
    total_campaigns = len(df)
    avg_sales = round(float(df['Sales'].mean()), 2)
    total_tv = round(float(df['TV'].sum()), 2)
    total_radio = round(float(df['Radio'].sum()), 2)
    total_newspaper = round(float(df['Newspaper'].sum()), 2)
    
    # Correlation metrics
    correlations = df.corr()['Sales'].round(3).to_dict()

    return {
        "metrics": {
            "total_campaigns": total_campaigns,
            "avg_sales": avg_sales,
            "channel_totals": {
                "TV": total_tv,
                "Radio": total_radio,
                "Newspaper": total_newspaper
            },
            "correlations": correlations
        },
        "raw_data": df.head(50).to_dict(orient="records")
    }

@app.post("/api/predict")
def predict_sales(payload: dict):
    try:
        tv = float(payload.get("tv", 0))
        radio = float(payload.get("radio", 0))
        newspaper = float(payload.get("newspaper", 0))

        total_spend = tv + radio + newspaper
        tv_ratio = tv / (total_spend + 1e-5)
        radio_ratio = radio / (total_spend + 1e-5)

        features = [[tv, radio, newspaper, total_spend, tv_ratio, radio_ratio]]
        predicted_sales = round(float(ml_model.predict(features)[0]), 2)
        
        # Calculate ROI per $1000 spend (Sales figures in dataset are in thousands of units)
        estimated_revenue_per_unit = 50.0  # Assumed $50 revenue per unit sold
        gross_revenue = predicted_sales * 1000 * estimated_revenue_per_unit
        est_roi = round(((gross_revenue - (total_spend * 1000)) / (total_spend * 1000 + 1e-5)) * 100, 2) if total_spend > 0 else 0

        # Actionable AI Recommendation Engine
        if radio_ratio < 0.2 and total_spend > 50:
            strategy = "OPTIMIZE: Reallocate 15% of TV/Newspaper budget to Radio. Radio shows high marginal returns relative to cost."
        elif newspaper / (total_spend + 1e-5) > 0.3:
            strategy = "REDUCE NEWSPAPER: Newspaper advertising displays low direct correlation with sales. Reallocate funds to TV or Digital Radio."
        else:
            strategy = "BALANCED GROWTH: Current channel allocation shows strong synergy. Maintain TV dominance while leveraging Radio for high engagement."

        return {
            "predicted_sales_units": predicted_sales,
            "estimated_roi_pct": est_roi,
            "strategy_insight": strategy
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))