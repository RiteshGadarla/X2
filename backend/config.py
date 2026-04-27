from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

import os

class Settings:
    def __init__(self) -> None:
        self.app_env = os.getenv("APP_ENV", "development")
        self.backend_host = os.getenv("BACKEND_HOST", "0.0.0.0")
        self.backend_port = int(os.getenv("BACKEND_PORT", "5000"))
        self.backend_reload = os.getenv("BACKEND_RELOAD", "false").lower() == "true"
        self.db_con_str = os.getenv("DATABASE_URL", "a")

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
