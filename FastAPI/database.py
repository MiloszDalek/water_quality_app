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
