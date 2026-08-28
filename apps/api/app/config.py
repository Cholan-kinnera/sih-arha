"""Application Settings & Environment Configuration for LEWS FastAPI Backend."""

from __future__ import annotations

import os
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
        description="Application Title",
    )
    ENVIRONMENT: str = Field(
        "development",
        description="Environment mode: development, staging, production",
    )
    DEBUG: bool = Field(True, description="Enable debug mode")
    LOG_LEVEL: str = Field("INFO", description="Global log level")
    API_V1_STR: str = Field("/api/v1", description="API v1 route prefix")

    # PostgreSQL / PostGIS Database Settings (Supabase / Render Compatible)
    POSTGRES_HOST: str = Field("localhost", description="Postgres host")
    POSTGRES_PORT: int = Field(5432, description="Postgres port")
    POSTGRES_DB: str = Field("lews", description="Postgres database name")
    POSTGRES_USER: str = Field("postgres", description="Postgres user")
    POSTGRES_PASSWORD: str = Field("postgres", description="Postgres password")

    DATABASE_URL: Optional[str] = Field(
        None,
        description="Canonical async database URL (e.g. postgresql+asyncpg://...)",
    )
    DATABASE_POOL_SIZE: int = Field(10, description="SQLAlchemy connection pool size")
    DATABASE_MAX_OVERFLOW: int = Field(20, description="SQLAlchemy connection pool max overflow")
    DATABASE_POOL_TIMEOUT: int = Field(30, description="SQLAlchemy connection pool timeout in seconds")
    DB_ECHO: bool = Field(False, description="SQLAlchemy query echo logging")

    # Security & CORS
    SECRET_KEY: str = Field(
        "change_this_secret_key_in_local_env_file_only",
        description="Application secret key",
    )
    ALLOWED_HOSTS: List[str] = Field(
        default_factory=lambda: ["*"],
        description="CORS allowed origins",
    )

    def get_async_database_url(self) -> str:
        """Return configured async database URL for application services."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("sqlite:///"):
                url = url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
            return url
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    def get_sync_database_url(self) -> str:
        """Return synchronous database URL for Alembic migrations and tooling."""
        url = self.get_async_database_url()
        if "postgresql+asyncpg://" in url:
            return url.replace("postgresql+asyncpg://", "postgresql+psycopg2://", 1)
        if "sqlite+aiosqlite:///" in url:
            return url.replace("sqlite+aiosqlite:///", "sqlite:///", 1)
        return url

    def get_database_url(self) -> str:
        """Default database URL helper."""
        return self.get_async_database_url()


settings = Settings()
