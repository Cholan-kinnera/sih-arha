"""Data Cleaning & Standardization Module for LEWS.

Cleans and standardizes raw datasets:
- Historical landslide incidence reports -> data/processed/landslide_clean.csv
- Climatological district rainfall normals -> data/processed/rainfall_district_clean.csv
- Historical subdivision rainfall time-series -> data/processed/rainfall_subdivision_clean.csv
"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import pandas as pd

from src.data.geography import GeographyNormalizer
from src.data.loaders import (
    get_project_root,
    load_raw_landslides,
    load_raw_rainfall_district,
    load_raw_rainfall_subdivision,
)

logger = logging.getLogger(__name__)

MONTH_MAP: Dict[str, int] = {
    "JAN": 1, "JANUARY": 1,
    "FEB": 2, "FEBRUARY": 2,
    "MAR": 3, "MARCH": 3,
    "APR": 4, "APRIL": 4,
    "MAY": 5,
    "JUN": 6, "JUNE": 6,
    "JUL": 7, "JULY": 7,
    "AUG": 8, "AUGUST": 8,
    "SEP": 9, "SEPT": 9, "SEPTEMBER": 9,
    "OCT": 10, "OCTOBER": 10,
    "NOV": 11, "NOVEMBER": 11,
    "DEC": 12, "DECEMBER": 12,
}


def _extract_coordinates(text: str, normalizer: GeographyNormalizer) -> Tuple[Optional[float], Optional[float]]:
    """Extract decimal degrees from text containing DMS or decimal coordinates."""
    if not text or not isinstance(text, str):
        return None, None

    # Try DMS pattern: e.g. Lat: 11°19'14.94"N and Lon: 76°37'31.34"E or N 27° 22’ 51.88” & E 88° 38’ 26.28”
    lat_match = re.search(r"(?:Lat(?:itude)?\s*[:\s]*|N\s*)([0-9]{1,2}[\s°\s]+[0-9]{1,2}[\s'’′\s]+[0-9]{1,2}(?:\.[0-9]+)?[\s\"”″\s]*(?:N|North)?)", text, re.IGNORECASE)
    lon_match = re.search(r"(?:Lon(?:gitude)?\s*[:\s]*|E\s*)([0-9]{2,3}[\s°\s]+[0-9]{1,2}[\s'’′\s]+[0-9]{1,2}(?:\.[0-9]+)?[\s\"”″\s]*(?:E|East)?)", text, re.IGNORECASE)

    lat_val = None
    lon_val = None

    if lat_match:
        lat_val = normalizer.parse_dms(lat_match.group(1))
    if lon_match:
        lon_val = normalizer.parse_dms(lon_match.group(1))

    # Direct decimal match fallback: e.g. 27.3812 N, 88.6123 E
    if lat_val is None:
        dec_lat = re.search(r"\b([1-3][0-9]\.[0-9]{3,7})\s*(?:°)?\s*(?:N|North)\b", text, re.IGNORECASE)
        if dec_lat:
            lat_val = round(float(dec_lat.group(1)), 6)

    if lon_val is None:
        dec_lon = re.search(r"\b([7-9][0-9]\.[0-9]{3,7})\s*(?:°)?\s*(?:E|East)\b", text, re.IGNORECASE)
        if dec_lon:
            lon_val = round(float(dec_lon.group(1)), 6)

    # Validate coordinate ranges [-90, 90], [-180, 180]
    if lat_val is not None and not (-90.0 <= lat_val <= 90.0):
        lat_val = None
    if lon_val is not None and not (-180.0 <= lon_val <= 180.0):
        lon_val = None

    return lat_val, lon_val


def _extract_date_info(title: str, text: str) -> Tuple[Optional[str], Optional[int], Optional[int]]:
    """Extract raw date string, year, and month from title or incident narrative."""
    combined = (title + " " + text).strip()

    # Raw date pattern in parentheses or text: e.g. (06th August, 2020), (24 May, 2020), (July, 2020)
    date_paren = re.search(r"\(([0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+[0-9]{4}|[A-Za-z]+,?\s+[0-9]{4})\)", title)
    raw_date = date_paren.group(1) if date_paren else None

    # Year
    year_match = re.search(r"\b(19[0-9]{2}|20[0-2][0-9])\b", combined)
    year = int(year_match.group(1)) if year_match else None

    # Month
    month = None
    for m_name, m_val in MONTH_MAP.items():
        if re.search(rf"\b{m_name}\b", combined, re.IGNORECASE):
            month = m_val
            break

    return raw_date, year, month


def _extract_state_and_district(title: str, text: str, normalizer: GeographyNormalizer) -> Tuple[str, str]:
    """Identify state and district names from title and report narrative."""
    combined = (title + " " + text).upper()

    # Known Indian States & UTs priority list (NER first, then rest of India)
    states_to_check = [
        "ARUNACHAL PRADESH", "ASSAM", "MANIPUR", "MEGHALAYA", "MIZORAM",
        "NAGALAND", "SIKKIM", "TRIPURA", "TAMIL NADU", "KERALA", "KERELA",
        "KARNATAKA", "HIMACHAL PRADESH", "UTTARAKHAND", "RAJASTHAN", "WEST BENGAL"
    ]

    matched_state = "UNKNOWN"
    for s in states_to_check:
        if re.search(rf"\b{s}\b", combined):
            matched_state = normalizer.normalize_state(s)
            break

    # Contextual district search
    district_candidates = [
        # Arunachal
        "PAPUM PARE", "PAPUMPARE", "LOHIT", "EAST SIANG", "WEST SIANG", "TAWANG", "UPPER SIANG", "LOWER SUBANSIRI",
        # Assam
        "KAMRUP (M)", "KAMRUP (METRO)", "KAMRUP METRO", "KAMRUP", "CACHAR", "HAILAKANDI", "HILAKANDI", "KARIMGANJ", "KARIMGANG", "DIMA HASAO",
        # Manipur
        "NONEY", "SENAPATI", "UKHRUL", "TAMENGLONG", "KANGPOKPI", "TENGNOUPAL", "IMPHAL",
        # Meghalaya
        "EAST KHASI HILLS", "WEST JAINTIA HILLS", "EAST JAINTIA HILLS", "RI BHOI", "SOUTH WEST KHASI HILLS",
        # Mizoram
        "AIZAWL", "LUNGLEI", "CHAMPHAI", "KOLASIB", "SERCHHIP",
        # Nagaland
        "DIMAPUR", "WOKHA", "PHEK", "TUENSANG", "KOHIMA", "MOKOKCHUNG",
        # Sikkim
        "NORTH SIKKIM", "NORTH DISITRICT", "EAST SIKKIM", "EAST DISTRICT", "SOUTH SIKKIM", "WEST SIKKIM", "GANGTOK",
        # Tripura
        "WEST TRIPURA", "GOMATI", "DHALAI", "SOUTH TRIPURA", "NORTH TRIPURA",
        # Other states
        "NILGIRI", "KODAGU", "KODUGU", "IDUKKI", "SOLAN", "SHIMLA", "MANDI", "CHAMOLI", "BAGESHWAR", "BAGESWAR", "WAYANAD", "KOZHIKODE", "KANNUR", "MALAPPURAM", "MALAPPUAM", "PALAKKAD", "JAIPUR"
    ]

    matched_district = "UNKNOWN"
    for d in sorted(district_candidates, key=lambda x: -len(x)):
        if re.search(rf"\b{re.escape(d)}\b", combined):
            matched_district = normalizer.normalize_district(d, matched_state)
            break

    # If state is Sikkim and text mentions Gangtok / Mangan / Kabi without district:
    if matched_state == "SIKKIM" and matched_district == "UNKNOWN":
        if "GANGTOK" in combined or "DEORALI" in combined:
            matched_district = "EAST SIKKIM"
        elif "MANGAN" in combined or "KABI" in combined:
            matched_district = "NORTH SIKKIM"

    return matched_state, matched_district


def _classify_failure_type(text: str) -> str:
    """Classify physical landslide failure mechanism from narrative keywords."""
    upper = text.upper()
    if "DEBRIS FLOW" in upper or "EARTH FLOW" in upper or "EARTH-FLOW" in upper:
        return "Debris/Earth Flow"
    if "ROCK SLIDE" in upper or "ROCK-SLIDE" in upper or "ROCKFALL" in upper:
        return "Rock Slide/Fall"
    if "CUT SLOPE" in upper or "ROAD CUT" in upper or "TOE FAILURE" in upper:
        return "Cut Slope Failure"
    if "SUBSIDENCE" in upper or "SINKHOLE" in upper or "GROUND CRACK" in upper:
        return "Land Subsidence"
    return "Debris Slide / Complex"


def clean_landslides(raw_df: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    """Parse, clean, and standardize the historical landslide incidence reports."""
    df_raw = raw_df if raw_df is not None else load_raw_landslides()
    normalizer = GeographyNormalizer()

    records: List[Dict[str, Any]] = []

    for idx, row in df_raw.iterrows():
        title_val = str(row["Title"]).strip() if pd.notna(row.get("Title")) else ""
        text_val = str(row["LandslideIncidence"]).strip() if pd.notna(row.get("LandslideIncidence")) else ""

        # Skip completely empty rows if any
        if not title_val and not text_val:
            continue

        state, district = _extract_state_and_district(title_val, text_val, normalizer)
        raw_date, year, month = _extract_date_info(title_val, text_val)
        lat, lon = _extract_coordinates(text_val + " " + title_val, normalizer)
        failure_type = _classify_failure_type(title_val + " " + text_val)

        is_ner = normalizer.is_ner_state(state)
        coords_in_india = normalizer.validate_coordinates_in_india(lat, lon) if (lat is not None and lon is not None) else False
        coords_in_ner = normalizer.validate_coordinates_in_ner(lat, lon) if (lat is not None and lon is not None) else False

        records.append({
            "incident_id": f"LS-{idx + 1:03d}",
            "raw_title": title_val,
            "narrative_text": text_val,
            "state": state,
            "district": district,
            "event_date_raw": raw_date,
            "event_year": year,
            "event_month": month,
            "latitude": lat,
            "longitude": lon,
            "coords_in_india": coords_in_india,
            "coords_in_ner": coords_in_ner,
            "is_ner": is_ner,
            "failure_type": failure_type,
            "provenance": "HISTORICAL_GSI_REPORTS",
        })

    cleaned_df = pd.DataFrame(records)

    # Save to data/processed
    out_path = get_project_root() / "data" / "processed" / "landslide_clean.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.to_csv(out_path, index=False)
    logger.info("Saved %d cleaned landslide records to %s", len(cleaned_df), out_path)

    return cleaned_df


def clean_rainfall_district(raw_df: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    """Clean and normalize the district-level climatological rainfall normals."""
    df_raw = raw_df if raw_df is not None else load_raw_rainfall_district()
    normalizer = GeographyNormalizer()

    df = df_raw.copy()

    # Standardize column names
    col_rename = {
        "STATE_UT_NAME": "state_raw",
        "DISTRICT": "district_raw",
        "JAN": "jan_mm",
        "FEB": "feb_mm",
        "MAR": "mar_mm",
        "APR": "apr_mm",
        "MAY": "may_mm",
        "JUN": "jun_mm",
        "JUL": "jul_mm",
        "AUG": "aug_mm",
        "SEP": "sep_mm",
        "OCT": "oct_mm",
        "NOV": "nov_mm",
        "DEC": "dec_mm",
        "ANNUAL": "annual_mm",
        "Jan-Feb": "winter_jan_feb_mm",
        "Mar-May": "pre_monsoon_mar_may_mm",
        "Jun-Sep": "monsoon_jun_sep_mm",
        "Oct-Dec": "post_monsoon_oct_dec_mm",
    }
    df = df.rename(columns=col_rename)

    # Normalize geography
    df["state"] = df["state_raw"].apply(normalizer.normalize_state)
    df["district"] = df.apply(
        lambda r: normalizer.normalize_district(r["district_raw"], r["state"]),
        axis=1,
    )
    df["is_ner"] = df["state"].apply(normalizer.is_ner_state)
    df["subdivision"] = df["state"].apply(normalizer.get_subdivision_for_state)

    # Validate numeric rainfall columns non-negativity
    numeric_cols = [
        "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
        "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
        "annual_mm", "winter_jan_feb_mm", "pre_monsoon_mar_may_mm",
        "monsoon_jun_sep_mm", "post_monsoon_oct_dec_mm",
    ]

    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
        # Check non-negativity
        if (df[col] < 0).any():
            logger.warning("Found negative rainfall values in %s; clamping to 0.0", col)
            df[col] = df[col].clip(lower=0.0)

    # Reorder columns
    ordered_cols = [
        "state", "district", "subdivision", "is_ner", "annual_mm",
        "winter_jan_feb_mm", "pre_monsoon_mar_may_mm", "monsoon_jun_sep_mm", "post_monsoon_oct_dec_mm",
        "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
        "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
        "state_raw", "district_raw",
    ]
    df = df[ordered_cols]

    # Save to data/processed
    out_path = get_project_root() / "data" / "processed" / "rainfall_district_clean.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(out_path, index=False)
    logger.info("Saved %d cleaned district rainfall records to %s", len(df), out_path)

    return df


def clean_rainfall_subdivision(raw_df: Optional[pd.DataFrame] = None) -> pd.DataFrame:
    """Clean and normalize the historical subdivision-level rainfall time-series."""
    df_raw = raw_df if raw_df is not None else load_raw_rainfall_subdivision()
    normalizer = GeographyNormalizer()

    df = df_raw.copy()

    # Standardize column names
    col_rename = {
        "SUBDIVISION": "subdivision_raw",
        "YEAR": "year",
        "JAN": "jan_mm",
        "FEB": "feb_mm",
        "MAR": "mar_mm",
        "APR": "apr_mm",
        "MAY": "may_mm",
        "JUN": "jun_mm",
        "JUL": "jul_mm",
        "AUG": "aug_mm",
        "SEP": "sep_mm",
        "OCT": "oct_mm",
        "NOV": "nov_mm",
        "DEC": "dec_mm",
        "ANNUAL": "annual_mm",
        "Jan-Feb": "winter_jan_feb_mm",
        "Mar-May": "pre_monsoon_mar_may_mm",
        "Jun-Sep": "monsoon_jun_sep_mm",
        "Oct-Dec": "post_monsoon_oct_dec_mm",
    }
    df = df.rename(columns=col_rename)

    df["subdivision"] = df["subdivision_raw"].apply(normalizer.normalize_subdivision)

    numeric_cols = [
        "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
        "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
        "annual_mm", "winter_jan_feb_mm", "pre_monsoon_mar_may_mm",
        "monsoon_jun_sep_mm", "post_monsoon_oct_dec_mm",
    ]

    # Impute missing values with subdivision-specific temporal medians
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        df[col] = df.groupby("subdivision")[col].transform(lambda grp: grp.fillna(grp.median()))
        # If any remain null (e.g. whole sub null), fill with 0.0
        df[col] = df[col].fillna(0.0).clip(lower=0.0)

    # Reorder columns
    ordered_cols = [
        "subdivision", "year", "annual_mm",
        "winter_jan_feb_mm", "pre_monsoon_mar_may_mm", "monsoon_jun_sep_mm", "post_monsoon_oct_dec_mm",
        "jan_mm", "feb_mm", "mar_mm", "apr_mm", "may_mm", "jun_mm",
        "jul_mm", "aug_mm", "sep_mm", "oct_mm", "nov_mm", "dec_mm",
        "subdivision_raw",
    ]
    df = df[ordered_cols]

    # Save to data/processed
    out_path = get_project_root() / "data" / "processed" / "rainfall_subdivision_clean.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(out_path, index=False)
    logger.info("Saved %d cleaned subdivision rainfall records to %s", len(df), out_path)

    return df
