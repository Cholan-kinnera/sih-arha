import unittest
from pydantic import ValidationError

from packages.shared.scheme.enums import LogicalOperator, RuleOperator
from packages.shared.scheme.models import EligibilityGroup, EligibilityTree, LeafRule


class TestEligibilityAST(unittest.TestCase):
    def test_valid_numeric_comparison_rule(self):
        rule = LeafRule(
            rule_id="RUL-001",
            name="income_limit",
            source_id="SRC-001",
            citation="Section 1",
            attribute="citizen.financial.annual_family_income",
            operator=RuleOperator.LESS_THAN_OR_EQUAL,
            value=300000,
            unit="INR",
        )
        self.assertEqual(rule.value, 300000)

    def test_invalid_numeric_comparison_rule(self):
        with self.assertRaises(ValidationError):
            LeafRule(
                rule_id="RUL-001",
                name="income_limit",
                source_id="SRC-001",
                citation="Section 1",
                attribute="citizen.financial.annual_family_income",
                operator=RuleOperator.LESS_THAN_OR_EQUAL,
                value="three_lakh",  # Non-numeric value for numeric comparison
                unit="INR",
            )

    def test_in_range_rule_validation(self):
        # Valid IN_RANGE
        rule_valid = LeafRule(
            rule_id="RUL-002",
            name="age_range",
            source_id="SRC-001",
            citation="Section 2",
            attribute="citizen.personal.age",
            operator=RuleOperator.IN_RANGE,
            value=[18, 30],
            unit="YEARS",
        )
        self.assertEqual(rule_valid.value, [18, 30])

        # Invalid bounds min > max
        with self.assertRaises(ValidationError):
            LeafRule(
                rule_id="RUL-002",
                name="age_range",
                source_id="SRC-001",
                citation="Section 2",
                attribute="citizen.personal.age",
                operator=RuleOperator.IN_RANGE,
                value=[30, 18],  # Invalid range
            )

    def test_in_set_rule_validation(self):
        # Valid IN_SET
        rule_set = LeafRule(
            rule_id="RUL-003",
            name="education_level",
            source_id="SRC-001",
            citation="Section 3",
            attribute="citizen.education.degree",
            operator=RuleOperator.IN_SET,
            value=["BSC", "BTECH", "BE"],
        )
        self.assertEqual(len(rule_set.value), 3)

        # Empty list for IN_SET
        with self.assertRaises(ValidationError):
            LeafRule(
                rule_id="RUL-003",
                name="education_level",
                source_id="SRC-001",
                citation="Section 3",
                attribute="citizen.education.degree",
                operator=RuleOperator.IN_SET,
                value=[],
            )

    def test_recursive_group_and_not_constraints(self):
        leaf1 = LeafRule(
            rule_id="RUL-010",
            name="r1",
            source_id="SRC-001",
            citation="c1",
            attribute="a1",
            operator=RuleOperator.IS_TRUE,
            value=True,
        )
        leaf2 = LeafRule(
            rule_id="RUL-011",
            name="r2",
            source_id="SRC-001",
            citation="c2",
            attribute="a2",
            operator=RuleOperator.IS_TRUE,
            value=True,
        )

        # Valid AND group
        and_group = EligibilityGroup(operator=LogicalOperator.AND, rules=[leaf1, leaf2])
        self.assertEqual(len(and_group.rules), 2)

        # Invalid empty group
        with self.assertRaises(ValidationError):
            EligibilityGroup(operator=LogicalOperator.AND, rules=[], groups=[])

        # Invalid NOT group with multiple children
        with self.assertRaises(ValidationError):
            EligibilityGroup(operator=LogicalOperator.NOT, rules=[leaf1, leaf2])


if __name__ == "__main__":
    unittest.main()
