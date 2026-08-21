import sys
from pathlib import Path
from typing import List

from packages.shared.scheme.exceptions import SchemeValidationError
from packages.shared.scheme.parser import load_scheme


def validate_file(file_path: Path) -> bool:
    """Validate a single scheme specification YAML file and print formatted result."""
    try:
        scheme = load_scheme(file_path)
        print(f"✅ VALID: {file_path}")
        print(f"   Scheme ID: {scheme.scheme.id}")
        print(f"   Code     : {scheme.scheme.code}")
        print(f"   Version  : {scheme.scheme.version}")
        print(f"   Status   : {scheme.scheme.status.value}")
        return True
    except SchemeValidationError as exc:
        print(f"❌ INVALID: {file_path}")
        for err in exc.errors:
            rule_info = f" (rule_id: {err.rule_id})" if err.rule_id else ""
            print(f"   - [{err.error_code}] {err.path}{rule_info}: {err.reason}")
        return False
    except Exception as exc:
        print(f"❌ ERROR: {file_path}: {str(exc)}")
        return False


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] not in ("validate", "--help", "-h"):
        print("CBIP Scheme Specification Validator CLI")
        print("\nUsage:")
        print("  python3 -m packages.shared.scheme.cli validate <file_or_directory_path>")
        sys.exit(1)

    if sys.argv[1] in ("--help", "-h"):
        print("CBIP Scheme Specification Validator CLI")
        sys.exit(0)

    target_path = Path(sys.argv[2])
    if not target_path.exists():
        print(f"Error: Path '{target_path}' does not exist.")
        sys.exit(1)

    files_to_validate: List[Path] = []
    if target_path.is_file():
        files_to_validate.append(target_path)
    else:
        files_to_validate.extend(target_path.glob("**/*.yaml"))
        files_to_validate.extend(target_path.glob("**/*.yml"))

    if not files_to_validate:
        print(f"No YAML scheme files found under '{target_path}'.")
        sys.exit(0)

    print(f"Validating {len(files_to_validate)} scheme specification file(s)...\n")
    all_valid = True
    for f in files_to_validate:
        # Ignore canonical template file schema.yaml if present in directory search
        if f.name == "schema.yaml":
            continue
        valid = validate_file(f)
        if not valid:
            all_valid = False
        print()

    if all_valid:
        print("🎉 All scheme specification files passed validation!")
        sys.exit(0)
    else:
        print("💥 Validation failed for one or more scheme files.")
        sys.exit(1)


if __name__ == "__main__":
    main()
