import unittest
from pathlib import Path

from packages.shared.scheme.exceptions import SchemeValidationError
from packages.shared.scheme.parser import load_scheme, parse_scheme_yaml


class TestSemanticValidation(unittest.TestCase):
    def setUp(self):
        self.example_file = Path("data/schemes/examples/example-scheme.yaml")

    def test_duplicate_source_id_detection(self):
        with open(self.example_file, "r") as f:
            content = f.read()

        # Duplicate the source entry in YAML
        duplicate_source_yaml = content.replace(
          "  - id: \"SRC-SYNTH-001\"",
          "  - id: \"SRC-SYNTH-001\"\n    type: \"GAZETTE_NOTIFICATION\"\n    title: \"T1\"\n    publisher: \"P1\"\n    url: \"https://a.com\"\n  - id: \"SRC-SYNTH-001\""
        )
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(duplicate_source_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "DUPLICATE_SOURCE_ID" for e in errs))

    def test_dangling_source_reference_detection(self):
        with open(self.example_file, "r") as f:
            content = f.read()

        # Change source_id in a rule to a non-existent ID
        dangling_yaml = content.replace('source_id: "SRC-SYNTH-001"', 'source_id: "SRC-9999"', 1)
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(dangling_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "DANGLING_SOURCE_REFERENCE" for e in errs))

    def test_dangling_document_reference_detection(self):
        with open(self.example_file, "r") as f:
            content = f.read()

        # Change evidence requirement document_type to a non-existent document
        dangling_doc_yaml = content.replace('document_type: "INCOME_CERTIFICATE"', 'document_type: "UNKNOWN_DOC_TYPE"', 1)
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(dangling_doc_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "DANGLING_DOCUMENT_REFERENCE" for e in errs))

    def test_duplicate_rule_id_detection(self):
        with open(self.example_file, "r") as f:
            content = f.read()

        # Duplicate a rule ID
        duplicate_rule_yaml = content.replace('rule_id: "RUL-002"', 'rule_id: "RUL-001"')
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(duplicate_rule_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "DUPLICATE_RULE_ID" for e in errs))


if __name__ == "__main__":
    unittest.main()
