import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.seed_service import seed_db

if __name__ == "__main__":
    print("Seeding database via seed_service...")
    count = seed_db()
    print(f"Done! Seeded legacy data and {count} production tickets.")
