"""Canonical Scheme Specification Package.

Provides Pydantic models, YAML parser, and semantic validator for CBIP Scheme Specifications.
"""

from packages.shared.scheme.exceptions import SchemeValidationError, ValidationErrorDetail
from packages.shared.scheme.models import SchemeSpecification
from packages.shared.scheme.parser import load_scheme, parse_scheme_yaml
from packages.shared.scheme.validator import SemanticValidator, validate_scheme

__all__ = [
    "SchemeSpecification",
    "SchemeValidationError",
    "ValidationErrorDetail",
    "load_scheme",
    "parse_scheme_yaml",
    "SemanticValidator",
    "validate_scheme",
]
