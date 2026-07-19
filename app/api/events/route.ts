import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NextResponse } from 'next/server'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..', '..')
const eventsDir = path.join(rootDir, 'events-data')

function slugify(value: string) {
  return (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'event'
}

export async function GET() {
  try {
    const files = await fs.readdir(eventsDir)
    const events: Array<Record<string, any>> = []

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const full = path.join(eventsDir, file)
      try {
        const raw = await fs.readFile(full, 'utf8')
        const payload = JSON.parse(raw)
        if (!payload || Array.isArray(payload) || typeof payload !== 'object') continue

        const name = payload.event_name || path.basename(file, '.json')
        let baseSlug = slugify(name)
        // include filename when there may be collisions
        const slug = baseSlug === 'fomc-interest-rate-decision' ? `${baseSlug}-${path.basename(file, '.json')}` : baseSlug

        events.push({
          id: payload.id ?? path.basename(file, '.json'),
          event_name: name,
          category: payload.category ?? null,
          country: payload.country ?? null,
          status: payload.status ?? null,
          slug,
        })
      } catch (err) {
        // skip invalid JSON files
        continue
      }
    }

    return NextResponse.json({ events })
  } catch (err) {
    return new Response('failed', { status: 500 })
  }
}
