import os
import psycopg2
from config import settings
from database import normalize_dsn

def run_sql_file_raw(filename):
    """Utility to run a raw SQL file."""
    if not os.path.exists(filename):
        raise FileNotFoundError(f"{filename} not found.")

    with open(filename, "r") as f:
        sql = f.read()
    
    conn = psycopg2.connect(normalize_dsn(settings.db_con_str))
    conn.autocommit = True
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
    finally:
        conn.close()

def seed_db():
    """
    Seeds the database using DDL.sql and DML.sql.
    Replaces the old mock_data based seeding.
    """
    # SQL files are in the backend directory
    # If this is called from routes, we need to find the correct path
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ddl_path = os.path.join(base_path, "DDL.sql")
    dml_path = os.path.join(base_path, "DML.sql")

    print(f"Seeding from: {ddl_path} and {dml_path}")
    
    run_sql_file_raw(ddl_path)
    run_sql_file_raw(dml_path)
    
    # Return a dummy count or parse DML to count inserts if really needed
    return "Complete"
