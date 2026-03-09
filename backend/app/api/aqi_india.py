
import os
import json
import glob
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
CSV_FILE = os.path.join(DATA_DIR, "smart_city_air_humidity_2025_2026.csv")

@router.get("/")
def get_india_aqi(
    min_lat: float = None, max_lat: float = None,
    min_lng: float = None, max_lng: float = None
):
    """
    Returns the latest available AQI data for all stations in India.
    """
    if not os.path.exists(CSV_FILE):
        return {"type": "FeatureCollection", "features": []}

    features = []
    try:
        df = pd.read_csv(CSV_FILE)
        
        # Take latest record per Station
        df_latest = df.sort_values('Date').groupby('StationName').last().reset_index()

        for _, row in df_latest.iterrows():
            lat = row.get("Latitude")
            lng = row.get("Longitude")
            
            if pd.isna(lat) or pd.isna(lng):
                continue
                
            # Filter by BBox if provided
            if min_lat is not None:
                 if not (min_lat <= lat <= max_lat and min_lng <= lng <= max_lng):
                     continue

            properties = {
                "city": row.get("City", "Unknown"),
                "location": row.get("StationName", "Unknown"),
                "timestamp": row.get("Date", "N/A"),
                "pm25": row.get("PM2.5", None),
                "pm10": row.get("PM10", None),
                "no2": row.get("NO2", None),
                "so2": None,
                "co": None,
                "o3": None,
                "aqi": row.get("AQI", int(row.get("PM2.5", 0)))
            }

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                },
                "properties": properties
            }
            features.append(feature)
            
    except Exception as e:
        print(f"Error processing AQI data: {e}")

    return {
        "type": "FeatureCollection",
        "features": features
    }
