from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")

@router.get("/summary")
def get_view_summary(
    min_lat: float, max_lat: float, 
    min_lng: float, max_lng: float
):
    """
    Returns aggregated metrics for the current map view.
    """
    summary = {
        "avg_aqi": None,
        "avg_wqi": None,
        "hospital_count": 0, # Placeholder until we query OSM dynamically/locally
        "insight": "No data in this view."
    }

    # 1. AQI Stats
    aqi_path = os.path.join(DATA_DIR, "aqi_delhi.csv")
    if os.path.exists(aqi_path):
        df_aqi = pd.read_csv(aqi_path)
        filtered_aqi = df_aqi[
            (df_aqi["Latitude"] >= min_lat) & (df_aqi["Latitude"] <= max_lat) & 
            (df_aqi["Longitude"] >= min_lng) & (df_aqi["Longitude"] <= max_lng)
        ]
        if not filtered_aqi.empty:
            summary["avg_aqi"] = int(filtered_aqi["AQI"].mean())

    # 2. Water Stats
    water_path = os.path.join(DATA_DIR, "water_delhi.csv")
    if os.path.exists(water_path):
        df_water = pd.read_csv(water_path)
        filtered_water = df_water[
            (df_water["Latitude"] >= min_lat) & (df_water["Latitude"] <= max_lat) & 
            (df_water["Longitude"] >= min_lng) & (df_water["Longitude"] <= max_lng)
        ]
        if not filtered_water.empty:
            summary["avg_wqi"] = int(filtered_water["WQI"].mean())

    # 3. Generate Insight
    insights = []
    if summary["avg_aqi"]:
        if summary["avg_aqi"] > 200:
            insights.append("High air pollution detected.")
        elif summary["avg_aqi"] < 100:
            insights.append("Air quality is good.")
            
    if summary["avg_wqi"]:
         if summary["avg_wqi"] > 100:
             insights.append("Water contamination warning.")
             
    if not insights:
        summary["insight"] = "Normal environmental levels."
    else:
        summary["insight"] = " ".join(insights)

    return summary
