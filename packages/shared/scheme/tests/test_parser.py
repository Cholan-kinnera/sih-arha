import unittest
from pathlib import Path

from packages.shared.scheme.exceptions import SchemeValidationError
from packages.shared.scheme.parser import load_scheme, parse_scheme_yaml


class TestSchemeParser(unittest.TestCase):
    def setUp(self):
        self.example_file = Path("data/schemes/examples/example-scheme.yaml")

    def test_load_valid_example_scheme(self):
        scheme = load_scheme(self.example_file)
        self.assertEqual(scheme.scheme.id, "SCHEME-SYNTH-001")
        self.assertEqual(scheme.scheme.code, "SYNTH-SHEAS-2026")
        self.assertEqual(scheme.scheme.version, "1.0.0")
        self.assertEqual(scheme.scheme.status.value, "ACTIVE")
        self.assertEqual(len(scheme.sources), 1)
        self.assertEqual(len(scheme.documents), 4)

    def test_file_not_found(self):
        with self.assertRaises(SchemeValidationError) as ctx:
            load_scheme("non_existent_path.yaml")
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "FILE_NOT_FOUND" for e in errs))

    def test_invalid_yaml_syntax(self):
        invalid_yaml = "scheme:\n  id: [unclosed_list"
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(invalid_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "YAML_SYNTAX_ERROR" for e in errs))

    def test_non_dict_yaml_root(self):
        invalid_yaml = "- list item 1\n- list item 2"
        with self.assertRaises(SchemeValidationError) as ctx:
            parse_scheme_yaml(invalid_yaml)
        errs = ctx.exception.errors
        self.assertTrue(any(e.error_code == "INVALID_YAML_ROOT" for e in errs))


if __name__ == "__main__":
    unittest.main()
