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

    PROJECT_NAME: str = Field("Citizen Benefits Intelligence Platform API", description="Application Title")
    ENVIRONMENT: str = Field("development", description="Environment mode: development, staging, production")
    DEBUG: bool = Field(True, description="Enable debug mode")
    LOG_LEVEL: str = Field("INFO", description="Global log level")
    API_V1_STR: str = Field("/api/v1", description="API v1 route prefix")

    # Database Settings
    POSTGRES_SERVER: str = Field("localhost", description="PostgreSQL host")
    POSTGRES_PORT: int = Field(5432, description="PostgreSQL port")
    POSTGRES_USER: str = Field("postgres", description="PostgreSQL username")
    POSTGRES_PASSWORD: str = Field("postgres", description="PostgreSQL password")
    POSTGRES_DB: str = Field("cbip_dev", description="PostgreSQL database name")

    DATABASE_URL: Optional[str] = Field(
        None, description="Fully qualified Async SQLAlchemy database connection URL"
    )
    DB_ECHO: bool = Field(False, description="SQLAlchemy query echo logging")
    DB_POOL_SIZE: int = Field(5, description="Async engine connection pool size")
    DB_MAX_OVERFLOW: int = Field(10, description="Max overflow connections")

    # Security
    SECRET_KEY: str = Field("change_this_secret_key_in_local_env_file_only", description="Application secret key")
    ALLOWED_HOSTS: List[str] = Field(default_factory=lambda: ["*"], description="CORS allowed origins")

    def get_database_url(self) -> str:
        """Construct database connection string if not explicitly set."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
