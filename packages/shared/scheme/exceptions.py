from typing import List, Optional
from pydantic import BaseModel


class ValidationErrorDetail(BaseModel):
    """Detailed information for a single structural or semantic validation error."""
    path: str
    rule_id: Optional[str] = None
    reason: str
    error_code: str


class SchemeValidationError(Exception):
    """Exception raised when a scheme YAML file fails structural or semantic validation."""

    def __init__(self, file_path: str, errors: List[ValidationErrorDetail]):
        self.file_path = file_path
        self.errors = errors
        error_summary = "\n".join(
            f"  - [{e.error_code}] {e.path}"
            + (f" (rule_id: {e.rule_id})" if e.rule_id else "")
            + f": {e.reason}"
            for e in errors
        )
        message = f"Invalid scheme specification at '{file_path}':\n{error_summary}"
        super().__init__(message)
