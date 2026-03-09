import pandas as pd
import numpy as np
import datetime
import os

# Set seed for reproducibility
np.random.seed(42)

# Date range for 2025 and 2026
date_rng = pd.date_range(start='2025-01-01', end='2026-12-31', freq='D')
cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Bhopal']
locations = ['LOC_001', 'LOC_002', 'LOC_003', 'LOC_004', 'LOC_005']

data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(data_dir, exist_ok=True)

# 1. Air and Humidity Data (Climate)
climate_data = []
for date in date_rng:
    for city in cities:
        climate_data.append([
            date.strftime('%Y-%m-%d'),
            city,
            np.round(np.random.uniform(20, 45), 1), # Temp Max
            np.round(np.random.uniform(10, 30), 1), # Temp Min
            np.round(np.random.uniform(40, 95), 1), # Humidity %
            np.round(np.random.uniform(0, 100), 1), # Rainfall
            int(np.random.uniform(40, 400)),        # AQI
            np.random.choice(['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor'])
        ])

df_climate = pd.DataFrame(climate_data, columns=['Date', 'City', 'Temperature_Max_C', 'Temperature_Min_C', 'Humidity_Percent', 'Rainfall_mm', 'AQI', 'AQI_Category'])
path_climate = os.path.join(data_dir, 'smart_city_air_humidity_2025_2026.csv')
df_climate.to_csv(path_climate, index=False)
print(f"Created: {path_climate}")

# 2. Water Quality Data
water_data = []
for date in date_rng:
    for loc in locations:
        water_data.append([
            date.strftime('%Y-%m-%d'),
            loc,
            np.round(np.random.uniform(6.5, 8.5), 1), # pH
            np.round(np.random.uniform(10, 100), 1),  # WQI
            np.random.choice(['Safe', 'Moderate', 'Unsafe']), # Status
            np.round(np.random.uniform(1, 15), 1)     # Turbidity (NTU)
        ])
df_water = pd.DataFrame(water_data, columns=['Date', 'Location_ID', 'pH_Level', 'WQI', 'Safety_Status', 'Turbidity_NTU'])
path_water = os.path.join(data_dir, 'smart_city_water_quality_2025_2026.csv')
df_water.to_csv(path_water, index=False)
print(f"Created: {path_water}")

# 3. Traffic Data
traffic_data = []
# Generate fewer rows for traffic so it doesn't get huge (daily aggregates instead of 15 min intervals)
for date in date_rng:
    for loc in locations:
        traffic_data.append([
            date.strftime('%Y-%m-%d'),
            loc,
            int(np.random.uniform(1000, 15000)), # Vehicles per day
            np.round(np.random.uniform(10, 60), 1), # Avg Speed Daily
            np.random.choice(['Low', 'Moderate', 'High', 'Severe']) # Average Congestion
        ])
df_traffic = pd.DataFrame(traffic_data, columns=['Date', 'Location_ID', 'Daily_Vehicle_Count', 'Average_Speed_kmh', 'Avg_Congestion_Level'])
path_traffic = os.path.join(data_dir, 'smart_city_traffic_2025_2026.csv')
df_traffic.to_csv(path_traffic, index=False)
print(f"Created: {path_traffic}")

# 4. Crime Data
crime_data = []
crime_types = ['Theft', 'Assault', 'Burglary', 'Vandalism', 'Fraud']
for date in date_rng:
    for city in cities:
        crime_data.append([
            date.strftime('%Y-%m-%d'),
            city,
            np.random.choice(crime_types),
            int(np.random.uniform(0, 20)), # Incidents
            np.random.choice(['Resolved', 'Under Investigation', 'Open']) # Status
        ])
df_crime = pd.DataFrame(crime_data, columns=['Date', 'City', 'Crime_Type', 'Daily_Incidents', 'Investigation_Status'])
path_crime = os.path.join(data_dir, 'smart_city_crime_2025_2026.csv')
df_crime.to_csv(path_crime, index=False)
print(f"Created: {path_crime}")

print("Data generation completed.")
