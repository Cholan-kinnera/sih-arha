"""Geography Normalization & Geospatial Boundary Verification Module for LEWS.

Provides deterministic, rule-based geographic normalization for Indian States,
Districts, and Meteorological Subdivisions, with special focus on the 8
North-Eastern Region (NER) States.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def _load_default_config() -> Dict[str, Any]:
    """Load configuration from config/geography_mapping.json or return hardcoded fallback."""
    config_path = Path(__file__).resolve().parent.parent.parent / "config" / "geography_mapping.json"
    if config_path.exists():
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    return {
        "ner_states": [
            "ARUNACHAL PRADESH",
            "ASSAM",
            "MANIPUR",
            "MEGHALAYA",
            "MIZORAM",
            "NAGALAND",
            "SIKKIM",
            "TRIPURA",
        ],
        "state_alias_map": {
            "KERELA": "KERALA",
            "HIMACHAL": "HIMACHAL PRADESH",
            "CHATISGARH": "CHHATTISGARH",
            "ORISSA": "ODISHA",
            "PONDICHERRY": "PUDUCHERRY",
            "UTTARANCHAL": "UTTARAKHAND",
            "ANDAMAN & NICOBAR ISLANDS": "ANDAMAN AND NICOBAR ISLANDS",
        },
        "subdivision_map": {
            "ARUNACHAL PRADESH": "ARUNACHAL PRADESH",
            "ASSAM": "ASSAM & MEGHALAYA",
            "MEGHALAYA": "ASSAM & MEGHALAYA",
            "MANIPUR": "NAGA MANI MIZO TRIPURA",
            "MIZORAM": "NAGA MANI MIZO TRIPURA",
            "NAGALAND": "NAGA MANI MIZO TRIPURA",
            "TRIPURA": "NAGA MANI MIZO TRIPURA",
            "SIKKIM": "SUB HIMALAYAN WEST BENGAL & SIKKIM",
        },
        "district_alias_map": {
            "ANJAW (LOHIT)": "ANJAW",
            "LOW SUBANSIRI": "LOWER SUBANSIRI",
            "SUBANSIRI F.D": "UPPER SUBANSIRI",
            "KAMRUP (M)": "KAMRUP METROPOLITAN",
            "KAMRUP (METRO)": "KAMRUP METROPOLITAN",
            "KAMRUP METRO": "KAMRUP METROPOLITAN",
            "KARIMGANG": "KARIMGANJ",
            "HILAKANDI": "HAILAKANDI",
            "NORTH DISITRICT": "NORTH SIKKIM",
            "NORTH DISTRICT": "NORTH SIKKIM",
            "EAST DISTRICT": "EAST SIKKIM",
            "SOUTH DISTRICT": "SOUTH SIKKIM",
            "WEST DISTRICT": "WEST SIKKIM",
            "SOUTH SIKKIM": "SOUTH SIKKIM",
            "KODUGU": "KODAGU",
            "MALAPPUAM": "MALAPPURAM",
            "N & M ANDAMAN": "NORTH AND MIDDLE ANDAMAN",
        },
        "ner_bounding_box": {
            "min_latitude": 21.5,
            "max_latitude": 30.0,
            "min_longitude": 87.5,
            "max_longitude": 97.5,
        },
        "india_bounding_box": {
            "min_latitude": 6.0,
            "max_latitude": 38.0,
            "min_longitude": 68.0,
            "max_longitude": 98.0,
        },
    }


class GeographyNormalizer:
    """Deterministic normalizer for Indian administrative & meteorological geography."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        cfg = config or _load_default_config()
        self.ner_states: set[str] = set(cfg.get("ner_states", []))
        self.state_alias_map: dict[str, str] = {
            self.clean_text(k): self.clean_text(v) for k, v in cfg.get("state_alias_map", {}).items()
        }
        self.district_alias_map: dict[str, str] = {
            self.clean_text(k): self.clean_text(v) for k, v in cfg.get("district_alias_map", {}).items()
        }
        self.subdivision_map: dict[str, str] = {
            self.clean_text(k): self.clean_text(v) for k, v in cfg.get("subdivision_map", {}).items()
        }
        self.ner_bbox = cfg.get("ner_bounding_box", {"min_latitude": 21.5, "max_latitude": 30.0, "min_longitude": 87.5, "max_longitude": 97.5})
        self.india_bbox = cfg.get("india_bounding_box", {"min_latitude": 6.0, "max_latitude": 38.0, "min_longitude": 68.0, "max_longitude": 98.0})

    @staticmethod
    def clean_text(text: Optional[str]) -> str:
        """Remove leading/trailing whitespace, excess inner spaces, and standardize uppercase."""
        if text is None:
            return ""
        # Replace non-breaking spaces and other special space chars
        cleaned = re.sub(r"[\s\xa0]+", " ", str(text).strip())
        return cleaned.upper()

    def normalize_state(self, raw_state: Optional[str]) -> str:
        """Return canonical state name or cleaned string if no alias matched."""
        cleaned = self.clean_text(raw_state)
        if not cleaned:
            return "UNKNOWN"
        return self.state_alias_map.get(cleaned, cleaned)

    def normalize_district(self, raw_district: Optional[str], state_canonical: Optional[str] = None) -> str:
        """Normalize district name using explicit alias map and cleanup rules."""
        cleaned = self.clean_text(raw_district)
        if not cleaned:
            return "UNKNOWN"

        # Check explicit alias dictionary
        if cleaned in self.district_alias_map:
            return self.district_alias_map[cleaned]

        # Contextual prefix resolution for Sikkim single word districts (e.g. 'EAST' -> 'EAST SIKKIM')
        if state_canonical == "SIKKIM":
            if cleaned in {"EAST", "EAST DISTRICT", "EAST DISITRICT"}:
                return "EAST SIKKIM"
            if cleaned in {"NORTH", "NORTH DISTRICT", "NORTH DISITRICT"}:
                return "NORTH SIKKIM"
            if cleaned in {"SOUTH", "SOUTH DISTRICT", "SOUTH DISITRICT"}:
                return "SOUTH SIKKIM"
            if cleaned in {"WEST", "WEST DISTRICT", "WEST DISITRICT"}:
                return "WEST SIKKIM"

        return cleaned

    def normalize_subdivision(self, raw_subdivision: Optional[str]) -> str:
        """Standardize meteorological subdivision name."""
        cleaned = self.clean_text(raw_subdivision)
        # Normalize '&' vs 'AND'
        standardized = cleaned.replace(" AND ", " & ")
        return standardized

    def is_ner_state(self, state: Optional[str]) -> bool:
        """Check if canonical state belongs to North-Eastern Region (NER)."""
        canonical = self.normalize_state(state)
        return canonical in self.ner_states

    def get_subdivision_for_state(self, state: Optional[str]) -> Optional[str]:
        """Lookup standard meteorological subdivision for given canonical state."""
        canonical = self.normalize_state(state)
        return self.subdivision_map.get(canonical)

    def validate_coordinates_in_india(self, lat: Optional[float], lon: Optional[float]) -> bool:
        """Check if decimal coordinates fall within the broader India bounding box."""
        if lat is None or lon is None:
            return False
        return (
            self.india_bbox["min_latitude"] <= lat <= self.india_bbox["max_latitude"]
            and self.india_bbox["min_longitude"] <= lon <= self.india_bbox["max_longitude"]
        )

    def validate_coordinates_in_ner(self, lat: Optional[float], lon: Optional[float]) -> bool:
        """Check if decimal coordinates fall within the North-Eastern Region bounding box."""
        if lat is None or lon is None:
            return False
        return (
            self.ner_bbox["min_latitude"] <= lat <= self.ner_bbox["max_latitude"]
            and self.ner_bbox["min_longitude"] <= lon <= self.ner_bbox["max_longitude"]
        )

    @staticmethod
    def parse_dms(coord_str: str) -> Optional[float]:
        """Convert DMS string e.g. 11°19'14.94"N or 27° 22’ 51.88” to decimal degrees."""
        if not coord_str or not isinstance(coord_str, str):
            return None

        # Replace varied quotes/degrees symbols
        cleaned = (
            coord_str.replace("°", " ")
            .replace("’", " ")
            .replace("'", " ")
            .replace('"', " ")
            .replace("”", " ")
            .replace("“", " ")
            .strip()
        )

        match = re.search(r"([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)\s+([0-9]+(?:\.[0-9]+)?)\s*([NSEWnsew])?", cleaned)
        if match:
            deg = float(match.group(1))
            minute = float(match.group(2))
            sec = float(match.group(3))
            direction = match.group(4).upper() if match.group(4) else None

            decimal = deg + (minute / 60.0) + (sec / 3600.0)
            if direction in {"S", "W"}:
                decimal = -decimal
            return round(decimal, 6)

        # Fallback to simple decimal degrees pattern
        dec_match = re.search(r"([0-9]+\.[0-9]+)", coord_str)
        if dec_match:
            return round(float(dec_match.group(1)), 6)

        return None
