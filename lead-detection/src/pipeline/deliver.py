"""Livraison : CSV minimal orienté cold call."""

from __future__ import annotations

import csv
import logging
from datetime import datetime
from pathlib import Path

log = logging.getLogger(__name__)

CSV_FIELDS = [
    "score",
    "entreprise",
    "secteur",
    "ville",
    "telephone",
    "site_web",
    "script_appel",
    "email",
]


def _flatten(row: dict) -> dict:
    web = row.get("web") or {}
    return {
        "score": row.get("score", 0),
        "entreprise": row["name"],
        "secteur": row.get("secteur", ""),
        "ville": row["city"],
        "telephone": " / ".join(web.get("phones") or []),
        "site_web": web.get("site_url", ""),
        "script_appel": row.get("script_appel", ""),
        "email": " / ".join(web.get("emails") or []),
    }


def write_csv(rows: list[dict], top_n: int, min_score: int, out_dir: Path) -> tuple[Path, int]:
    """Écrit un CSV virgule + UTF-8 BOM, importable direct dans Google Sheets et Excel."""
    out_dir.mkdir(parents=True, exist_ok=True)
    selected = [r for r in rows if r.get("score", 0) >= min_score]
    selected.sort(key=lambda r: r.get("score", 0), reverse=True)
    selected = selected[:top_n]

    ts = datetime.utcnow().strftime("%Y-%m-%d")
    path = out_dir / f"leads-{ts}.csv"
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=CSV_FIELDS,
            delimiter=",",
            quoting=csv.QUOTE_MINIMAL,
        )
        writer.writeheader()
        for row in selected:
            writer.writerow(_flatten(row))
    log.info("Wrote %d leads to %s", len(selected), path)
    return path, len(selected)
