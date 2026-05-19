"""Enrichissement web : trouve le site officiel + scrape coordonnées + signaux ICP."""

from __future__ import annotations

import logging

from ..sources.sirene import Company
from ..sources.web_enrich import enrich_one

log = logging.getLogger(__name__)


def enrich_web(companies: list[Company], config: dict) -> list[dict]:
    """Recherche web + scraping pour chaque entreprise. Retourne une liste de dicts."""
    log.info("Web enriching %d companies (this is the slow step)", len(companies))
    signals = config.get("web_signals", {})
    rows: list[dict] = []
    for i, c in enumerate(companies, 1):
        row = c.to_dict()
        try:
            row["web"] = enrich_one(row["name"], row["city"], row["siren"], signals=signals)
        except Exception as exc:
            log.debug("web enrich failed for %s: %s", row["name"], exc)
            row["web"] = {
                "site_url": "", "site_domain": "", "description": "",
                "emails": [], "phones": [], "linkedin_url": "",
                "has_subsidiary_mention": False, "has_saas_heavy": False,
                "has_pro_area": False, "has_manual_process": False,
            }
        rows.append(row)
        if i % 20 == 0:
            log.info("Web enriched %d/%d", i, len(companies))
    return rows
