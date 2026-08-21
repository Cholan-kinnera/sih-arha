from typing import Optional
from pydantic import BaseModel, Field, model_validator
from packages.shared.scheme.enums import BenefitFrequency, BenefitType


class Benefit(BaseModel):
    """Specification of financial or non-financial benefits provided by a scheme."""
    type: BenefitType = Field(..., description="Classification of benefit")
    description: str = Field(..., description="Summary description of benefit")
    amount_min: Optional[float] = Field(None, description="Minimum monetary benefit amount")
    amount_max: Optional[float] = Field(None, description="Maximum monetary benefit amount")
    frequency: BenefitFrequency = Field(BenefitFrequency.ONE_TIME, description="Disbursement frequency")
    currency: str = Field("INR", description="Currency ISO code")

    @model_validator(mode="after")
    def validate_amount_bounds(self) -> "Benefit":
        if self.amount_min is not None and self.amount_max is not None:
            if self.amount_max < self.amount_min:
                raise ValueError(
                    f"Benefit amount_max ({self.amount_max}) cannot be less than amount_min ({self.amount_min})."
                )
        return self
