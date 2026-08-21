import unittest
from datetime import date
from pydantic import ValidationError

from packages.shared.scheme.enums import GeographicLevel, SchemeCategory, SchemeStatus
from packages.shared.scheme.models import Benefit, GeographicScope, SchemeIdentity, SchemeMetadata


class TestSchemaValidation(unittest.TestCase):
    def test_valid_scheme_identity(self):
        identity = SchemeIdentity(
            id="SCH-001",
            code="CODE-001",
            name="Test Scheme",
            short_name="TS",
            slug="test-scheme",
            version="1.2.3",
            status=SchemeStatus.ACTIVE,
            effective_from=date(2026, 1, 1),
            effective_until=date(2026, 12, 31),
        )
        self.assertEqual(identity.version, "1.2.3")

    def test_invalid_semver_format(self):
        with self.assertRaises(ValidationError):
            SchemeIdentity(
                id="SCH-001",
                code="CODE-001",
                name="Test Scheme",
                short_name="TS",
                slug="test-scheme",
                version="v1.2",  # Invalid semver
                status=SchemeStatus.ACTIVE,
                effective_from=date(2026, 1, 1),
            )

    def test_invalid_effective_dates_ordering(self):
        with self.assertRaises(ValidationError):
            SchemeIdentity(
                id="SCH-001",
                code="CODE-001",
                name="Test Scheme",
                short_name="TS",
                slug="test-scheme",
                version="1.0.0",
                status=SchemeStatus.ACTIVE,
                effective_from=date(2026, 12, 31),
                effective_until=date(2026, 1, 1),  # Precedes effective_from
            )

    def test_geographic_scope_level_validation(self):
        # Valid NATIONAL
        geo_nat = GeographicScope(level=GeographicLevel.NATIONAL)
        self.assertEqual(geo_nat.level, GeographicLevel.NATIONAL)

        # Invalid NATIONAL with states
        with self.assertRaises(ValidationError):
            GeographicScope(level=GeographicLevel.NATIONAL, states=["Karnataka"])

        # Invalid STATE without states
        with self.assertRaises(ValidationError):
            GeographicScope(level=GeographicLevel.STATE, states=[])

        # Valid STATE
        geo_state = GeographicScope(level=GeographicLevel.STATE, states=["Karnataka"])
        self.assertEqual(len(geo_state.states), 1)

        # Invalid DISTRICT without district
        with self.assertRaises(ValidationError):
            GeographicScope(level=GeographicLevel.DISTRICT, states=["Karnataka"], districts=[])

    def test_benefit_amount_bounds(self):
        with self.assertRaises(ValidationError):
            Benefit(
                type="DIRECT_BENEFIT_TRANSFER",
                description="Test",
                amount_min=50000,
                amount_max=10000,  # Less than min
                frequency="ANNUAL",
            )


if __name__ == "__main__":
    unittest.main()
