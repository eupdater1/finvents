import EventDetailPage, { type EventDetailData } from '@/components/event-detail-page'

const eventData: EventDetailData = {
  "id": "us-tax-filing-2026",
  "country": "United States",
  "country_code": "US",
  "category": "government_policy",
  "pillar": "taxes",
  "event_name": "Federal Tax Filing Deadline",
  "event_date": "2026-04-15",
  "event_date_utc": "2026-04-15T00:00:00Z",
  "recurrence": "annual",
  "status": "confirmed",
  "impact_level": "medium",
  "source_url": "https://www.irs.gov/",
  "source_name": "Internal Revenue Service",
  "last_verified": "2026-07-19",
  "forecast_value": null,
  "forecast_source": null,
  "actual_value": null,
  "actual_value_status": "pending",
  "revision_history": [],
  "recap_published": false,
  "recap_summary": "",
  "recap_published_date": null,
  "impact_layer": {
    "if_higher_than_expected": "",
    "if_lower_than_expected": "",
    "if_in_line": "Taxpayers who file or request an extension by this date avoid IRS late-filing penalties, which can compound significantly if missed."
  },
  "life_category_impact": {
    "mortgage_holders": "",
    "savers": "",
    "investors": "",
    "small_businesses": "Sole proprietors and single-member LLC owners typically file business income through their personal return by this same deadline, making it a key date for small business tax planning.",
    "students": "Many students with part-time income need to file by this date, even if they expect a refund or owe minimal tax.",
    "retirees": ""
  },
  "historical_data_5yr": [],
  "related_events": [],
  "description_short": "The annual April 15 deadline for most U.S. taxpayers to file federal returns or request an extension and avoid IRS late-filing penalties.",
  "description_long": "April 15 is the standard annual deadline for individuals to file federal income tax returns with the IRS for the previous tax year, or to request an extension. This date applies to most taxpayers unless it falls on a weekend or holiday, in which case the IRS shifts it to the next business day.",
  "impact_layers": []
}

export default function EventPage() {
  return <EventDetailPage data={eventData} slug="federal-tax-filing-deadline" />
}
