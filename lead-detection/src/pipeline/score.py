"""Génération de copy Claude : secteur (1 phrase) + 2-3 idées concrètes.

Le scoring est désormais 100% Python (cf. prescore.py). Claude n'évalue
plus, il ne fait que produire le texte qui ira dans le CSV pour les
leads qui ont déjà passé le filtre de score.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from anthropic import Anthropic

log = logging.getLogger(__name__)

MODEL = "claude-sonnet-4-6"
BATCH_SIZE = 10


def _load_prompt() -> str:
    return (Path(__file__).parent.parent / "prompts" / "scoring.md").read_text(encoding="utf-8")


def _format_company(row: dict) -> dict:
    web = row.get("web", {}) or {}
    return {
        "siret": row["siret"],
        "nom": row["name"],
        "naf": row["naf_code"],
        "effectif_estime": row["effectif_estime"],
        "ville": row["city"],
        "departement": row["department"],
        "site_web": web.get("site_url", ""),
        "description_site": (web.get("description") or "")[:400],
        "tier": (row.get("score_breakdown") or {}).get("__tier__", ""),
    }


def _parse_response(text: str) -> list[dict]:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())


def _generate_batch(client: Anthropic, system_prompt: str, batch: list[dict]) -> list[dict]:
    user_msg = "Voici le batch d'entreprises (JSON) :\n\n" + json.dumps(
        [_format_company(r) for r in batch], ensure_ascii=False, indent=2
    )
    resp = client.messages.create(
        model=MODEL,
        max_tokens=4000,
        system=[
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[{"role": "user", "content": user_msg}],
    )
    text = resp.content[0].text
    try:
        return _parse_response(text)
    except Exception as exc:
        log.error("Claude response parse failed: %s\nRaw start: %s", exc, text[:500])
        return [{"siret": r["siret"], "secteur": "", "idees": ""} for r in batch]


def generate_copy(rows: list[dict]) -> list[dict]:
    """Pour chaque row déjà scoré, ajoute `secteur` et `idees` via Claude."""
    if not rows:
        return rows
    api_key = os.environ["ANTHROPIC_API_KEY"]
    client = Anthropic(api_key=api_key)
    system_prompt = _load_prompt()

    generated: dict[str, dict] = {}
    total_batches = (len(rows) + BATCH_SIZE - 1) // BATCH_SIZE
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        log.info("Generating copy batch %d/%d (%d companies)", i // BATCH_SIZE + 1, total_batches, len(batch))
        results = _generate_batch(client, system_prompt, batch)
        for r in results:
            if "siret" in r:
                generated[r["siret"]] = r

    for row in rows:
        g = generated.get(row["siret"], {})
        row["secteur"] = g.get("secteur", "")
        row["idees"] = g.get("idees", "")
    return rows
