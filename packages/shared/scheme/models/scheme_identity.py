from datetime import date
from typing import Optional, Union
import re

from pydantic import BaseModel, Field, field_validator, model_validator
from packages.shared.scheme.enums import SchemeStatus

SEMVER_REGEX = re.compile(r"^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$")


class SchemeIdentity(BaseModel):
    """Core identity and lifecycle metadata for a scheme."""
    id: str = Field(..., description="Unique scheme identifier (e.g., SCHEME-KAR-001)")
    code: str = Field(..., description="Official government scheme code (e.g., PM-KISAN-2026)")
    name: str = Field(..., description="Full official title of the scheme")
    short_name: str = Field(..., description="Abbreviated name or acronym")
    slug: str = Field(..., description="URL-friendly slug identifier")
    version: str = Field(..., description="Semantic version string (e.g., 1.0.0)")
    status: SchemeStatus = Field(..., description="Lifecycle status")
    effective_from: date = Field(..., description="Date when scheme rules became effective")
    effective_until: Optional[date] = Field(None, description="Sunset date if scheme is expired")

    @field_validator("version")
    @classmethod
    def validate_semver(cls, v: str) -> str:
        if not SEMVER_REGEX.match(v):
            raise ValueError(f"Version '{v}' is not a valid semantic version (must match MAJOR.MINOR.PATCH format).")
        return v

    @model_validator(mode="after")
    def validate_temporal_consistency(self) -> "SchemeIdentity":
        if self.effective_until is not None and self.effective_until < self.effective_from:
            raise ValueError(
                f"effective_until ({self.effective_until}) cannot precede effective_from ({self.effective_from})."
            )
        return self
