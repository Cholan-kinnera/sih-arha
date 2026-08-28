"""Centralized Domain Enums for LEWS Database and Persistence Layer."""

from __future__ import annotations

from enum import Enum


class Provenance(str, Enum):
    """Data provenance classification."""
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    CLIMATOLOGICAL = "CLIMATOLOGICAL"
    SIMULATED = "SIMULATED"
    EXPERIMENTAL = "EXPERIMENTAL"


class Severity(str, Enum):
    """Canonical 4-tier landslide risk severity."""
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AlertStatus(str, Enum):
    """Operational alert lifecycle status."""
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"


class SourceStatus(str, Enum):
    """Observational data source connectivity status."""
    CONNECTED = "CONNECTED"
    DEGRADED = "DEGRADED"
    STALE = "STALE"
    OFFLINE = "OFFLINE"


class Freshness(str, Enum):
    """Data freshness category."""
    FRESH = "FRESH"
    AGING = "AGING"
    STALE = "STALE"
    OFFLINE = "OFFLINE"
