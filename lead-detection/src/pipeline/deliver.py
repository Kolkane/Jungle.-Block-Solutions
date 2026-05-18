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
    "idees",
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
        "idees": row.get("idees", ""),
        "email": " / ".join(web.get("emails") or []),
    }


def write_csv(rows: list[dict], top_n: int, out_dir: Path) -> tuple[Path, int]:
    """Écrit le CSV final, déjà filtré et trié par score décroissant."""
    out_dir.mkdir(parents=True, exist_ok=True)
    selected = rows[:top_n]
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
