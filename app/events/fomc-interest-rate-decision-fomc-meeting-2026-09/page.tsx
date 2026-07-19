import EventDetailPage, { type EventDetailData } from '@/components/event-detail-page'

const eventData: EventDetailData = {
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
  "last_verified": "2026-07-19",
  "forecast_value": null,
  "forecast_source": null,
  "actual_value": null,
  "actual_value_status": "preliminary",
  "revision_history": [],
  "recap_published": false,
  "recap_summary": "",
  "recap_published_date": null,
  "impact_layer": {
    "if_higher_than_expected": "A larger-than-expected rate hike (or a hawkish surprise) typically pushes borrowing costs higher across mortgages, credit cards, and business loans, and often causes stock prices to fall as investors price in tighter financial conditions.",
    "if_lower_than_expected": "A rate cut or a more dovish stance than expected typically lowers borrowing costs over time and is generally viewed positively by stock markets, though it can also signal the Fed sees economic weakness ahead.",
    "if_in_line": "When the decision matches market expectations, the immediate reaction is often muted since it was already priced into asset prices beforehand."
  },
  "life_category_impact": {
    "mortgage_holders": "Federal Reserve rate decisions directly influence mortgage rates, particularly for adjustable-rate and new fixed-rate loans.",
    "savers": "Higher Fed rates generally translate to better yields on savings accounts and CDs, while rate cuts tend to lower them.",
    "investors": "Interest rate decisions are among the most significant drivers of stock and bond market movements, affecting company borrowing costs and valuations.",
    "small_businesses": "Business loan rates typically move in the same direction as the federal funds rate, affecting the cost of financing expansion or operations.",
    "students": "",
    "retirees": ""
  },
  "historical_data_5yr": [],
  "related_events": [],
  "description_short": "The September FOMC meeting decides the federal funds rate and shapes near-term expectations for borrowing costs, inflation, and the central bank’s outlook.",
  "description_long": "The Federal Open Market Committee (FOMC) meets eight times a year to decide whether to raise, lower, or hold the federal funds rate — the interest rate that influences borrowing costs across the entire U.S. economy. The decision is announced at 2:00 PM Eastern Time, followed by a press conference from the Fed Chair.",
  "impact_layers": []
}

export default function EventPage() {
  return <EventDetailPage data={eventData} slug="fomc-interest-rate-decision-fomc-meeting-2026-09" />
}
