from pathlib import Path
from typing import Any, Dict, Union
import yaml
from pydantic import ValidationError

from packages.shared.scheme.exceptions import SchemeValidationError, ValidationErrorDetail
from packages.shared.scheme.models import SchemeSpecification
from packages.shared.scheme.validator import validate_scheme


def parse_scheme_yaml(yaml_content: str, file_path: str = "yaml_string") -> SchemeSpecification:
    """Parse YAML content string, perform Pydantic structural and semantic validation."""
    try:
        raw_data: Any = yaml.safe_load(yaml_content)
    except yaml.YAMLError as exc:
        raise SchemeValidationError(
            file_path=file_path,
            errors=[
                ValidationErrorDetail(
                    path="root",
                    reason=f"YAML syntax error: {str(exc)}",
                    error_code="YAML_SYNTAX_ERROR",
                )
            ],
        )

    if not isinstance(raw_data, dict):
        raise SchemeValidationError(
            file_path=file_path,
            errors=[
                ValidationErrorDetail(
                    path="root",
                    reason="YAML root content must be a dictionary mapping.",
                    error_code="INVALID_YAML_ROOT",
                )
            ],
        )

    # 1. Structural Validation via Pydantic
    try:
        scheme = SchemeSpecification.model_validate(raw_data)
    except ValidationError as val_err:
        details: List[ValidationErrorDetail] = []
        for err in val_err.errors():
            loc_path = ".".join(str(p) for p in err["loc"])
            details.append(
                ValidationErrorDetail(
                    path=loc_path or "root",
                    reason=err["msg"],
                    error_code=f"STRUCTURAL_{err['type'].upper()}",
                )
            )
        raise SchemeValidationError(file_path=file_path, errors=details)

    # 2. Semantic Validation
    semantic_errors = validate_scheme(scheme, file_path=file_path)
    if semantic_errors:
        raise SchemeValidationError(file_path=file_path, errors=semantic_errors)

    return scheme


def load_scheme(path: Union[str, Path]) -> SchemeSpecification:
    """Load a scheme specification from a YAML file path."""
    file_path = Path(path)
    if not file_path.exists():
        raise SchemeValidationError(
            file_path=str(file_path),
            errors=[
                ValidationErrorDetail(
                    path="file",
                    reason=f"File not found at path: {file_path}",
                    error_code="FILE_NOT_FOUND",
                )
            ],
        )

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    return parse_scheme_yaml(content, file_path=str(file_path))
