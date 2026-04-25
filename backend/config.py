from functools import lru_cache
from pathlib import Path
from typing import List

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
        self.app_env = self._required("APP_ENV")
        self.backend_host = self._required("BACKEND_HOST")
        self.backend_port = self._required_int("BACKEND_PORT")
        self.backend_reload = self._optional_bool("BACKEND_RELOAD", default=False)
        self.database_url = self._required("DATABASE_URL")
        self.cors_origins = self._required_csv("CORS_ORIGINS")
        self.api_secret_key = self._required("API_SECRET_KEY")

    @staticmethod
    def _required(name: str) -> str:
        value = os.getenv(name)
        if value is None or not value.strip():
            raise SettingsError(f"Missing required environment variable: {name}")
        return value.strip()

    def _required_int(self, name: str) -> int:
        value = self._required(name)
        try:
            return int(value)
        except ValueError as exc:
            raise SettingsError(f"Environment variable {name} must be an integer") from exc

    def _required_csv(self, name: str) -> List[str]:
        value = self._required(name)
        entries = [entry.strip() for entry in value.split(",") if entry.strip()]
        if not entries:
            raise SettingsError(f"Environment variable {name} must contain at least one value")
        return entries

    @staticmethod
    def _optional_bool(name: str, default: bool = False) -> bool:
        value = os.getenv(name)
        if value is None or not value.strip():
            return default

        normalized = value.strip().lower()
        if normalized in {"1", "true", "yes", "on"}:
            return True
        if normalized in {"0", "false", "no", "off"}:
            return False

        raise SettingsError(f"Environment variable {name} must be a boolean")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
