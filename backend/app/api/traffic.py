
import os
import pandas as pd
from fastapi import APIRouter
from typing import Optional

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
CSV_FILE = os.path.join(DATA_DIR, "smart_city_traffic_2025_2026.csv")

@router.get("/")
def get_traffic_flow(
    min_lat: float = None, max_lat: float = None,
    min_lng: float = None, max_lng: float = None
):
    """
    Returns the latest traffic flow data as GeoJSON.
    Filters by Date to get the most recent snapshot.
    """
    if not os.path.exists(CSV_FILE):
        return {"type": "FeatureCollection", "features": []}

    try:
        # Load data
        df = pd.read_csv(CSV_FILE)
        
        # Ensure timestamp is datetime
        df['Date'] = pd.to_datetime(df['Date'])
        
        # Get latest timestamp
        latest_time = df['Date'].max()
        
        # Filter for latest data snapshot
        latest_df = df[df['Date'] == latest_time]
        
        features = []
        cong_map = {'Low': 20.0, 'Moderate': 50.0, 'High': 75.0, 'Severe': 95.0}

        for _, row in latest_df.iterrows():
            lat = row.get("Latitude")
            lng = row.get("Longitude")
            
            # Filter by BBox
            if min_lat is not None:
                if not (min_lat <= lat <= max_lat and min_lng <= lng <= max_lng):
                    continue

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "properties": {
                    "intersection_id": row.get("Location_ID"),
                    "congestion": cong_map.get(row.get("Avg_Congestion_Level", "Low"), 0),
                    "flow_vpm": row.get("Daily_Vehicle_Count"),
                    "avg_speed": row.get("Average_Speed_kmh"),
                    "incidents": 0,
                    "timestamp": str(row.get("Date").date())
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    except Exception as e:
        print(f"Error serving traffic data: {e}")
        return {"type": "FeatureCollection", "features": []}
