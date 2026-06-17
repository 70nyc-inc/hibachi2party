#!/usr/bin/env python3
"""Mark booking pages as noindex and point canonical to matching SEO landing pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOKING_DIR = ROOT / "booking"
BASE = "https://hibachi2partys.com"
SEO_LINK_RE = re.compile(
    r'href="(/[^"]+/)" class="btn btn-outline">View .+ Local Info'
)
ROBOTS_OLD = '<meta name="robots" content="index, follow">'
ROBOTS_NEW = '<meta name="robots" content="noindex, follow">'
CANONICAL_RE = re.compile(
    r'<link rel="canonical" href="https://hibachi2partys\.com/booking/[^"]+">'
)


def main() -> None:
    updated = 0
    for path in sorted(BOOKING_DIR.glob("*/index.html")):
        text = path.read_text(encoding="utf-8")
        match = SEO_LINK_RE.search(text)
        if not match:
            print(f"SKIP (no SEO link): {path.relative_to(ROOT)}")
            continue

        seo_path = match.group(1)
        canonical = f'<link rel="canonical" href="{BASE}{seo_path}">'

        if ROBOTS_OLD not in text:
            print(f"SKIP (robots already patched?): {path.relative_to(ROOT)}")
            continue

        text = text.replace(ROBOTS_OLD, ROBOTS_NEW)
        text, n = CANONICAL_RE.subn(canonical, text, count=1)
        if n != 1:
            print(f"WARN canonical replace count={n}: {path.relative_to(ROOT)}")

        path.write_text(text, encoding="utf-8")
        print(f"OK {path.relative_to(ROOT)} -> {seo_path}")
        updated += 1

    print(f"\nUpdated {updated} booking pages.")


if __name__ == "__main__":
    main()
