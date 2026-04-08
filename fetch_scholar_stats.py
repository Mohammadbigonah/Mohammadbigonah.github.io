import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

import requests

SCHOLAR_USER_ID = os.environ.get("SCHOLAR_USER_ID", "Jcs-EDoAAAAJ")
OUT_PATH = Path(os.environ.get("OUT_PATH", "scholar_stats.json"))
PROFILE_URL = f"https://scholar.google.com/citations?hl=en&user={SCHOLAR_USER_ID}"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/123.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

def extract_metric(html: str, label: str, fallback: int = 0) -> int:
    pattern = rf'>{re.escape(label)}</a></td><td class="gsc_rsb_std">(\d+)<'
    m = re.search(pattern, html)
    return int(m.group(1)) if m else fallback

def extract_publication_count(html: str) -> int:
    return len(re.findall(r'class="gsc_a_at"', html))

def main() -> None:
    resp = requests.get(PROFILE_URL, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    html = resp.text

    data = {
        "scholar_user_id": SCHOLAR_USER_ID,
        "profile_url": PROFILE_URL,
        "publications_count": extract_publication_count(html),
        "citations_all": extract_metric(html, "Citations"),
        "hindex_all": extract_metric(html, "h-index"),
        "i10index_all": extract_metric(html, "i10-index"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": "google_scholar_public_profile_html",
    }

    OUT_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_PATH} -> {data}")

if __name__ == "__main__":
    main()
