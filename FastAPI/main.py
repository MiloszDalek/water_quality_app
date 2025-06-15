from fastapi import FastAPI, Depends, HTTPException, Body, Query
from pydantic import BaseModel
from datetime import datetime
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal, SampleRecord
from typing import List, Annotated
from sqlalchemy.orm import Session
from typing import Literal, Optional
from starlette import status
import auth
from auth import get_current_user


app = FastAPI()
app.include_router(auth.router)

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

db_dependency = Annotated[Session, get_db]
user_dependency = Annotated[dict, Depends(get_current_user)]

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


class SaveSampleData(InputData):
    prediction: int
    confidence: float
    sample_type: Literal["all", "influent", "effluent", "sludge", "prediction"]


class SampleSummary(BaseModel):
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
    sample_type: str
    timestamp: datetime

    class Config:
        from_attributes = True


@app.get("/", status_code=status.HTTP_200_OK, response_model=None)
async def user(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    return {"User": user}


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



@app.post("/save-result", response_model=None)
def save(data: SaveSampleData = Body(...), 
        db: Session = Depends(get_db),
        user: dict = Depends(get_current_user)
        ):
    
    db_record = SampleRecord(
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
        confidence=data.confidence,
        sample_type=data.sample_type
    )

    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return {"message": "Saved successfully"}



@app.get("/samples", response_model=List[SampleSummary])
def get_all_samples(db: Session = Depends(get_db),
                     sample_type: Optional[str] = Query(None, description="Filter by sample type")
                    ):
    query = db.query(SampleRecord)
    if sample_type and sample_type != 'all':
        query = query.filter(SampleRecord.sample_type == sample_type)
    
    samples = query.order_by(SampleRecord.timestamp.desc()).all()
    
    return samples



@app.get("/samples/{sample_id}", response_model=SampleSummary)
def get_sample(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(SampleRecord).filter(SampleRecord.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample



@app.delete("/samples/{sample_id}", response_model=None)
def delete_record(sample_id: int, db: Session = Depends(get_db)): # db typu Session o wartości z Depends(get_db)
    record = db.query(SampleRecord).filter(SampleRecord.id == sample_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sample not found")

    db.delete(record)
    db.commit()

    return {"message": f"Sample with id {sample_id} has been deleted"}