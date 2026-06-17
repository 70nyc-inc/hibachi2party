#!/usr/bin/env python3
"""Add a second localized section to all location landing pages."""

from __future__ import annotations

import hashlib
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_SCRIPT = ROOT / "scripts" / "patch-localized-faqs.py"

EVENT_STYLES = [
    "birthday dinners, graduation weekends and backyard family reunions",
    "at-home birthdays, engagement dinners and private celebration nights",
    "weekend gatherings, family milestones and small corporate socials",
    "holiday weekends, team celebrations and neighborhood get-togethers",
]

BOOKING_WINDOWS = [
    "Most weekend dates are booked 2-4 weeks ahead, while holiday weekends can fill earlier.",
    "For Friday-Sunday events, we recommend booking early because evening slots move first.",
    "Prime dinner windows are usually reserved first, especially for larger groups and weekend parties.",
    "Peak dates often fill in advance, so earlier booking gives better chef-time options.",
]

SETUP_NOTES = [
    "For smoother service, prepare one dedicated grill area and share your final headcount before your event week.",
    "The fastest setup happens when hosts clear one cooking zone and send a single final guest count update.",
    "A clear grilling space plus one consolidated protein list helps service run faster from start to finish.",
    "Set one event contact, one setup zone and one final order list to keep timing efficient.",
]

CITY_EDGE_PROMPTS = [
    "If you are near the edge of our service area, message us your address before checkout for a quick routing check.",
    "For outer neighborhoods, send the exact address first so we can confirm coverage and timing.",
    "If your event is outside core metro zones, contact us before booking to confirm availability windows.",
    "When your address is farther from city center areas, we can confirm service details in advance by phone.",
]


def _pick(slug: str, items: list[str], salt: str) -> str:
    digest = hashlib.sha1(f"{slug}:{salt}".encode("utf-8")).hexdigest()
    return items[int(digest, 16) % len(items)]


def _towns_short(towns: str, limit: int = 5) -> str:
    normalized = towns.replace(" and ", ", ")
    parts = [p.strip() for p in normalized.split(",") if p.strip()]
    if not parts:
        return towns
    return ", ".join(parts[:limit])


def build_section(slug: str, label: str, towns: str) -> str:
    events = _pick(slug, EVENT_STYLES, "events")
    booking = _pick(slug, BOOKING_WINDOWS, "booking")
    setup = _pick(slug, SETUP_NOTES, "setup")
    edge = _pick(slug, CITY_EDGE_PROMPTS, "edge")
    towns_short = _towns_short(towns)

    return f"""
<section class="section" aria-labelledby="local-scenarios-{slug}">
  <div class="container">
    <div class="text-center reveal" style="margin-bottom:2rem">
      <div class="section-label">Local Demand</div>
      <h2 class="section-title" id="local-scenarios-{slug}">{label} <span>Most-Booked Party Formats</span></h2>
    </div>
    <div class="pricing-grid reveal">
      <article class="feature-card">
        <h3>Most Popular Events</h3>
        <p>In {label}, hosts most often book hibachi for {events}.</p>
      </article>
      <article class="feature-card">
        <h3>Frequent Service Areas</h3>
        <p>We regularly receive requests from {towns_short} and nearby neighborhoods.</p>
      </article>
      <article class="feature-card">
        <h3>Booking &amp; Setup Tips</h3>
        <p>{booking} {setup} {edge}</p>
      </article>
    </div>
  </div>
</section>
"""


def main() -> None:
    locations = runpy.run_path(str(SOURCE_SCRIPT))["LOCATIONS"]
    updated = 0

    for slug, (label, _travel_area, towns) in locations.items():
        path = ROOT / slug / "index.html"
        if not path.exists():
            print(f"SKIP missing {slug}")
            continue

        html = path.read_text(encoding="utf-8")
        marker = f'id="local-scenarios-{slug}"'
        if marker in html:
            print(f"SKIP already patched {slug}")
            continue

        anchor = f'id="local-proof-{slug}"'
        pos = html.find(anchor)
        if pos == -1:
            print(f"SKIP local-proof anchor missing {slug}")
            continue

        section_end = html.find("</section>", pos)
        if section_end == -1:
            print(f"SKIP local-proof section malformed {slug}")
            continue

        insert_at = section_end + len("</section>")
        block = build_section(slug, label, towns)
        new_html = html[:insert_at] + block + html[insert_at:]
        path.write_text(new_html, encoding="utf-8")
        print(f"Patched {slug}")
        updated += 1

    print(f"Done. Updated {updated} pages.")


if __name__ == "__main__":
    main()
