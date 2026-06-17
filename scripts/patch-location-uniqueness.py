#!/usr/bin/env python3
"""Add a local planning section to all state/city/county landing pages."""

from __future__ import annotations

import hashlib
import re
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_SCRIPT = ROOT / "scripts" / "patch-localized-faqs.py"

FAQ_SECTION_RE = re.compile(
    r'\n<section class="section(?: section-alt)?" aria-labelledby="faq-title[^"]*">',
    re.MULTILINE,
)

OPENERS = [
    "Most hosts in {label} book hibachi parties because the setup is simple and the chef handles live cooking at home.",
    "{label} families often choose at-home hibachi when they want restaurant energy without coordinating travel for a large group.",
    "Private hibachi events in {label} work well for birthdays, graduations and weekend gatherings where guests stay in one place.",
    "Hosts in {label} usually book us for events that need both food and entertainment in the same backyard setup.",
]

VIBES = [
    "Popular service pockets include {towns}. Mention your exact address early so we can confirm timing and arrival details.",
    "We frequently serve guests in {towns}. Sharing your neighborhood helps us confirm the most accurate arrival window.",
    "Common booking areas include {towns}. Early address confirmation helps us plan chef dispatch and setup flow.",
    "Many events come from {towns}. Send your full event location to lock in the most accurate schedule.",
]

PLANNING = [
    "For smoother service in {label}, keep one clear grilling zone, confirm headcount 4 days before, and submit protein choices together.",
    "A strong plan for {label} events is to finalize guest count early, group protein selections, and reserve a flat cooking area.",
    "The easiest {label} setup is one dedicated grill space, one final headcount update, and one consolidated food order list.",
    "Best results in {label} come from finalizing guest numbers in advance and preparing a single open area for the mobile grill.",
]

CTA = [
    "If your location is near the edge of our service area, call us first so we can confirm routing and travel details before booking.",
    "When your event is outside major city centers, contact us before checkout so we can verify logistics for your exact address.",
    "If you are planning in a suburban or outer area, send your address first and we will confirm availability and scheduling details.",
    "For addresses outside core metro zones, a quick call before booking helps us confirm coverage and timing.",
]


def _variant(slug: str, variants: list[str], salt: str) -> str:
    digest = hashlib.sha1(f"{slug}:{salt}".encode("utf-8")).hexdigest()
    return variants[int(digest, 16) % len(variants)]


def _short_towns(towns: str, limit: int = 4) -> str:
    normalized = towns.replace(" and ", ", ")
    parts = [p.strip() for p in normalized.split(",") if p.strip()]
    if not parts:
        return towns
    return ", ".join(parts[:limit])


def build_section(slug: str, label: str, towns: str) -> str:
    towns_short = _short_towns(towns)
    opener = _variant(slug, OPENERS, "opener").format(label=label, towns=towns_short)
    vibe = _variant(slug, VIBES, "vibe").format(label=label, towns=towns_short)
    planning = _variant(slug, PLANNING, "planning").format(label=label, towns=towns_short)
    cta = _variant(slug, CTA, "cta").format(label=label, towns=towns_short)

    return f"""
<section class="section section-alt" aria-labelledby="local-proof-{slug}">
  <div class="container">
    <div class="text-center reveal" style="margin-bottom:2rem">
      <div class="section-label">Local Planning</div>
      <h2 class="section-title" id="local-proof-{slug}">{label} <span>Party Planning Tips</span></h2>
    </div>
    <article class="article-card reveal">
      <div class="article-body city-desc">
        <p>{opener}</p>
        <p>{vibe}</p>
        <p>{planning}</p>
        <p>{cta}</p>
      </div>
    </article>
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
        marker = f'id="local-proof-{slug}"'
        if marker in html:
            print(f"SKIP already patched {slug}")
            continue

        match = FAQ_SECTION_RE.search(html)
        if not match:
            print(f"SKIP faq section not found {slug}")
            continue

        section = build_section(slug, label, towns)
        new_html = html[: match.start()] + section + html[match.start() :]
        path.write_text(new_html, encoding="utf-8")
        print(f"Patched {slug}")
        updated += 1

    print(f"Done. Updated {updated} pages.")


if __name__ == "__main__":
    main()
