from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application Settings powered by Pydantic Settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = Field(
        "Landslide Early Warning & Risk Monitoring API",
        description="Application Title"
    )
    ENVIRONMENT: str = Field(
        "development",
        description="Environment mode: development, staging, production"
    )
    DEBUG: bool = Field(True, description="Enable debug mode")
    LOG_LEVEL: str = Field("INFO", description="Global log level")
    API_V1_STR: str = Field("/api/v1", description="API v1 route prefix")

    # Database Settings (Default: local SQLite database)
    DATABASE_URL: Optional[str] = Field(
        "sqlite+aiosqlite:///./landslide.db",
        description="SQLAlchemy database connection URL"
    )
    DB_ECHO: bool = Field(False, description="SQLAlchemy query echo logging")

    # Security & CORS
    SECRET_KEY: str = Field(
        "change_this_secret_key_in_local_env_file_only",
        description="Application secret key"
    )
    ALLOWED_HOSTS: List[str] = Field(
        default_factory=lambda: ["*"],
        description="CORS allowed origins"
    )

    def get_database_url(self) -> str:
        """Return configured database URL."""
        return self.DATABASE_URL or "sqlite+aiosqlite:///./landslide.db"


settings = Settings()
