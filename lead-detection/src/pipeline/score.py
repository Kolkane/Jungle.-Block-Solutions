"""Scoring final IA via Claude — appelé sur le top pré-scoré et enrichi web."""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from anthropic import Anthropic

log = logging.getLogger(__name__)

MODEL = "claude-sonnet-4-6"
BATCH_SIZE = 15


def _load_prompt() -> str:
    return (Path(__file__).parent.parent / "prompts" / "scoring.md").read_text(encoding="utf-8")


def _format_company(row: dict) -> dict:
    web = row.get("web", {}) or {}
    return {
        "siret": row["siret"],
        "siren": row["siren"],
        "nom": row["name"],
        "naf": row["naf_code"],
        "effectif_estime": row["effectif_estime"],
        "tranche_effectif": row["effectif_tranche"],
        "date_creation": row["date_creation"],
        "ville": row["city"],
        "departement": row["department"],
        "offres_emploi_30j": row["jobs"]["n_offers_30d"],
        "mots_cles_signal": row["jobs"]["matched_signal_keywords"],
        "exemples_titres_postes": row["jobs"]["sample_titles"],
        "site_web": web.get("site_url", ""),
        "description_site": (web.get("description") or "")[:400],
        "linkedin_entreprise": web.get("linkedin_url", ""),
        "emails_trouves": web.get("emails", []),
        "telephones_trouves": web.get("phones", []),
    }


def _parse_response(text: str) -> list[dict]:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())


def score_batch(client: Anthropic, system_prompt: str, batch: list[dict]) -> list[dict]:
    user_msg = "Voici le batch d'entreprises à scorer (JSON) :\n\n" + json.dumps(
        [_format_company(r) for r in batch], ensure_ascii=False, indent=2
    )
    resp = client.messages.create(
        model=MODEL,
        max_tokens=6000,
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
        return [
            {"siret": r["siret"], "score": 0, "description": "", "reason": "parse error", "hook": ""}
            for r in batch
        ]


def score_all(enriched: list[dict]) -> list[dict]:
    api_key = os.environ["ANTHROPIC_API_KEY"]
    client = Anthropic(api_key=api_key)
    system_prompt = _load_prompt()

    scored: dict[str, dict] = {}
    total_batches = (len(enriched) + BATCH_SIZE - 1) // BATCH_SIZE
    for i in range(0, len(enriched), BATCH_SIZE):
        batch = enriched[i : i + BATCH_SIZE]
        log.info("Scoring batch %d/%d (%d companies)", i // BATCH_SIZE + 1, total_batches, len(batch))
        results = score_batch(client, system_prompt, batch)
        for r in results:
            if "siret" in r:
                scored[r["siret"]] = r

    out: list[dict] = []
    for row in enriched:
        s = scored.get(row["siret"], {})
        out.append({
            **row,
            "score": s.get("score", 0),
            "description": s.get("description", ""),
            "reason": s.get("reason", ""),
            "hook": s.get("hook", ""),
        })
    return out
