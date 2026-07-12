import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env file
load_dotenv()

# If DATABASE_URL is not provided or empty, fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "") or "sqlite:///./crm.db"

# SQLite needs connect_args={"check_same_thread": False} for FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
