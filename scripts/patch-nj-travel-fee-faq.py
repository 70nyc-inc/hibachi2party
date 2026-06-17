#!/usr/bin/env python3
"""Add location-based travel fee FAQ to New Jersey state and county pages."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NJ_STATE = ("new-jersey", "New Jersey")

NJ_COUNTIES = {
    "bergen-county-hibachi-catering": "Bergen County",
    "middlesex-county-hibachi-catering": "Middlesex County",
    "monmouth-county-hibachi-catering": "Monmouth County",
    "ocean-county-hibachi-catering": "Ocean County",
    "morris-county-hibachi-catering": "Morris County",
    "essex-county-hibachi-catering": "Essex County",
    "union-county-hibachi-catering": "Union County",
    "somerset-county-hibachi-catering": "Somerset County",
    "hunterdon-county-hibachi-catering": "Hunterdon County",
    "mercer-county-hibachi-catering": "Mercer County",
}

TRAVEL_MARKER = "Is there a travel fee for hibachi catering in"

INSERT_AFTER_RE = re.compile(
    r"(<div class=\"faq-item\">\s*"
    r"<button type=\"button\" class=\"faq-question\" aria-expanded=\"false\">\s*"
    r"<span>How many people are required to book in [^<]+</span>.*?"
    r"<div class=\"faq-answer\"><p>.*?</p></div>\s*"
    r"</div>\s*)",
    re.DOTALL,
)

PRICING_DISCLAIMER_OLD = (
    "*Sales tax is not included — applicable state and local tax may be added "
    "based on where your event is held. Gratuity not included."
)
PRICING_DISCLAIMER_NEW = (
    "*Sales tax is not included — applicable state and local tax may be added "
    "based on where your event is held. Gratuity not included. "
    "Travel fees in New Jersey vary by event location."
)


def answer_html(label: str, is_state: bool) -> str:
    if is_state:
        return (
            f"Yes. A travel fee may apply for hibachi events in <strong>{label}</strong> based on your "
            f"town, county and driving distance. Travel fees throughout <strong>New Jersey vary by "
            f"location</strong> — they are <strong>separate from</strong> per-person menu pricing "
            f"($50 per adult, $25 per child under 12, $500 minimum). "
            f"Call <a href=\"tel:+19297597607\">(929) 759-7607</a> or use our "
            f"<a href=\"/estimation\">cost estimator</a> to confirm the travel fee for your address. "
            f"Sales tax and gratuity are not included."
        )
    return (
        f"Yes. A travel fee may apply for hibachi events in <strong>{label}</strong> based on your "
        f"event address and driving distance. Travel fees in <strong>New Jersey vary by location</strong> "
        f"— they are <strong>separate from</strong> per-person menu pricing ($50 per adult, $25 per "
        f"child under 12, $500 minimum). Call <a href=\"tel:+19297597607\">(929) 759-7607</a> or use "
        f"our <a href=\"/estimation\">cost estimator</a> to confirm the travel fee for your address. "
        f"Sales tax and gratuity are not included."
    )


def answer_schema(label: str, is_state: bool) -> str:
    if is_state:
        return (
            f"A travel fee may apply for events across {label} based on town, county "
            f"and driving distance. Travel fees in New Jersey vary by location and are "
            f"separate from per-person menu pricing ($50 per adult, $25 per child under 12, "
            f"$500 minimum)."
        )
    return (
        f"A travel fee may apply for events in {label} based on event address and driving "
        f"distance. Travel fees in New Jersey vary by location and are separate from "
        f"per-person menu pricing ($50 per adult, $25 per child under 12, $500 minimum)."
    )


def faq_block(label: str, is_state: bool) -> str:
    question = f"Is there a travel fee for hibachi catering in {label}?"
    answer = answer_html(label, is_state)
    return f"""      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>{question}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer"><p>{answer}</p></div>
      </div>
"""


def patch_faq_html(html: str, label: str, is_state: bool) -> str:
    if TRAVEL_MARKER in html:
        return html
    match = INSERT_AFTER_RE.search(html)
    if not match:
        raise ValueError("FAQ insertion point not found")
    return html[: match.end()] + faq_block(label, is_state) + html[match.end() :]


def patch_schema(html: str, label: str, is_state: bool) -> str:
    if '"@type":"FAQPage"' not in html:
        return html
    question = f"Is there a travel fee for hibachi catering in {label}?"
    if question in html:
        return html

    match = re.search(
        r'(<script type="application/ld\+json">\s*)(\{.*?\})(\s*</script>)',
        html,
        re.DOTALL,
    )
    if not match:
        return html

    data = json.loads(match.group(2))
    entity = {
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": answer_schema(label, is_state),
        },
    }
    for item in data["@graph"]:
        if item.get("@type") != "FAQPage":
            continue
        if any(q.get("name") == question for q in item["mainEntity"]):
            return html
        item["mainEntity"].insert(4, entity)

    new_json = json.dumps(data, ensure_ascii=True, separators=(",", ":"))
    return html[: match.start(2)] + new_json + html[match.end(2) :]


def patch_disclaimer(html: str) -> str:
    html = html.replace(PRICING_DISCLAIMER_OLD, PRICING_DISCLAIMER_NEW)
    return html.replace(
        "Travel fees in New Jersey vary by event location. Price may vary by location.",
        "Travel fees in New Jersey vary by event location.",
    )


def patch_page(slug: str, label: str, is_state: bool) -> None:
    path = ROOT / slug / "index.html"
    html = path.read_text(encoding="utf-8")
    new_html = patch_faq_html(html, label, is_state)
    new_html = patch_schema(new_html, label, is_state)
    new_html = patch_disclaimer(new_html)
    path.write_text(new_html, encoding="utf-8")
    print(f"Patched {slug}")


def main() -> None:
    slug, label = NJ_STATE
    patch_page(slug, label, is_state=True)
    for slug, label in NJ_COUNTIES.items():
        patch_page(slug, label, is_state=False)
    print("Done.")


if __name__ == "__main__":
    main()
