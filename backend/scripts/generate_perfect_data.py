import pandas as pd
import numpy as np
import datetime
import os

# Set seed for reproducibility
np.random.seed(42)

# Date range for 2025 and 2026
date_rng = pd.date_range(start='2025-01-01', end='2026-12-31', freq='D')

# Cities with baseline coords (Latitude, Longitude) for BBox mapping
cities_info = [
    {'City': 'Mumbai', 'Lat': 19.0760, 'Lng': 72.8777},
    {'City': 'Delhi', 'Lat': 28.7041, 'Lng': 77.1025},
    {'City': 'Bengaluru', 'Lat': 12.9716, 'Lng': 77.5946},
    {'City': 'Chennai', 'Lat': 13.0827, 'Lng': 80.2707},
    {'City': 'Kolkata', 'Lat': 22.5726, 'Lng': 88.3639},
    {'City': 'Hyderabad', 'Lat': 17.3850, 'Lng': 78.4867},
    {'City': 'Ahmedabad', 'Lat': 23.0225, 'Lng': 72.5714},
    {'City': 'Jaipur', 'Lat': 26.9124, 'Lng': 75.7873},
    {'City': 'Lucknow', 'Lat': 26.8467, 'Lng': 80.9462},
    {'City': 'Bhopal', 'Lat': 23.2599, 'Lng': 77.4126}
]

# Random station offsets for variations
def apply_offset(val):
    return val + np.random.uniform(-0.05, 0.05)

data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(data_dir, exist_ok=True)

# 1. Air and Humidity Data (Climate)
climate_data = []
for date in date_rng:
    for cinfo in cities_info:
        # Simulate 2 stations per city
        for s in range(2):
            station_name = f"{cinfo['City']} Station {s+1}"
            climate_data.append({
                'Date': date.strftime('%Y-%m-%d'),
                'City': cinfo['City'],
                'StationName': station_name,
                'StationId': f"{cinfo['City'][:3].upper()}{s+1}",
                'Latitude': apply_offset(cinfo['Lat']),
                'Longitude': apply_offset(cinfo['Lng']),
                'Temperature_Max_C': np.round(np.random.uniform(20, 45), 1),
                'Temperature_Min_C': np.round(np.random.uniform(10, 30), 1),
                'Humidity_Percent': np.round(np.random.uniform(40, 95), 1),
                'Rainfall_mm': np.round(np.random.uniform(0, 100), 1),
                'AQI': int(np.random.uniform(40, 400)),
                'PM2.5': np.round(np.random.uniform(10, 150), 1),
                'PM10': np.round(np.random.uniform(20, 250), 1),
                'NO2': np.round(np.random.uniform(5, 50), 1),
                'AQI_Category': np.random.choice(['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor'])
            })

df_climate = pd.DataFrame(climate_data)
path_climate = os.path.join(data_dir, 'smart_city_air_humidity_2025_2026.csv')
df_climate.to_csv(path_climate, index=False)
print(f"Created: {path_climate} ({len(df_climate)} rows)")

# 2. Water Quality Data
water_data = []
for date in date_rng:
    for cinfo in cities_info:
        # 1 water body per city
        water_data.append({
            'Date': date.strftime('%Y-%m-%d'),
            'Location': cinfo['City'] + ' Reservoir',
            'StationCode': f"W_{cinfo['City'][:3].upper()}",
            'State': cinfo['City'],
            'Latitude': apply_offset(cinfo['Lat']),
            'Longitude': apply_offset(cinfo['Lng']),
            'pH': np.round(np.random.uniform(6.5, 8.5), 1),
            'WQI': np.round(np.random.uniform(10, 100), 1),
            'DO': np.round(np.random.uniform(4, 10), 1),
            'BOD': np.round(np.random.uniform(1, 8), 1),
            'Safety_Status': np.random.choice(['Safe', 'Moderate', 'Unsafe']),
            'Turbidity_NTU': np.round(np.random.uniform(1, 15), 1)
        })

df_water = pd.DataFrame(water_data)
path_water = os.path.join(data_dir, 'smart_city_water_quality_2025_2026.csv')
df_water.to_csv(path_water, index=False)
print(f"Created: {path_water} ({len(df_water)} rows)")

# 3. Traffic Data
traffic_data = []
for date in date_rng:
    for cinfo in cities_info:
        traffic_data.append({
            'Date': date.strftime('%Y-%m-%d'),
            'City': cinfo['City'],
            'Location_ID': f"TRF_{cinfo['City'][:3].upper()}",
            'Latitude': apply_offset(cinfo['Lat']),
            'Longitude': apply_offset(cinfo['Lng']),
            'Daily_Vehicle_Count': int(np.random.uniform(1000, 15000)),
            'Average_Speed_kmh': np.round(np.random.uniform(10, 60), 1),
            'Avg_Congestion_Level': np.random.choice(['Low', 'Moderate', 'High', 'Severe'])
        })

df_traffic = pd.DataFrame(traffic_data)
path_traffic = os.path.join(data_dir, 'smart_city_traffic_2025_2026.csv')
df_traffic.to_csv(path_traffic, index=False)
print(f"Created: {path_traffic}")

# 4. Crime Data
crime_data = []
crime_types = ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Fraud']
for date in date_rng:
    for cinfo in cities_info:
        crime_data.append({
            'Date': date.strftime('%Y-%m-%d'),
            'City': cinfo['City'],
            'Latitude': apply_offset(cinfo['Lat']),
            'Longitude': apply_offset(cinfo['Lng']),
            'Crime_Type': np.random.choice(crime_types),
            'Daily_Incidents': int(np.random.uniform(0, 20)),
            'Investigation_Status': np.random.choice(['Resolved', 'Under Investigation', 'Open'])
        })

df_crime = pd.DataFrame(crime_data)
path_crime = os.path.join(data_dir, 'smart_city_crime_2025_2026.csv')
df_crime.to_csv(path_crime, index=False)
print(f"Created: {path_crime}")

print("Data generation with exact columns completed!")
