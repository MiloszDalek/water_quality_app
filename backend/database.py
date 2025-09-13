from sqlalchemy import create_engine, Column, Integer, Float, String, Boolean, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import date
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise Exception("DATABASE_URL not found in .env")

DB_URL = DATABASE_URL

engine = create_engine(DB_URL)  #  , connect_args={"check_same_thread": False}) - for sqlite only
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class SampleRecord(Base):
    __tablename__ = "samples"

    id = Column(Integer, primary_key=True, index=True)
    Ammonium = Column(Float, nullable=True)
    Phosphate = Column(Float, nullable=True)
    COD = Column(Float, nullable=True)
    BOD = Column(Float, nullable=True)
    Conductivity = Column(Float, nullable=True)
    PH = Column(Float, nullable=True)
    Nitrogen = Column(Float, nullable=True)
    Nitrate = Column(Float, nullable=True)
    Turbidity = Column(Float, nullable=True)
    TSS = Column(Float, nullable=True)
    prediction = Column(Integer, nullable=True)
    confidence = Column(Float, nullable=True)
    sample_type = Column(String, nullable=True)
    timestamp = Column(Date, default=date.today)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="samples")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    samples = relationship("SampleRecord", back_populates="user")
