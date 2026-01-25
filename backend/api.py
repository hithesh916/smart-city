
from fastapi import FastAPI
import pandas as pd, pickle

app = FastAPI()
model = pickle.load(open("model/model.pkl","rb"))

@app.get("/predict")
def predict():
    df = pd.read_csv("data/smart_city_data.csv")
    X = df.drop(["area","label"],axis=1)
    df["prediction"] = model.predict(X)
    return df.to_dict(orient="records")
