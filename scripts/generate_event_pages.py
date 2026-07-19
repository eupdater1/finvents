#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Tuple

ROOT = Path(__file__).resolve().parent.parent
INPUT_DIR = ROOT / "events-data"
OUTPUT_DIR = ROOT / "app" / "events"
SITEMAP_PATH = ROOT / "public" / "sitemap.xml"
LOG_PATH = ROOT / "event-generation.log"

REQUIRED_FIELDS = ["source_url", "event_date", "status"]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def load_event_files(input_dir: Path) -> List[Path]:
    if not input_dir.exists():
        fail(f"Input folder not found: {input_dir}")
    files = sorted(input_dir.glob("*.json"))
    if not files:
        fail(f"No JSON event files found in {input_dir}")
    return files


def validate_event_payload(payload: Dict[str, Any], path: Path) -> Tuple[bool, str | None]:
    for field in REQUIRED_FIELDS:
        value = payload.get(field)
        if value in (None, "", []):
            return False, f"missing required field '{field}'"

    if payload.get("status") not in {"confirmed", "estimated", "draft"}:
        return False, "status must be one of: confirmed, estimated, draft"

    if payload.get("source_url") and not isinstance(payload.get("source_url"), str):
        return False, "source_url must be a string"

    return True, None


def slugify(value: str) -> str:
    text = value.strip().lower()
    text = ''.join(ch if ch.isalnum() else '-' for ch in text)
    text = '-'.join(part for part in text.split('-') if part)
    return text or "event"


def generate_page_component(payload: Dict[str, Any], slug: str) -> str:
    data = json.dumps(payload, indent=2)
    return f"""import EventDetailPage, {{ type EventDetailData }} from '@/components/event-detail-page'

const eventData: EventDetailData = {data}

export default function EventPage() {{
  return <EventDetailPage data={{eventData}} slug=\"{slug}\" />
}}
"""


def write_page(payload: Dict[str, Any], source_path: Path, output_dir: Path) -> Tuple[str, str]:
    slug = slugify(str(payload.get('event_name') or source_path.stem))
    page_dir = output_dir / slug
    page_dir.mkdir(parents=True, exist_ok=True)
    page_path = page_dir / "page.tsx"
    page_path.write_text(generate_page_component(payload, slug), encoding="utf-8")
    return str(page_path.relative_to(ROOT)), slug


def write_sitemap(urls: List[str], output_path: Path) -> None:
    content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    content += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    for url in urls:
        content += "  <url>\n"
        content += f"    <loc>{url}</loc>\n"
        content += "  </url>\n"
    content += "</urlset>\n"
    output_path.write_text(content, encoding="utf-8")


def write_summary_log(summary: List[Dict[str, Any]], log_path: Path) -> None:
    lines = ["Event generation summary:"]
    for item in summary:
        lines.append(f"- {item['status']}: {item['file']} -> {item['message']}")
    log_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    input_dir = INPUT_DIR
    output_dir = OUTPUT_DIR
    output_dir.mkdir(parents=True, exist_ok=True)

    event_files = load_event_files(input_dir)
    generated_urls: List[str] = []
    summary: List[Dict[str, Any]] = []
    generated_count = 0
    skipped_count = 0

    for event_file in event_files:
        try:
            with event_file.open("r", encoding="utf-8") as handle:
                payload = json.load(handle)
        except json.JSONDecodeError as exc:
            skipped_count += 1
            summary.append({"status": "skipped", "file": event_file.name, "message": f"invalid JSON: {exc}"})
            continue

        if not isinstance(payload, dict):
            skipped_count += 1
            summary.append({"status": "skipped", "file": event_file.name, "message": "top-level JSON value must be an object"})
            continue

        is_valid, reason = validate_event_payload(payload, event_file)
        if not is_valid:
            skipped_count += 1
            summary.append({"status": "skipped", "file": event_file.name, "message": reason or "validation failed"})
            continue

        page_relative_path, slug = write_page(payload, event_file, output_dir)
        generated_count += 1
        generated_urls.append(f"https://example.com/events/{slug}")
        summary.append({"status": "generated", "file": event_file.name, "message": f"created {page_relative_path}"})

    write_sitemap(generated_urls, SITEMAP_PATH)
    write_summary_log(summary, LOG_PATH)

    print(f"Generated pages: {generated_count}")
    print(f"Skipped pages: {skipped_count}")
    print("Summary log written to", LOG_PATH)
    print("Sitemap written to", SITEMAP_PATH)


if __name__ == "__main__":
    main()
