from typing import List, Optional
from pydantic import BaseModel, Field
from packages.shared.scheme.enums import ApplicationChannelType


class ApplicationChannel(BaseModel):
    """Channel through which a citizen can apply for a scheme."""
    type: ApplicationChannelType = Field(..., description="Type of application channel")
    name: str = Field(..., description="Name of portal, office, or application point")
    url: Optional[str] = Field(None, description="Official online application URL if available")
    address_info: Optional[str] = Field(None, description="Physical office address or location details")


class ApplicationStep(BaseModel):
    """Step-by-step procedural instruction for application readiness."""
    step_number: int = Field(..., description="Sequential step index (1-based)")
    title: str = Field(..., description="Short title of the step")
    description: str = Field(..., description="Detailed instructions for the citizen")
    action_required: str = Field(..., description="Action item required from the citizen")
    estimated_days: Optional[int] = Field(None, description="Estimated processing duration in days")


class ApplicationSpec(BaseModel):
    """Application readiness specification containing channels and procedures."""
    channels: List[ApplicationChannel] = Field(default_factory=list, description="Available application channels")
    procedure: List[ApplicationStep] = Field(default_factory=list, description="Step-by-step application procedure")
