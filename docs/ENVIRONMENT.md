# Environment Strategy & Configuration

# AI-Based Early Warning & Risk Monitoring for Landslide-Prone Areas

This document outlines environment variables, secrets management, and local/deployment configuration strategy.

---

## 1. Environment Variable Catalog

| Variable Name | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Yes | `development` | Environment mode (`development`, `staging`, `production`, `test`). |
| `DATABASE_URL` | Yes | `sqlite+aiosqlite:///./landslide.db` | Async SQLAlchemy database connection string. |
| `API_BASE_URL` | Yes | `http://localhost:8000` | Backend API base URL used by web clients and simulator. |
| `PORT` | No | `8000` | HTTP port for the FastAPI server. |
| `LOG_LEVEL` | No | `INFO` | Global logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `SECRET_KEY` | Yes | *generate strong random secret* | Internal application secret for token verification and CORS protection. |
| `GEMINI_API_KEY` | No | `AIzaSy...` (optional) | Google Gemini API key for natural language situation reports and advisories. |
| `WEATHER_API_KEY` | No | `...` (optional) | External meteorological API provider key (e.g., Open-Meteo, IMD API). |

---

## 2. Secrets Management & Security Rules

1. **Strict Exclusion from Version Control**:
   - The actual `.env` file must never be committed to Git.
   - Verified present in `.gitignore`:
     ```gitignore
     .env
     .env.*
     !.env.example
     ```
2. **Template Synchronization**:
   - Every newly introduced environment variable must be documented in `docs/ENVIRONMENT.md` and added to `.env.example` with a descriptive placeholder.
3. **Pydantic Validation**:
   - Backend configurations are strongly validated at startup via `pydantic-settings` (`apps/api/src/core/config.py`).
4. **Zero Production Hardcoding**:
   - No fallbacks with hardcoded production credentials may exist in source code.

---

## 3. Local Setup Instructions

1. Copy the template file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
2. Adjust environment variables according to your local setup.
3. For basic local development and simulation, the default SQLite configuration works out-of-the-box without external database servers.
