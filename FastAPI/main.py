from fastapi import FastAPI, Depends, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal, PredictionRecord
from typing import List, Annotated
from sqlalchemy.orm import Session

app = FastAPI()

Base.metadata.create_all(bind=engine)

model = joblib.load("model.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://water-quality-app-ashy.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class InputData(BaseModel):
    Ammonium: float
    Phosphate: float
    COD: float
    BOD: float
    Conductivity: float
    PH: float
    Nitrogen: float
    Nitrate: float
    Turbidity: float
    TSS: float


class SaveResultData(InputData):
    prediction: int
    confidence: float


class PredictionSummary(BaseModel):
    id: int
    Ammonium: float
    Phosphate: float
    COD: float
    BOD: float
    Conductivity: float
    PH: float
    Nitrogen: float
    Nitrate: float
    Turbidity: float
    TSS: float
    prediction: int
    confidence: float
    timestamp: datetime

    class Config:
        orm_mode = True


columns = ["Ammonium (mg/l N)", "Ortho Phosphate (mg/l P)", "COD (mg/l O2)" ,"BOD (mg/l O2)", "Conductivity (mS/m)", "pH", "Nitrogen Total (mg/l N)", "Nitrate (mg/l NO3)", "Turbidity (NTU)", "TSS (mg/l)"]

@app.post("/predict")
def predict(data: InputData):
    values = [[data.Ammonium, data.Phosphate, data.COD, data.BOD, data.Conductivity, data.PH, data.Nitrogen, data.Nitrate, data.Turbidity, data.TSS]]
    
    df = pd.DataFrame(values, columns=columns)
    prediction = model.predict(df)[0]
    proba = model.predict_proba(df)[0]
    print(prediction, proba)

    confidence = proba[int(prediction)]

    return {"prediction": int(prediction),"confidence": float(100 * confidence)}



@app.post("/save-result")
def save(data: SaveResultData = Body(...)):
    db = SessionLocal()
    db_record = PredictionRecord(
        Ammonium=data.Ammonium, 
        Phosphate=data.Phosphate, 
        COD=data.COD, 
        BOD=data.BOD, 
        Conductivity=data.Conductivity, 
        PH=data.PH, 
        Nitrogen=data.Nitrogen, 
        Nitrate=data.Nitrate, 
        Turbidity=data.Turbidity, 
        TSS=data.TSS, 
        prediction=data.prediction, 
        confidence=data.confidence)

    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    db.close()
    return {"message": "Saved successfully"}



@app.get("/results", response_model=List[PredictionSummary])
def get_all_results(db: Annotated[Session, Depends(get_db)]):
    results = db.query(PredictionRecord).order_by(PredictionRecord.timestamp.desc()).all()
    return results



@app.get("/results/{prediction_id}", response_model=PredictionSummary)
def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    record = db.query(PredictionRecord).filter(PredictionRecord.id == prediction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return record



@app.delete("/results/{result_id}")
def delete_record(result_id: int, db: Annotated[Session, Depends(get_db)]): # db typu Session o wartości z Depends(get_db)
    record = db.query(PredictionRecord).filter(PredictionRecord.id == result_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Result not found")

    db.delete(record)
    db.commit()

    return {"message": f"Result with id {result_id} has been deleted"}