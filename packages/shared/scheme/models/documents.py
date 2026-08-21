from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentSpec(BaseModel):
    """Specification of required document evidence for application readiness."""
    type: str = Field(..., description="Canonical document type code (e.g., INCOME_CERTIFICATE)")
    required: bool = Field(True, description="Whether document is mandatory for application")
    purpose: str = Field(..., description="Explanation of why document is required")
    validity_required: bool = Field(False, description="Whether document requires unexpired validity")
    validity_period_months: Optional[int] = Field(None, description="Validity period in months (null if permanent)")
    valid_until_required: Optional[bool] = Field(False, description="Whether explicit valid_until date is required")
    acceptable_issuers: List[str] = Field(default_factory=list, description="Recognized issuing authorities")
    notes: Optional[str] = Field(None, description="Additional guidance notes for document upload")
