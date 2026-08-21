from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field
from packages.shared.scheme.enums import SourceType


class Source(BaseModel):
    """Authoritative government publication or reference source for provenance."""
    id: str = Field(..., description="Local source identifier (e.g., SRC-001)")
    type: SourceType = Field(..., description="Type of authoritative publication")
    title: str = Field(..., description="Official title of the document or publication")
    publisher: str = Field(..., description="Official government publishing authority")
    url: str = Field(..., description="Authoritative web link / URL")
    document_reference: Optional[str] = Field(None, description="Specific section, page, or gazette clause reference")
    publication_date: Optional[date] = Field(None, description="Date of official publication")
    effective_date: Optional[date] = Field(None, description="Date when source guidelines became effective")
    retrieved_at: Optional[datetime] = Field(None, description="ISO UTC timestamp when source was accessed")
    version: Optional[str] = Field(None, description="Version of the source publication")
