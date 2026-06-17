#!/usr/bin/env python3
"""Add flat $50 Texas travel fee to pricing copy and localized FAQ blocks."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

TEXAS_PAGES = {
    "texas": "Texas",
    "dallas-hibachi-at-home": "Dallas, TX",
    "fort-worth-hibachi-at-home": "Fort Worth, TX",
    "austin-hibachi-at-home": "Austin, TX",
    "houston-hibachi-at-home": "Houston, TX",
    "san-antonio-hibachi-at-home": "San Antonio, TX",
    "waco-hibachi-at-home": "Waco, TX",
    "victoria-hibachi-at-home": "Victoria, TX",
}

TRAVEL_MARKER = "Is there a travel fee for hibachi catering in"

PRICING_TRAVEL_SNIPPET = (
    ", plus a flat <strong>$50 travel fee</strong> for all Texas events"
)

PRICING_END_OLD = " Price may vary by location."
DUPLICATE_TRAVEL_SUFFIX = (
    " A flat <strong>$50 travel fee</strong> applies to all Texas events."
)

MINIMUM_RE = re.compile(
    r"(<strong>\$500 (?:event )?minimum(?: spend)?(?: for all events)?</strong>\.)"
)

INSERT_AFTER_RE = re.compile(
    r"(<div class=\"faq-item\">\s*"
    r"<button type=\"button\" class=\"faq-question\" aria-expanded=\"false\">\s*"
    r"<span>How many people are required to book in [^<]+</span>.*?"
    r"<div class=\"faq-answer\"><p>.*?</p></div>\s*"
    r"</div>\s*)",
    re.DOTALL,
)


def faq_block(label: str, is_state: bool) -> str:
    if is_state:
        answer = (
            f"Yes. A flat <strong>$50 travel fee</strong> applies to all hibachi events across "
            f"<strong>Texas</strong>, including Dallas, Houston, Austin, San Antonio and our other "
            f"Texas service areas. This fee covers chef travel to your home or venue and is "
            f"<strong>in addition to</strong> per-person menu pricing ($50 per adult, $25 per child "
            f"under 12, $500 minimum). Sales tax and gratuity are not included."
        )
    else:
        answer = (
            f"Yes. A flat <strong>$50 travel fee</strong> applies to all hibachi events in "
            f"<strong>{label}</strong> and across our Texas service area. This fee covers chef "
            f"travel to your home or venue and is <strong>in addition to</strong> per-person menu "
            f"pricing ($50 per adult, $25 per child under 12, $500 minimum). Sales tax and "
            f"gratuity are not included."
        )
    question = f"Is there a travel fee for hibachi catering in {label}?"
    return f"""      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>{question}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer"><p>{answer}</p></div>
      </div>
"""


def patch_pricing(html: str) -> str:
    def add_after_minimum(match: re.Match) -> str:
        block = match.group(1)
        if PRICING_TRAVEL_SNIPPET in block:
            return block
        return block[:-1] + PRICING_TRAVEL_SNIPPET + "."

    html = MINIMUM_RE.sub(add_after_minimum, html)
    html = html.replace(PRICING_END_OLD, "")
    if PRICING_TRAVEL_SNIPPET in html:
        html = html.replace(DUPLICATE_TRAVEL_SUFFIX, "")
    return html


def patch_faq(html: str, label: str, is_state: bool) -> str:
    if TRAVEL_MARKER in html:
        return html
    block = faq_block(label, is_state)
    match = INSERT_AFTER_RE.search(html)
    if not match:
        raise ValueError("could not find insertion point after minimum-guest FAQ")
    return html[: match.end()] + block + html[match.end() :]


def main() -> None:
    updated = 0
    for slug, label in TEXAS_PAGES.items():
        path = ROOT / slug / "index.html"
        if not path.exists():
            print(f"SKIP missing {path}")
            continue
        html = path.read_text(encoding="utf-8")
        is_state = slug == "texas"
        try:
            new_html = patch_faq(html, label, is_state)
        except ValueError as exc:
            print(f"FAIL {slug}: {exc}")
            continue
        new_html = patch_pricing(new_html)
        if new_html == html:
            print(f"SKIP unchanged {slug}")
            continue
        path.write_text(new_html, encoding="utf-8")
        print(f"Patched {slug}")
        updated += 1
    print(f"Done. Updated {updated} pages.")


if __name__ == "__main__":
    main()
