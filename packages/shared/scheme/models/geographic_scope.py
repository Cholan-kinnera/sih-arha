from typing import List
from pydantic import BaseModel, Field, model_validator
from packages.shared.scheme.enums import GeographicLevel


class GeographicScope(BaseModel):
    """Geographic scope and targeting constraints of a scheme."""
    level: GeographicLevel = Field(..., description="Targeting scope level (NATIONAL, STATE, DISTRICT)")
    states: List[str] = Field(default_factory=list, description="List of target state names")
    districts: List[str] = Field(default_factory=list, description="List of target district names")

    @model_validator(mode="after")
    def validate_geographic_level_consistency(self) -> "GeographicScope":
        if self.level == GeographicLevel.NATIONAL:
            if self.states:
                raise ValueError("Geographic scope 'NATIONAL' must not specify restricted 'states'.")
            if self.districts:
                raise ValueError("Geographic scope 'NATIONAL' must not specify restricted 'districts'.")

        elif self.level == GeographicLevel.STATE:
            if not self.states:
                raise ValueError("Geographic scope 'STATE' requires at least one state in 'states'.")
            if self.districts:
                raise ValueError("Geographic scope 'STATE' should not specify 'districts' (use 'DISTRICT' level instead).")

        elif self.level == GeographicLevel.DISTRICT:
            if not self.states:
                raise ValueError("Geographic scope 'DISTRICT' requires parent state in 'states'.")
            if not self.districts:
                raise ValueError("Geographic scope 'DISTRICT' requires at least one district in 'districts'.")

        return self
