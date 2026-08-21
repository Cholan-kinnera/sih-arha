from typing import List, Set
from packages.shared.scheme.exceptions import ValidationErrorDetail
from packages.shared.scheme.models import EligibilityGroup, EligibilityTree, LeafRule, SchemeSpecification


class SemanticValidator:
    """Validator performing semantic cross-reference checks on SchemeSpecification objects."""

    @classmethod
    def validate(cls, scheme: SchemeSpecification, file_path: str = "specification") -> List[ValidationErrorDetail]:
        """Perform semantic validation rules and return a list of validation errors."""
        errors: List[ValidationErrorDetail] = []

        # 1. Check for Duplicate Source IDs
        source_ids: Set[str] = set()
        for idx, source in enumerate(scheme.sources):
            if source.id in source_ids:
                errors.append(
                    ValidationErrorDetail(
                        path=f"sources[{idx}].id",
                        reason=f"Duplicate source ID '{source.id}' found in sources registry.",
                        error_code="DUPLICATE_SOURCE_ID",
                    )
                )
            else:
                source_ids.add(source.id)

        # Collect Document Types declared in documents[] section
        defined_document_types: Set[str] = {doc.type for doc in scheme.documents}

        # Collect Rule IDs and check source references & document references in AST
        seen_rule_ids: Set[str] = set()

        def validate_leaf_rule(rule: LeafRule, path_prefix: str) -> None:
            # Check for Duplicate Rule ID
            if rule.rule_id in seen_rule_ids:
                errors.append(
                    ValidationErrorDetail(
                        path=f"{path_prefix}.rule_id",
                        rule_id=rule.rule_id,
                        reason=f"Duplicate rule ID '{rule.rule_id}' found in eligibility tree.",
                        error_code="DUPLICATE_RULE_ID",
                    )
                )
            else:
                seen_rule_ids.add(rule.rule_id)

            # Check for Dangling Source Reference
            if rule.source_id not in source_ids:
                errors.append(
                    ValidationErrorDetail(
                        path=f"{path_prefix}.source_id",
                        rule_id=rule.rule_id,
                        reason=f"Source ID '{rule.source_id}' does not exist in sources registry.",
                        error_code="DANGLING_SOURCE_REFERENCE",
                    )
                )

            # Check for Dangling Document Reference in evidence requirement
            if rule.evidence_requirement and rule.evidence_requirement.verification_required:
                doc_type = rule.evidence_requirement.document_type
                if doc_type not in defined_document_types:
                    errors.append(
                        ValidationErrorDetail(
                            path=f"{path_prefix}.evidence_requirement.document_type",
                            rule_id=rule.rule_id,
                            reason=f"Document type '{doc_type}' referenced by rule evidence requirement is not defined in documents[] section.",
                            error_code="DANGLING_DOCUMENT_REFERENCE",
                        )
                    )

        def traverse_group(group: EligibilityGroup, path_prefix: str) -> None:
            for idx, r in enumerate(group.rules):
                validate_leaf_rule(r, f"{path_prefix}.rules[{idx}]")
            for idx, g in enumerate(group.groups):
                traverse_group(g, f"{path_prefix}.groups[{idx}]")

        def traverse_tree(tree: EligibilityTree) -> None:
            for idx, r in enumerate(tree.rules):
                validate_leaf_rule(r, f"eligibility.rules[{idx}]")
            for idx, g in enumerate(tree.groups):
                traverse_group(g, f"eligibility.groups[{idx}]")

        traverse_tree(scheme.eligibility)

        return errors


def validate_scheme(scheme: SchemeSpecification, file_path: str = "specification") -> List[ValidationErrorDetail]:
    """Helper function to validate a SchemeSpecification object semantically."""
    return SemanticValidator.validate(scheme, file_path=file_path)
