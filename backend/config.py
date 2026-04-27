from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    def __init__(self) -> None:
        self.app_env = os.getenv("APP_ENV", "development")
        self.backend_host = os.getenv("BACKEND_HOST", "0.0.0.0")
        self.backend_port = int(os.getenv("BACKEND_PORT", "8000"))
        self.backend_reload = os.getenv("BACKEND_RELOAD", "false").lower() == "true"
        self.db_con_str = os.getenv("DB_CON_STR", "")

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
