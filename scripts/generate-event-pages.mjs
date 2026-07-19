import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const inputDir = path.join(rootDir, 'events-data');
const outputDir = path.join(rootDir, 'app', 'events');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const logPath = path.join(rootDir, 'event-generation.log');

const sitemapStaticUrls = [
  'https://finvents.vercel.app/',
  'https://finvents.vercel.app/about',
  'https://finvents.vercel.app/contact',
  'https://finvents.vercel.app/privacy',
  'https://finvents.vercel.app/disclaimer',
];

const canonicalEventSlugs = [
  'cpi-release',
  'federal-tax-filing-deadline',
  'fomc-interest-rate-decision-fomc-meeting-2026-09',
  'fomc-interest-rate-decision-fomc-meeting-2026-12',
  'gdp-release',
  'jobs-report-non-farm-payrolls',
];

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event';
}

function toPageContent(payload, slug) {
  const data = JSON.stringify(payload, null, 2);
  return `import EventDetailPage, { type EventDetailData } from '@/components/event-detail-page'

const eventData: EventDetailData = ${data}

export default function EventPage() {
  return <EventDetailPage data={eventData} slug="${slug}" />
}
`;
}

function validatePayload(payload) {
  const missing = ['source_url', 'event_date', 'status'].filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length) {
    return { valid: false, reason: `missing required field(s): ${missing.join(', ')}` };
  }

  if (typeof payload.source_url !== 'string' || payload.source_url.trim() === '' || payload.source_url === '#') {
    return { valid: false, reason: 'source_url must be a real non-dummy URL' };
  }

  if (!['confirmed', 'estimated', 'draft'].includes(payload.status)) {
    return { valid: false, reason: 'status must be one of confirmed, estimated, draft' };
  }

  return { valid: true, reason: null };
}

async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeSitemap(urls) {
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}\n</urlset>\n`;
  await fs.writeFile(sitemapPath, content, 'utf8');
}

async function writeSummaryLog(entries) {
  const lines = ['Event generation summary:'];
  for (const entry of entries) {
    lines.push(`- ${entry.status}: ${entry.file} -> ${entry.message}`);
  }
  await fs.writeFile(logPath, `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
  await ensureDirectory(outputDir);
  await ensureDirectory(path.dirname(sitemapPath));

  const files = (await fs.readdir(inputDir)).filter((file) => file.endsWith('.json')).sort();
  if (!files.length) {
    throw new Error(`No JSON event files found in ${path.relative(rootDir, inputDir)}`);
  }

  const generatedUrls = [];
  const summary = [];
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      const payload = JSON.parse(raw);
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('top-level JSON value must be an object');
      }

      const validation = validatePayload(payload);
      if (!validation.valid) {
        skippedCount += 1;
        summary.push({ status: 'skipped', file, message: validation.reason });
        continue;
      }

      if (payload.status === 'confirmed' && (!payload.source_url || payload.source_url === '#')) {
        throw new Error('confirmed events must include a real source_url');
      }

      const baseSlug = slugify(payload.event_name || path.basename(file, '.json'));
      const slug = baseSlug === 'fomc-interest-rate-decision' ? `${baseSlug}-${path.basename(file, '.json')}` : baseSlug;
      const pageDir = path.join(outputDir, slug);
      await ensureDirectory(pageDir);
      await fs.writeFile(path.join(pageDir, 'page.tsx'), toPageContent(payload, slug), 'utf8');

      generatedCount += 1;
      generatedUrls.push(`https://finvents.vercel.app/events/${slug}`);
      summary.push({ status: 'generated', file, message: `created app/events/${slug}/page.tsx` });
    } catch (error) {
      skippedCount += 1;
      summary.push({ status: 'skipped', file, message: error.message });
    }
  }

  const sitemapUrls = [
    ...sitemapStaticUrls,
    ...canonicalEventSlugs.map((slug) => `https://finvents.vercel.app/events/${slug}`),
  ];

  await writeSitemap(sitemapUrls);
  await writeSummaryLog(summary);

  console.log(`Generated pages: ${generatedCount}`);
  console.log(`Skipped pages: ${skippedCount}`);
  console.log(`Summary log written to ${path.relative(rootDir, logPath)}`);
  console.log(`Sitemap written to ${path.relative(rootDir, sitemapPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
