from sqlalchemy import create_engine, Column, Integer, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from sqlalchemy import String

DATABASE_URL = "sqlite:///./samples.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class SampleRecord(Base):
    __tablename__ = "samples"

    id = Column(Integer, primary_key=True, index=True)
    Ammonium = Column(Float, nullable=False)
    Phosphate = Column(Float, nullable=False)
    COD = Column(Float, nullable=False)
    BOD = Column(Float, nullable=False)
    Conductivity = Column(Float, nullable=False)
    PH = Column(Float, nullable=False)
    Nitrogen = Column(Float, nullable=False)
    Nitrate = Column(Float, nullable=False)
    Turbidity = Column(Float, nullable=False)
    TSS = Column(Float, nullable=False)
    prediction = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    sample_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
