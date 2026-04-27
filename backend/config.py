from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

import os


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BASE_DIR / ".env", override=True)


class SettingsError(RuntimeError):
    pass


class Settings:
    def __init__(self) -> None:
        self.app_env = "development"
        self.backend_host = "0.0.0.0"
        self.backend_port = 5000
        self.backend_reload = False
        self.db_con_str = self._required("DB_CON_STR")

    @staticmethod
    def _required(name: str) -> str:
        value = os.getenv(name)
        if value is None or not value.strip():
            raise SettingsError(f"Missing required environment variable: {name}")
        return value.strip()


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
