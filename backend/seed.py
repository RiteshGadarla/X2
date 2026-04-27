import sys
import os
import psycopg2
from config import settings
from database import normalize_dsn

# Ensure backend path is resolvable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_sql_file(filename):
    """Reads and executes a raw SQL file using psycopg2."""
    print(f"Executing {filename}...")
    
    if not os.path.exists(filename):
        print(f"Error: {filename} not found.")
        return False

    with open(filename, "r") as f:
        sql = f.read()
    
    try:
        conn = psycopg2.connect(normalize_dsn(settings.db_con_str))
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.close()
        print(f"Successfully finished {filename}.")
        return True
    except Exception as e:
        print(f"Error executing {filename}: {e}")
        return False

if __name__ == "__main__":
    print("Starting database seeding process using SQL files...")
    
    # Order matters: DDL first to create/update schema, then DML for data
    success_ddl = run_sql_file("DDL.sql")
    if success_ddl:
        success_dml = run_sql_file("DML.sql")
        if success_dml:
            print("\nDatabase successfully seeded from DDL.sql and DML.sql!")
        else:
            print("\nDML seeding failed.")
            sys.exit(1)
    else:
        print("\nDDL execution failed. Skipping DML.")
        sys.exit(1)
