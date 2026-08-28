"""Database Session Management and Lifecycle supporting Async and Sync modes."""

from __future__ import annotations

import logging
from typing import AsyncGenerator, Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import Session, sessionmaker

from apps.api.app.config import settings

logger = logging.getLogger(__name__)

# --- Async Engine & Session (Canonical for Phase 6A/6B) ---
async_db_url = settings.get_async_database_url()

async_engine_kwargs = {
    "echo": settings.DB_ECHO,
}

if not async_db_url.startswith("sqlite"):
    async_engine_kwargs.update({
        "pool_size": settings.DATABASE_POOL_SIZE,
        "max_overflow": settings.DATABASE_MAX_OVERFLOW,
        "pool_timeout": settings.DATABASE_POOL_TIMEOUT,
        "pool_pre_ping": True,
    })

async_engine: AsyncEngine = create_async_engine(
    async_db_url,
    **async_engine_kwargs,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Dependency providing an async database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_async_db_connectivity(session: Optional[AsyncSession] = None) -> bool:
    """Test live database connectivity via async lightweight query."""
    if session is not None:
        try:
            await session.execute(text("SELECT 1"))
            return True
        except Exception as e:
            logger.warning("Session async DB connectivity check failed: %s", e)
            return False

    try:
        async with async_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.warning("Async DB connectivity check failed: %s", e)
        return False


# --- Sync Engine & Session (For Alembic migrations, tooling, and sync test helpers) ---
sync_db_url = settings.get_sync_database_url()

sync_engine_kwargs = {
    "echo": settings.DB_ECHO,
}
if not sync_db_url.startswith("sqlite"):
    sync_engine_kwargs.update({
        "pool_size": settings.DATABASE_POOL_SIZE,
        "max_overflow": settings.DATABASE_MAX_OVERFLOW,
        "pool_timeout": settings.DATABASE_POOL_TIMEOUT,
        "pool_pre_ping": True,
    })

engine = create_engine(sync_db_url, **sync_engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency providing a synchronous database session per request."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def check_db_connectivity(session: Optional[Session] = None) -> bool:
    """Test live database connectivity synchronously."""
    if session is not None:
        try:
            session.execute(text("SELECT 1"))
            return True
        except Exception as e:
            logger.warning("Session DB connectivity check failed: %s", e)
            return False

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        logger.warning("Database connectivity check failed: %s", e)
        return False
