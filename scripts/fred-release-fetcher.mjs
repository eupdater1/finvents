import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const outputDir = path.join(rootDir, 'events-data');
const verbose = process.argv.includes('--verbose') || process.env.FRED_DEBUG === '1';

const series = [
  { key: 'CPIAUCSL', name: 'CPI', label: 'Consumer Price Index' },
  { key: 'UNRATE', name: 'UNEMPLOYMENT', label: 'Unemployment Rate' },
  { key: 'GDP', name: 'GDP', label: 'Gross Domestic Product' },
];

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event';
}

function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

async function loadEnvFile() {
  const envPath = path.join(rootDir, '.env');
  try {
    const buffer = await fs.readFile(envPath);
    if (verbose) console.log(`Attempting to load .env from ${envPath} (bytes=${buffer.length})`);

    // try utf8 first, then utf16le
    let raw = buffer.toString('utf8');
    if (!raw.includes('=')) {
      try {
        raw = buffer.toString('utf16le');
      } catch (e) {
        // keep utf8
      }
    }

    // if still not found and buffer looks like UTF-16 BE, attempt byte-swap decode
    if (!raw.includes('=') && buffer.includes(0x00)) {
      try {
        const swapped = Buffer.allocUnsafe(buffer.length)
        for (let i = 0; i < buffer.length; i += 2) {
          if (i + 1 < buffer.length) {
            swapped[i] = buffer[i + 1]
            swapped[i + 1] = buffer[i]
          } else {
            swapped[i] = buffer[i]
          }
        }
        const alt = swapped.toString('utf16le')
        if (alt.includes('=')) raw = alt
      } catch (e) {
        // ignore
      }
    }

    // strip BOM if present
    raw = raw.replace(/^\uFEFF/, '');
    if (verbose) console.log(`.env appears to contain key text: ${raw.includes('FRED_API_KEY=')}`);

    const entries = raw.split(/\r?\n/);
    for (const entry of entries) {
      const trimmed = entry.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
    // fallback: if FRED_API_KEY still not set, try direct utf16le extraction
    if (!process.env.FRED_API_KEY) {
      try {
        const alt = buffer.toString('utf16le');
        const m = /FRED_API_KEY\s*=\s*['\"]?([^'\"\s]+)/i.exec(alt);
        if (m && m[1]) {
          process.env.FRED_API_KEY = m[1];
          if (verbose) console.log('Recovered FRED_API_KEY from utf16le decode: true');
        }
      } catch (e) {
        // ignore
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function fetchSeries(seriesKey) {
  await loadEnvFile();
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error('FRED_API_KEY is not set');
  }

  const url = new URL('https://api.stlouisfed.org/fred/series/observations');
  url.searchParams.set('series_id', seriesKey);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('sort_order', 'desc');
  url.searchParams.set('limit', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED request failed for ${seriesKey}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const observation = payload?.observations?.[0];
  if (!observation) {
    throw new Error(`No observation returned for ${seriesKey}`);
  }

  return {
    series_id: seriesKey,
    release_date: toIsoDate(observation.date),
    value: observation.value ? Number(observation.value) : null,
  };
}

async function main() {
  const fetched = [];
  for (const seriesItem of series) {
    try {
      const item = await fetchSeries(seriesItem.key);
      fetched.push({
        id: `${seriesItem.name.toLowerCase()}-${item.series_id}`,
        event_name: `${seriesItem.label} release`,
        category: 'economic_indicator',
        status: 'estimated',
        source_url: 'https://fred.stlouisfed.org/series/' + seriesItem.key,
        event_date: item.release_date,
        event_date_utc: item.release_date ? `${item.release_date}T00:00:00Z` : null,
        description_short: `Release of ${seriesItem.label} data from FRED.`,
        description_long: `The ${seriesItem.label} release is a key macroeconomic indicator tracked for inflation, labor market, and growth analysis.`,
        impact_level: 'medium',
        impact_layer: {
          if_higher_than_expected: '',
          if_lower_than_expected: '',
          if_in_line: '',
        },
        life_category_impact: {
          mortgage_holders: '',
          savers: '',
          investors: '',
          small_businesses: '',
          students: '',
          retirees: '',
        },
        related_events: [],
        historical_data_5yr: [],
        forecast_value: item.value,
        forecast_source: 'FRED',
        actual_value: null,
        actual_value_status: 'pending',
        revision_history: [],
        recap_published: false,
        recap_summary: '',
        recap_published_date: null,
        source_name: 'Federal Reserve Bank of St. Louis',
        last_verified: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      console.warn(`Skipping ${seriesItem.key}: ${error.message}`);
    }
  }

  await fs.mkdir(outputDir, { recursive: true });
  const writtenFiles = [];
  for (const item of fetched) {
    const slug = slugify(item.event_name ?? item.id ?? item.series_id ?? 'fred-event');
    const fileName = `fred-${slug}.json`;
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(item, null, 2), 'utf8');
    writtenFiles.push(fileName);
  }

  const legacyPath = path.join(outputDir, 'fred-release-data.json');
  await fs.rm(legacyPath).catch(() => {});
  if (verbose) console.log(`Wrote ${writtenFiles.length} FRED events to ${path.relative(rootDir, outputDir)} (${writtenFiles.join(', ')})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
