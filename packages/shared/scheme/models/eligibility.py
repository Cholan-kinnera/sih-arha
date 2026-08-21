from typing import Any, List, Optional
from pydantic import BaseModel, Field, model_validator
from packages.shared.scheme.enums import EvaluationState, LogicalOperator, RuleOperator


class EvidenceRequirement(BaseModel):
    """Evidence requirement specification for a leaf rule."""
    document_type: str = Field(..., description="Canonical document type code (e.g., INCOME_CERTIFICATE)")
    verification_required: bool = Field(True, description="Whether document evidence verification is required")


class MissingInfoBehavior(BaseModel):
    """Behavior when a citizen attribute is missing/unknown."""
    state_if_missing: EvaluationState = Field(
        EvaluationState.INSUFFICIENT_INFORMATION,
        description="Target evaluation state if attribute is unknown (INSUFFICIENT_INFORMATION or POTENTIALLY_ELIGIBLE)",
    )
    user_prompt: str = Field(..., description="User-facing prompt question to solicit missing attribute value")

    @model_validator(mode="after")
    def validate_missing_state(self) -> "MissingInfoBehavior":
        if self.state_if_missing not in (
            EvaluationState.INSUFFICIENT_INFORMATION,
            EvaluationState.POTENTIALLY_ELIGIBLE,
        ):
            raise ValueError(
                f"state_if_missing cannot be '{self.state_if_missing}'. Must be INSUFFICIENT_INFORMATION or POTENTIALLY_ELIGIBLE."
            )
        return self


class Explainability(BaseModel):
    """Human-readable explanation templates for rule evaluation outcomes."""
    success_msg: str = Field(..., description="Template message when rule passes")
    failure_msg: str = Field(..., description="Template message when rule fails")


class LeafRule(BaseModel):
    """Atomic declarative eligibility condition (leaf AST node)."""
    rule_id: str = Field(..., description="Unique rule identifier (e.g., RUL-001)")
    name: str = Field(..., description="Descriptive rule key (e.g., family_income_limit)")
    source_id: str = Field(..., description="Source citation reference (must match an id in sources[])")
    citation: str = Field(..., description="Specific citation string (e.g., Section 3.2.a)")
    attribute: str = Field(..., description="Canonical citizen attribute path (e.g., citizen.financial.annual_family_income)")
    operator: RuleOperator = Field(..., description="Comparison operator")
    value: Any = Field(..., description="Comparison threshold, range, set, or boolean target")
    unit: Optional[str] = Field(None, description="Measurement unit (e.g., INR, YEARS, HECTARES, PERCENTAGE)")

    evidence_requirement: Optional[EvidenceRequirement] = Field(None, description="Required document evidence binding")
    missing_info_behavior: Optional[MissingInfoBehavior] = Field(None, description="Behavior when attribute is missing")
    explainability: Optional[Explainability] = Field(None, description="Human-readable explanation messages")

    @model_validator(mode="after")
    def validate_operator_value_compatibility(self) -> "LeafRule":
        op = self.operator
        val = self.value

        # Numeric comparison operators
        if op in (
            RuleOperator.LESS_THAN,
            RuleOperator.LESS_THAN_OR_EQUAL,
            RuleOperator.GREATER_THAN,
            RuleOperator.GREATER_THAN_OR_EQUAL,
        ):
            if not isinstance(val, (int, float)):
                raise ValueError(
                    f"Operator '{op}' requires a scalar numeric value (int or float). Got {type(val).__name__} ({val})."
                )

        # Range operator
        elif op == RuleOperator.IN_RANGE:
            if not isinstance(val, (list, tuple)) or len(val) != 2:
                raise ValueError(
                    f"Operator 'IN_RANGE' requires a 2-element list [min, max]. Got {val}."
                )
            min_val, max_val = val[0], val[1]
            if not isinstance(min_val, (int, float)) or not isinstance(max_val, (int, float)):
                raise ValueError(f"Operator 'IN_RANGE' bounds must be numeric. Got {val}.")
            if min_val > max_val:
                raise ValueError(f"Operator 'IN_RANGE' min bound ({min_val}) cannot exceed max bound ({max_val}).")

        # Set membership operators
        elif op in (RuleOperator.IN_SET, RuleOperator.NOT_IN_SET):
            if not isinstance(val, (list, tuple, set)) or len(val) == 0:
                raise ValueError(f"Operator '{op}' requires a non-empty list or set of allowed values. Got {val}.")

        # Boolean assertion operators
        elif op in (RuleOperator.IS_TRUE, RuleOperator.IS_FALSE):
            if val is not None and not isinstance(val, bool):
                raise ValueError(f"Operator '{op}' value should be boolean or null. Got {type(val).__name__}.")

        return self


class EligibilityGroup(BaseModel):
    """Combinatorial rule group node (nested AST node)."""
    operator: LogicalOperator = Field(..., description="Logical operator (AND, OR, NOT)")
    name: Optional[str] = Field(None, description="Optional group descriptor name")
    rules: List[LeafRule] = Field(default_factory=list, description="Leaf rules in this group")
    groups: List["EligibilityGroup"] = Field(default_factory=list, description="Nested subgroup nodes")

    @model_validator(mode="after")
    def validate_group_contents(self) -> "EligibilityGroup":
        if not self.rules and not self.groups:
            raise ValueError(f"EligibilityGroup '{self.name or 'unnamed'}' must contain at least one rule or subgroup.")

        if self.operator == LogicalOperator.NOT:
            total_elements = len(self.rules) + len(self.groups)
            if total_elements != 1:
                raise ValueError(
                    f"Logical operator 'NOT' group must contain exactly one child element (rule or group). Found {total_elements}."
                )
        return self


# Enable self-referencing nested EligibilityGroup Pydantic model
EligibilityGroup.model_rebuild()


class EligibilityTree(BaseModel):
    """Root container for the declarative eligibility Abstract Syntax Tree."""
    operator: LogicalOperator = Field(LogicalOperator.AND, description="Root logical operator")
    groups: List[EligibilityGroup] = Field(default_factory=list, description="Logical rule groups")
    rules: List[LeafRule] = Field(default_factory=list, description="Root-level leaf rules")

    @model_validator(mode="after")
    def validate_tree_non_empty(self) -> "EligibilityTree":
        if not self.rules and not self.groups:
            raise ValueError("Root eligibility tree must contain at least one rule or rule group.")
        return self
