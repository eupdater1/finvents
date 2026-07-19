import EventDetailPage, { type EventDetailData } from '@/components/event-detail-page'

const eventData: EventDetailData = {
  event_name: 'Federal Reserve interest rate decision',
  event_code: 'EVENT / US-FOMC-2026-07',
  event_type: 'Central bank',
  country: 'United States',
  location: 'Washington, D.C.',
  event_date_utc: '2026-07-22T14:00:00Z',
  description: 'The Federal Reserve sets interest rate guidance that shapes borrowing costs for households, businesses, and investors across the economy.',
  description_long: 'The Federal Open Market Committee sets the target range for the federal funds rate, the overnight rate banks charge each other. That decision influences mortgages, credit cards, business loans, savings yields, and the broader pace of economic growth.',
  impact_level: 'High',
  impact_layers: [
    { title: 'Higher than expected', direction: 'higher', summary: 'A firmer stance can lift borrowing costs and push markets to price in slower growth and stickier inflation.' },
    { title: 'Lower than expected', direction: 'lower', summary: 'A more dovish message can ease financing pressure and support risk assets, though it may also weaken confidence in inflation control.' },
    { title: 'In line', direction: 'in-line', summary: 'A measured outcome can keep the market focused on the wording of the statement and press conference rather than the headline rate.' },
  ],
  life_categories: ['Mortgage holders', 'Savers', 'Investors', 'Small businesses'],
  historical_data: {
    '1yr': [
      { label: 'Jan', value: 4.6 },
      { label: 'Feb', value: 4.5 },
      { label: 'Mar', value: 4.7 },
      { label: 'Apr', value: 4.4 },
      { label: 'May', value: 4.3 },
      { label: 'Jun', value: 4.5 },
    ],
    '5yr': [
      { label: '2021', value: 0.25 },
      { label: '2022', value: 4.5 },
      { label: '2023', value: 5.5 },
      { label: '2024', value: 5.3 },
      { label: '2025', value: 4.4 },
      { label: '2026', value: 4.5 },
    ],
    '10yr': [
      { label: '2016', value: 0.75 },
      { label: '2018', value: 2.25 },
      { label: '2020', value: 0.25 },
      { label: '2022', value: 4.5 },
      { label: '2024', value: 5.3 },
      { label: '2026', value: 4.5 },
    ],
  },
  related_events: [
    { title: 'Consumer price index release', url: 'https://www.bls.gov' },
    { title: 'Treasury auction calendar', url: 'https://www.treasurydirect.gov' },
  ],
  faqs: [
    {
      question: 'What does the Fed decide at this meeting?',
      answer: 'The committee usually sets or maintains the target range for the federal funds rate and updates its outlook for growth, inflation, and labor market conditions. The language in the statement often matters as much as the headline number because it signals the likely direction of policy.',
    },
    {
      question: 'Why does this matter for mortgage holders?',
      answer: 'Mortgage rates often move with expectations for future rate changes. A higher stance can keep variable-rate debt expensive, while a more cautious tone can ease some pressure on longer-term borrowing costs and refinancing decisions.',
    },
    {
      question: 'How should savers interpret the decision?',
      answer: 'Higher rates can support savings account yields, but that benefit depends on the bank and the timing of the change. Savers should focus on the balance between return and liquidity rather than assuming every rate move will lift deposits immediately.',
    },
    {
      question: 'Why do investors watch the press conference?',
      answer: 'Markets often respond to the Chair’s language more than the headline rate itself. Guidance about future cuts, inflation persistence, or labor-market strength can move bond prices, currency values, and stock sectors quickly.',
    },
    {
      question: 'What happens if the decision is in line with expectations?',
      answer: 'An in-line result can still move markets if the statement changes the expected path of policy. The tone of the communications matters because traders are often pricing the next move rather than the current one.',
    },
    {
      question: 'How often should people verify the information?',
      answer: 'Official schedules can shift, so it is wise to confirm the date and source before planning around a release. Verification is especially important for deadlines, market holidays, and central bank announcements with revised timing.',
    },
  ],
  source_name: 'Federal Reserve',
  source_url: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
  last_verified: 'July 18, 2026',
  recap_published: true,
  actual_value: 'Rate target maintained at 4.25–4.50%',
  actual_value_status: 'Confirmed',
  recap_summary: 'The decision was consistent with a cautious policy stance as markets assessed the latest inflation and labor data.',
}

export default function EventPage() {
  return <EventDetailPage data={eventData} slug="events/fed-rate-decision" />
}
