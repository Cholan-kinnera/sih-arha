from typing import List
from pydantic import BaseModel, Field
from packages.shared.scheme.enums import SchemeCategory


class SchemeMetadata(BaseModel):
    """Institutional metadata and descriptive context for a scheme."""
    ministry: str = Field(..., description="Nodal Ministry overseeing the scheme")
    department: str = Field(..., description="Nodal Department executing the scheme")
    category: SchemeCategory = Field(..., description="Broad category taxonomy")
    description: str = Field(..., description="High-level description of purpose and scope")
    objective: str = Field(..., description="Specific policy objective")
    target_beneficiaries: List[str] = Field(default_factory=list, description="Target population groups")
    tags: List[str] = Field(default_factory=list, description="Subject taxonomy tags for RAG/UI")
