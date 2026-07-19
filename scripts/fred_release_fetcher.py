#!/usr/bin/env python3
import os
import sys
import json
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from typing import Any, Dict, Optional

FRED_API_KEY = os.getenv("FRED_API_KEY", "")
FRED_BASE_URL = "https://api.stlouisfed.org/fred"

SERIES_IDS = {
    "CPI": "CPIAUCSL",
    "UNEMPLOYMENT": "UNRATE",
    "GDP": "GDP",
}

TEMPLATE = {
    "id": "us-fomc-2026-09",
    "country": "United States",
    "country_code": "US",
    "category": "central_bank",
    "pillar": "monetary_policy",
    "event_name": "FOMC Interest Rate Decision",
    "event_date": "2026-09-16",
    "event_date_utc": "2026-09-16T18:00:00Z",
    "recurrence": "8x per year",
    "status": "confirmed",
    "impact_level": "high",
    "source_url": "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    "source_name": "Federal Reserve",
    "last_verified": "2026-07-16",
    "forecast_value": None,
    "forecast_source": None,
    "actual_value": None,
    "actual_value_status": "preliminary",
    "revision_history": [],
    "recap_published": False,
    "recap_summary": "",
    "recap_published_date": None,
    "impact_layer": {
        "if_higher_than_expected": "",
        "if_lower_than_expected": "",
        "if_in_line": "",
    },
    "life_category_impact": {
        "mortgage_holders": "",
        "savers": "",
        "investors": "",
        "small_businesses": "",
        "students": "",
        "retirees": "",
    },
    "historical_data_5yr": [],
    "related_events": [],
    "description_short": "",
    "description_long": "",
}


def fetch_json(url: str) -> Dict[str, Any]:
    req = urllib.request.Request(url, headers={"User-Agent": "finvents-fred-fetcher/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def get_latest_observation(series_id: str) -> Optional[Dict[str, Any]]:
    params = {
        "series_id": series_id,
        "api_key": FRED_API_KEY,
        "file_type": "json",
        "limit": 1,
        "sort_order": "desc",
    }
    url = f"{FRED_BASE_URL}/series/observations?" + urllib.parse.urlencode(params)
    data = fetch_json(url)
    observations = data.get("observations", [])
    if not observations:
        return None
    return observations[0]


def get_latest_release_date(series_id: str) -> Optional[str]:
    obs = get_latest_observation(series_id)
    if not obs:
        return None
    date = obs.get("date")
    if not date:
        return None
    try:
        datetime.strptime(date, "%Y-%m-%d")
        return date
    except ValueError:
        return None


def build_output() -> Dict[str, Any]:
    if not FRED_API_KEY:
        print("FRED_API_KEY is not set. Set it in your environment before running this script.", file=sys.stderr)
        sys.exit(1)

    release_dates = {}
    for label, series_id in SERIES_IDS.items():
        release_date = get_latest_release_date(series_id)
        release_dates[label] = release_date

    # The FRED API does not provide a human-confirmed release calendar for these series here.
    # We therefore avoid making a confirmed claim and mark the result for manual review.
    output = dict(TEMPLATE)
    output["status"] = "estimated"
    output["actual_value_status"] = "preliminary"

    # Use the latest available observation date only if present; otherwise leave it unset.
    latest_date = None
    for release_date in release_dates.values():
        if release_date:
            latest_date = release_date
            break

    if latest_date:
        output["event_date"] = latest_date
        output["event_date_utc"] = f"{latest_date}T00:00:00Z"
    else:
        output["event_date"] = ""
        output["event_date_utc"] = ""

    output["description_short"] = (
        "FRED data snapshot for CPI, unemployment, and GDP. Dates are pulled from the FRED API and require manual review before being treated as confirmed release dates."
    )
    output["description_long"] = (
        "This payload was generated from the FRED API for the requested series. It does not claim a human-verified release calendar and should be reviewed before publication."
    )

    return output


def main() -> None:
    output = build_output()
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
