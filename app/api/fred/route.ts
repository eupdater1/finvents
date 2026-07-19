import { NextResponse } from 'next/server'

const supportedSeries = ['CPIAUCSL', 'GDP', 'UNRATE']

export async function GET(request: Request) {
  const url = new URL(request.url)
  const series = url.searchParams.get('series')
  const range = url.searchParams.get('range')
  const start = url.searchParams.get('start')
  const end = url.searchParams.get('end')

  if (!series || !supportedSeries.includes(series)) {
    return NextResponse.json({ error: 'Unsupported or missing series parameter' }, { status: 400 })
  }

  if (!start || !end || !range) {
    return NextResponse.json({ error: 'Missing date range parameters' }, { status: 400 })
  }

  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'FRED_API_KEY is not configured' }, { status: 500 })
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    file_type: 'json',
    observation_start: start,
    observation_end: end,
  })

  try {
    const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${series}&${params.toString()}`)
    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({ error: `FRED fetch failed: ${response.statusText}`, details: text }, { status: 502 })
    }

    const payload = await response.json()
    if (!payload.observations || !Array.isArray(payload.observations)) {
      return NextResponse.json({ error: 'Unexpected FRED response format' }, { status: 502 })
    }

    const data = payload.observations
      .filter((row: any) => row.value !== '.' && row.value !== '')
      .map((row: any) => ({
        label: row.date,
        value: Number(row.value),
      }))
      .filter((item: any) => !Number.isNaN(item.value))

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: `Fetch error: ${error instanceof Error ? error.message : 'unknown'}` }, { status: 500 })
  }
}
