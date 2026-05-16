"""Pré-scoring heuristique sans appel LLM.

Objectif : ramener un échantillon de ~2000 PME à ~200 candidates pour
l'enrichissement web coûteux (1 fetch par entreprise). Pas de jugement
fin ici — juste éliminer le bruit évident.
"""

from __future__ import annotations

import logging

log = logging.getLogger(__name__)


def heuristic_score(row: dict, config: dict) -> int:
    """Score 0-100 basé sur des règles déterministes."""
    score = 30  # baseline

    eff = row.get("effectif_estime", 0)
    if 20 <= eff <= 250:
        score += 20
    elif 10 <= eff < 20 or 250 < eff <= 500:
        score += 10

    jobs = row.get("jobs", {})
    n_offers = jobs.get("n_offers_30d", 0)
    if n_offers >= 3:
        score += 25
    elif n_offers >= 1:
        score += 15

    matched = jobs.get("matched_signal_keywords", [])
    score += min(len(matched) * 5, 20)

    dept = row.get("department", "")
    for geo in config.get("geo_bonus", {}).values():
        if dept in geo.get("departments", []):
            score += geo.get("bonus", 0)
            break

    return min(score, 100)


def prescore_and_filter(enriched: list[dict], config: dict, keep_top: int) -> list[dict]:
    for row in enriched:
        row["prescore"] = heuristic_score(row, config)
    enriched.sort(key=lambda r: r["prescore"], reverse=True)
    kept = enriched[:keep_top]
    log.info(
        "Prescored %d, kept top %d (min=%d, max=%d)",
        len(enriched),
        len(kept),
        kept[-1]["prescore"] if kept else 0,
        kept[0]["prescore"] if kept else 0,
    )
    return kept
