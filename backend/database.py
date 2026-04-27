import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

import re

def normalize_dsn(dsn: str) -> str:
    """Fixes common DSN formatting issues like spaces after '='."""
    if not dsn or dsn.startswith("postgres"):
        return dsn
    # Fix "key= value" -> "key=value"
    return re.sub(r'(\w+)=\s+', r'\1=', dsn)

engine = create_engine(
    "postgresql+psycopg2://",
    creator=lambda: psycopg2.connect(normalize_dsn(settings.db_con_str)),
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
