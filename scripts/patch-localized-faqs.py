#!/usr/bin/env python3
"""Insert localized FAQ blocks on all state, city and NJ county landing pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP = {"index.html", "faq/index.html"}

# slug -> (display label for questions, area phrase for travel answer, towns list)
LOCATIONS = {
    # NJ counties
    "bergen-county-hibachi-catering": ("Bergen County", "Bergen County, NJ", "Fort Lee, Paramus, Hackensack, Ridgewood, Teaneck, Englewood, Fair Lawn, Mahwah and Wyckoff"),
    "middlesex-county-hibachi-catering": ("Middlesex County", "Middlesex County, NJ", "Edison, Woodbridge, New Brunswick, East Brunswick, Piscataway, Perth Amboy, Metuchen and South Plainfield"),
    "monmouth-county-hibachi-catering": ("Monmouth County", "Monmouth County, NJ", "Red Bank, Freehold, Middletown, Long Branch, Holmdel, Manalapan, Asbury Park and Colts Neck"),
    "ocean-county-hibachi-catering": ("Ocean County", "Ocean County, NJ", "Toms River, Brick, Lakewood, Point Pleasant, Jackson, Barnegat, Berkeley Township and Stafford"),
    "morris-county-hibachi-catering": ("Morris County", "Morris County, NJ", "Morristown, Parsippany, Randolph, Madison, Denville, Florham Park, Chatham and Morris Plains"),
    "essex-county-hibachi-catering": ("Essex County", "Essex County, NJ", "Newark, Montclair, West Orange, Livingston, Maplewood, Bloomfield, Millburn and South Orange"),
    "union-county-hibachi-catering": ("Union County", "Union County, NJ", "Elizabeth, Westfield, Summit, Cranford, Scotch Plains, Linden, Clark and Mountainside"),
    "somerset-county-hibachi-catering": ("Somerset County", "Somerset County, NJ", "Bridgewater, Somerville, Franklin Township, Hillsborough, Bernardsville, Basking Ridge, Bound Brook and Warren"),
    "hunterdon-county-hibachi-catering": ("Hunterdon County", "Hunterdon County, NJ", "Flemington, Clinton, Lambertville, Lebanon, Readington, Hampton, Califon and Frenchtown"),
    "mercer-county-hibachi-catering": ("Mercer County", "Mercer County, NJ", "Princeton, Trenton, Hamilton, Lawrence Township, West Windsor, Ewing, Hopewell and Pennington"),
    # States
    "arizona": ("Arizona", "Arizona", "Phoenix, Scottsdale, Tempe, Mesa, Chandler, Glendale and the Valley"),
    "california": ("California", "California", "Los Angeles, San Francisco, San Diego, Orange County, Sacramento and across California"),
    "connecticut": ("Connecticut", "Connecticut", "Hartford, New Haven, Stamford, Greenwich, Fairfield and across Connecticut"),
    "delaware": ("Delaware", "Delaware", "Wilmington, Newark, Dover, Rehoboth Beach, Middletown and across Delaware"),
    "florida": ("Florida", "Florida", "Miami, Orlando, Tampa, Jacksonville, Fort Lauderdale and across Florida"),
    "georgia": ("Georgia", "Georgia", "Atlanta, Savannah, Augusta, Columbus, Macon and across Georgia"),
    "illinois": ("Illinois", "Illinois", "Chicago, Naperville, Aurora, Evanston, Oak Park and across Illinois"),
    "indiana": ("Indiana", "Indiana", "Indianapolis, Fort Wayne, Carmel, Bloomington, Evansville and across Indiana"),
    "maryland": ("Maryland", "Maryland", "Baltimore, Bethesda, Rockville, Annapolis, Columbia and across Maryland"),
    "massachusetts": ("Massachusetts", "Massachusetts", "Boston, Cambridge, Worcester, Springfield, Cape Cod and across Massachusetts"),
    "michigan": ("Michigan", "Michigan", "Detroit, Grand Rapids, Ann Arbor, Lansing, Troy and across Michigan"),
    "mississippi": ("Mississippi", "Mississippi", "Jackson, Gulfport, Biloxi, Hattiesburg, Oxford and across Mississippi"),
    "new-jersey": ("New Jersey", "New Jersey", "Newark, Jersey City, Princeton, Hoboken, Bergen County, Middlesex County and across New Jersey"),
    "new-york": ("New York", "New York", "New York City, Westchester, Hudson Valley and across New York State"),
    "north-carolina": ("North Carolina", "North Carolina", "Charlotte, Raleigh, Durham, Greensboro, Asheville and across North Carolina"),
    "oklahoma": ("Oklahoma", "Oklahoma", "Oklahoma City, Tulsa, Norman, Edmond, Broken Arrow and across Oklahoma"),
    "pennsylvania": ("Pennsylvania", "Pennsylvania", "Philadelphia, Pittsburgh, Harrisburg, Allentown, Lancaster and across Pennsylvania"),
    "rhode-island": ("Rhode Island", "Rhode Island", "Providence, Newport, Warwick, Cranston, Narragansett and across Rhode Island"),
    "south-carolina": ("South Carolina", "South Carolina", "Charleston, Columbia, Greenville, Myrtle Beach, Hilton Head and across South Carolina"),
    "tennessee": ("Tennessee", "Tennessee", "Nashville, Memphis, Knoxville, Chattanooga, Franklin and across Tennessee"),
    "texas": ("Texas", "Texas", "Dallas, Fort Worth, Austin, Houston, San Antonio, Waco, Victoria and across Texas"),
    "virginia": ("Virginia", "Virginia", "Northern Virginia, Richmond, Virginia Beach, Charlottesville, Roanoke and across Virginia"),
    "washington-dc": ("Washington, DC", "Washington, DC", "DC, Georgetown, Capitol Hill, Dupont Circle and the greater DMV area"),
    # Cities
    "phoenix-hibachi-at-home": ("Phoenix, AZ", "Phoenix, AZ", "Phoenix, Scottsdale, Tempe, Mesa, Chandler and the Valley"),
    "long-island-hibachi-at-home": ("Long Island, NY", "Long Island, NY", "Nassau County, Suffolk County, the Hamptons, Huntington and across Long Island"),
    "albany-hibachi-at-home": ("Albany, NY", "Albany, NY", "Albany, Saratoga Springs, Schenectady, Troy and the Capital Region"),
    "rochester-buffalo-hibachi-at-home": ("Rochester–Buffalo, NY", "Rochester and Buffalo, NY", "Rochester, Buffalo, Pittsford, Amherst, Williamsville and Western New York"),
    "miami-hibachi-at-home": ("Miami, FL", "Miami, FL", "Miami, Miami Beach, Coral Gables, Kendall, Aventura and South Florida"),
    "orlando-hibachi-at-home": ("Orlando, FL", "Orlando, FL", "Orlando, Winter Park, Lake Nona, Kissimmee and Central Florida"),
    "tampa-hibachi-at-home": ("Tampa, FL", "Tampa, FL", "Tampa, St. Petersburg, Clearwater, Brandon and Tampa Bay"),
    "jacksonville-hibachi-at-home": ("Jacksonville, FL", "Jacksonville, FL", "Jacksonville, Ponte Vedra, St. Augustine and Northeast Florida"),
    "fort-lauderdale-hibachi-at-home": ("Fort Lauderdale, FL", "Fort Lauderdale, FL", "Fort Lauderdale, Pompano Beach, Hollywood, Weston and Broward County"),
    "atlanta-hibachi-at-home": ("Atlanta, GA", "Atlanta, GA", "Atlanta, Buckhead, Sandy Springs, Alpharetta, Marietta and metro Atlanta"),
    "chicago-hibachi-at-home": ("Chicago, IL", "Chicago, IL", "Chicago, Evanston, Oak Park, Naperville, Schaumburg and Chicagoland"),
    "dallas-hibachi-at-home": ("Dallas, TX", "Dallas, TX", "Dallas, Plano, Frisco, Irving, Richardson and the DFW metroplex"),
    "fort-worth-hibachi-at-home": ("Fort Worth, TX", "Fort Worth, TX", "Fort Worth, Arlington, Keller, Southlake and western DFW"),
    "austin-hibachi-at-home": ("Austin, TX", "Austin, TX", "Austin, Round Rock, Cedar Park, Lakeway and Central Texas"),
    "houston-hibachi-at-home": ("Houston, TX", "Houston, TX", "Houston, The Woodlands, Katy, Sugar Land, Pearland and Greater Houston"),
    "san-antonio-hibachi-at-home": ("San Antonio, TX", "San Antonio, TX", "San Antonio, Alamo Heights, Stone Oak, Boerne and surrounding Bexar County"),
    "waco-hibachi-at-home": ("Waco, TX", "Waco, TX", "Waco, Hewitt, Woodway, Robinson and Central Texas"),
    "victoria-hibachi-at-home": ("Victoria, TX", "Victoria, TX", "Victoria, Port Lavaca, Cuero and the Texas Gulf Coast"),
}

REMOVE_MARKERS = (
    "What is the guest number limit",
    "What is the price?",
    "What is the price</span>",
    "What should I prepare for my party",
    "How much does hibachi catering cost?",
    "How much does hibachi catering in",
    "What do guests need to provide?",
    "What do guests need to provide for a",
    "How many people are required?",
    "How many people are required to book",
    "Do you travel to",
)

FAQ_ITEM_RE = re.compile(r'<div class="faq-item">.*?</div>\s*</div>', re.DOTALL)


def localized_faq_html(label: str, travel_area: str, towns: str) -> str:
    items = [
        (
            f"Do you travel to {label}?",
            f"Yes. Hibachi2Party provides <strong>mobile hibachi catering throughout {travel_area}</strong>, including {towns}. Book online or call <a href=\"tel:+19297597607\">(929) 759-7607</a> to confirm availability for your address.",
        ),
        (
            f"How much does hibachi catering in {label} cost?",
            f"Our base rate is <strong>$50 per adult</strong> and <strong>$25 per child under 12</strong>, with a <strong>$500 minimum spend</strong> for all events in {label}. Each guest receives salad, fried rice, hibachi vegetables and <strong>two protein choices</strong>. See our <a href=\"/menu\">menu &amp; pricing page</a> for upgrades. *Sales tax is not included — applicable state and local tax may be added based on where your event is held.",
        ),
        (
            f"What do guests need to provide for a {label} hibachi party?",
            f"Please have ready: eating utensils, plates and salad bowls, beverages, tables and chairs, and a clear area for our mobile grill (approximately 68\" L × 28\" W × 41\" H). We bring the chef, grill, propane, food and live entertainment to your {label} event.",
        ),
        (
            f"How many people are required to book in {label}?",
            f"There is no maximum guest count. Every event has a <strong>$500 minimum spend</strong> — typically about 10 adults at our base rate. Smaller groups in {label} are welcome as long as the minimum is met.",
        ),
    ]
    blocks = []
    for q, a in items:
        blocks.append(
            f"""      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>{q}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer"><p>{a}</p></div>
      </div>"""
        )
    return "\n".join(blocks) + "\n"


def should_remove_faq_block(block: str) -> bool:
    return any(marker in block for marker in REMOVE_MARKERS)


def patch_faq_list(html: str, localized: str) -> str:
    match = re.search(r'(<div class="faq-list reveal">\s*)', html)
    if not match:
        raise ValueError("faq-list not found")

    start = match.end()
    rest = html[start:]
    end_match = re.search(r'</div>\s*<div class="text-center reveal" style="margin-top:2rem">', rest)
    if not end_match:
        end_match = re.search(r'</div>\s*</div>\s*</section>', rest)
    if not end_match:
        raise ValueError("faq-list end not found")

    inner = rest[: end_match.start()]
    kept = []
    for block in FAQ_ITEM_RE.findall(inner):
        if not should_remove_faq_block(block):
            kept.append(block.strip())

    new_inner = localized + "\n".join(f"      {b}" if not b.startswith("      ") else b for b in kept)
    if kept:
        new_inner += "\n"

    return html[:start] + new_inner + rest[end_match.start() :]


def patch_schema_faq(html: str, label: str, travel_area: str, towns: str) -> str:
  questions = [
      (f"Do you travel to {label}?", f"Yes. Hibachi2Party provides mobile hibachi catering throughout {travel_area}, including {towns}."),
      (f"How much does hibachi catering in {label} cost?", "Base rate is $50 per adult and $25 per child under 12, with a $500 minimum spend for all events."),
      (f"What do guests need to provide for a {label} hibachi party?", "Hosts provide utensils, plates, beverages, tables, chairs and a clear area for the mobile grill. We bring the chef, grill, food and entertainment."),
      (f"How many people are required to book in {label}?", "There is no maximum guest count. Every event has a $500 minimum spend — typically about 10 adults at the base rate."),
  ]
  entities = []
  for q, a in questions:
      entities.append(
          '{"@type":"Question","name":'
          + json_escape(q)
          + ',"acceptedAnswer":{"@type":"Answer","text":'
          + json_escape(a)
          + "}}"
      )
  faq_graph = (
      '{"@type":"FAQPage","@id":"#localfaq","mainEntity":['
      + ",".join(entities)
      + "]}"
  )

  if '"@type":"FAQPage"' in html:
      html = re.sub(
          r'\{"@type":"FAQPage"[^}]*(?:\{[^}]*\}[^}]*)*\}',
          faq_graph.replace("#localfaq", "PLACEHOLDER"),
          html,
          count=1,
      )
      return html

  if '"@graph":[' in html and "application/ld+json" in html:
      def add_faq(m):
          graph = m.group(1)
          if "FAQPage" in graph:
              return m.group(0)
          insert = faq_graph.replace('"@id":"#localfaq"', '"@id":"' + extract_page_url(html) + '#faq"')
          return '"@graph":[' + insert + "," + graph

      html2 = re.sub(r'"@graph":\[(\{)', add_faq, html, count=1)
      if html2 != html:
          return html2
  return html


def json_escape(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def extract_page_url(html: str) -> str:
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    return m.group(1) if m else "https://hibachi2partys.com/"


def main():
    updated = 0
    for slug, (label, travel_area, towns) in LOCATIONS.items():
        path = ROOT / slug / "index.html"
        if not path.exists():
            print(f"SKIP missing {path}")
            continue
        html = path.read_text(encoding="utf-8")
        localized = localized_faq_html(label, travel_area, towns)
        try:
            new_html = patch_faq_list(html, localized)
        except ValueError as e:
            print(f"FAIL {slug}: {e}")
            continue
        path.write_text(new_html, encoding="utf-8")
        print(f"Patched {slug}")
        updated += 1

    print(f"Done. Updated {updated} pages.")


if __name__ == "__main__":
    main()
