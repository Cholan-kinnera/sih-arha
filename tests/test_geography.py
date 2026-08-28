"""Unit Tests for Geography Normalization and Geospatial Validation."""

import pytest
from src.data.geography import GeographyNormalizer


@pytest.fixture
def normalizer():
    return GeographyNormalizer()


def test_state_normalization(normalizer):
    assert normalizer.normalize_state("KERELA") == "KERALA"
    assert normalizer.normalize_state("Himachal") == "HIMACHAL PRADESH"
    assert normalizer.normalize_state("CHATISGARH") == "CHHATTISGARH"
    assert normalizer.normalize_state("Orissa") == "ODISHA"
    assert normalizer.normalize_state("ANDAMAN & NICOBAR ISLANDS") == "ANDAMAN AND NICOBAR ISLANDS"
    assert normalizer.normalize_state("Assam") == "ASSAM"
    assert normalizer.normalize_state("SIKKIM") == "SIKKIM"


def test_ner_states_membership(normalizer):
    ner_expected = {
        "ARUNACHAL PRADESH", "ASSAM", "MANIPUR", "MEGHALAYA",
        "MIZORAM", "NAGALAND", "SIKKIM", "TRIPURA"
    }
    for state in ner_expected:
        assert normalizer.is_ner_state(state) is True
        assert normalizer.is_ner_state(state.lower()) is True

    assert normalizer.is_ner_state("KERALA") is False
    assert normalizer.is_ner_state("TAMIL NADU") is False
    assert normalizer.is_ner_state("MAHARASHTRA") is False


def test_district_normalization(normalizer):
    assert normalizer.normalize_district("ANJAW (LOHIT)") == "ANJAW"
    assert normalizer.normalize_district("PAPUMPARE") == "PAPUM PARE"
    assert normalizer.normalize_district("KAMRUP (M)") == "KAMRUP METROPOLITAN"
    assert normalizer.normalize_district("KAMRUP (METRO)") == "KAMRUP METROPOLITAN"
    assert normalizer.normalize_district("Karimgang") == "KARIMGANJ"
    assert normalizer.normalize_district("Hilakandi") == "HAILAKANDI"
    assert normalizer.normalize_district("NORTH DISITRICT", state_canonical="SIKKIM") == "NORTH SIKKIM"
    assert normalizer.normalize_district("EAST", state_canonical="SIKKIM") == "EAST SIKKIM"


def test_subdivision_assignment(normalizer):
    assert normalizer.get_subdivision_for_state("ASSAM") == "ASSAM & MEGHALAYA"
    assert normalizer.get_subdivision_for_state("MEGHALAYA") == "ASSAM & MEGHALAYA"
    assert normalizer.get_subdivision_for_state("MANIPUR") == "NAGA MANI MIZO TRIPURA"
    assert normalizer.get_subdivision_for_state("NAGALAND") == "NAGA MANI MIZO TRIPURA"
    assert normalizer.get_subdivision_for_state("SIKKIM") == "SUB HIMALAYAN WEST BENGAL & SIKKIM"


def test_dms_coordinate_parsing(normalizer):
    lat = normalizer.parse_dms("11°19'14.94\"N")
    assert lat is not None
    assert abs(lat - 11.320817) < 1e-4

    lon = normalizer.parse_dms("76°37'31.34\"E")
    assert lon is not None
    assert abs(lon - 76.625372) < 1e-4

    gangtok_lat = normalizer.parse_dms("27° 22’ 51.88”")
    assert gangtok_lat is not None
    assert abs(gangtok_lat - 27.381078) < 1e-4


def test_bounding_box_validation(normalizer):
    # Gangtok coords in NER & India
    assert normalizer.validate_coordinates_in_india(27.33, 88.61) is True
    assert normalizer.validate_coordinates_in_ner(27.33, 88.61) is True

    # Wayanad coords in India but not NER
    assert normalizer.validate_coordinates_in_india(11.68, 76.13) is True
    assert normalizer.validate_coordinates_in_ner(11.68, 76.13) is False

    # Australia DEM coords (incompatible)
    assert normalizer.validate_coordinates_in_india(-25.0, 145.0) is False
    assert normalizer.validate_coordinates_in_ner(-25.0, 145.0) is False
