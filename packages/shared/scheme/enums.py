from enum import Enum


class SchemeStatus(str, Enum):
    """Lifecycle status of a scheme specification."""
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    DEPRECATED = "DEPRECATED"
    SUPERSEDED = "SUPERSEDED"


class SchemeCategory(str, Enum):
    """Broad functional categories for government schemes."""
    AGRICULTURE = "AGRICULTURE"
    EDUCATION = "EDUCATION"
    HEALTHCARE = "HEALTHCARE"
    HOUSING = "HOUSING"
    FINANCIAL_INCLUSION = "FINANCIAL_INCLUSION"
    SOCIAL_SECURITY = "SOCIAL_SECURITY"
    WOMEN_AND_CHILD = "WOMEN_AND_CHILD"
    SCHOLARSHIP = "SCHOLARSHIP"
    OTHER = "OTHER"


class GeographicLevel(str, Enum):
    """Targeting scope level of a scheme."""
    NATIONAL = "NATIONAL"
    STATE = "STATE"
    DISTRICT = "DISTRICT"


class SourceType(str, Enum):
    """Types of authoritative government publications/sources."""
    GAZETTE_NOTIFICATION = "GAZETTE_NOTIFICATION"
    OFFICIAL_PORTAL = "OFFICIAL_PORTAL"
    SCHEME_GUIDELINE = "SCHEME_GUIDELINE"
    EXECUTIVE_ORDER = "EXECUTIVE_ORDER"
    OTHER = "OTHER"


class RuleOperator(str, Enum):
    """Leaf rule comparison operators for eligibility evaluation."""
    EQUALS = "EQUALS"
    NOT_EQUALS = "NOT_EQUALS"
    LESS_THAN = "LESS_THAN"
    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL"
    GREATER_THAN = "GREATER_THAN"
    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL"
    IN_RANGE = "IN_RANGE"
    IN_SET = "IN_SET"
    NOT_IN_SET = "NOT_IN_SET"
    IS_TRUE = "IS_TRUE"
    IS_FALSE = "IS_FALSE"


class LogicalOperator(str, Enum):
    """Logical operators for combinatorial rule nodes."""
    AND = "AND"
    OR = "OR"
    NOT = "NOT"


class EvaluationState(str, Enum):
    """Explicit deterministic eligibility evaluation result states."""
    ELIGIBLE = "ELIGIBLE"
    NOT_ELIGIBLE = "NOT_ELIGIBLE"
    POTENTIALLY_ELIGIBLE = "POTENTIALLY_ELIGIBLE"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"


class BenefitType(str, Enum):
    """Types of welfare benefits provided by schemes."""
    DIRECT_BENEFIT_TRANSFER = "DIRECT_BENEFIT_TRANSFER"
    SUBSIDY = "SUBSIDY"
    INSURANCE_COVER = "INSURANCE_COVER"
    LOAN = "LOAN"
    SERVICE = "SERVICE"
    OTHER = "OTHER"


class BenefitFrequency(str, Enum):
    """Disbursement frequency of benefits."""
    ONE_TIME = "ONE_TIME"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    ANNUAL = "ANNUAL"
    IRREGULAR = "IRREGULAR"


class ApplicationChannelType(str, Enum):
    """Types of application channels available to citizens."""
    ONLINE_PORTAL = "ONLINE_PORTAL"
    CSC_CENTER = "CSC_CENTER"
    DISTRICT_OFFICE = "DISTRICT_OFFICE"
    MOBILE_APP = "MOBILE_APP"
    OFFLINE_COUNSELOR = "OFFLINE_COUNSELOR"
