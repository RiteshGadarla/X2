import requests
import json
import os
import sys

# Configuration
BASE_URL = "http://134.33.132.134"
ENDPOINT = "/luka-aegis/api/admin/execute-sql"
PASSWORD = "Welcome@123Luka"

def inject_sql_file(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found.")
        return False

    print(f"Reading {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    url = f"{BASE_URL.rstrip('/')}{ENDPOINT}"
    payload = {
        "password": PASSWORD,
        "sql": sql_content
    }

    print(f"Injecting SQL from {file_path} to {url}...")
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('message')}")
            print(f"Rows affected: {result.get('rows_affected')}")
            return True
        else:
            print(f"Error {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return False

if __name__ == "__main__":
    # Allow overriding base URL from command line
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1]
    
    print(f"Using Base URL: {BASE_URL}")
    
    # Inject DDL first
    ddl_success = inject_sql_file("DDL.sql")
    
    if ddl_success:
        # Inject DML next
        inject_sql_file("DML.sql")
    else:
        print("Skipping DML injection due to DDL failure.")
