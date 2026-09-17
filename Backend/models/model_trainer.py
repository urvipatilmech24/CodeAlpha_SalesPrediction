import os
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

def train_model():
    # Resolve absolute path to the dataset
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "Unemployment_in_India.csv")

    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Please place Unemployment_in_India.csv in backend/data/")
        return

    # Load and clean dataset
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()
    df = df.dropna()

    df.rename(columns={
        'Estimated Unemployment Rate (%)': 'Unemployment_Rate',
        'Estimated Employed': 'Employed',
        'Estimated Labour Participation Rate (%)': 'Labour_Participation_Rate'
    }, inplace=True)

    # Features and Target
    X = df[['Employed', 'Labour_Participation_Rate']]
    y = df['Unemployment_Rate']

    # Train Random Forest Model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save model binary file inside backend/models/
    model_output_path = os.path.join(base_dir, "models", "unemployment_model.pkl")
    joblib.dump(model, model_output_path)
    print(f"Model successfully trained and saved to {model_output_path}")

if __name__ == "__main__":
    train_model()