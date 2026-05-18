"""Enrichissement web : trouve le site officiel + scrape coordonnées."""

from __future__ import annotations

import logging

from ..sources.sirene import Company
from ..sources.web_enrich import enrich_one

log = logging.getLogger(__name__)


def enrich_web(companies: list[Company]) -> list[dict]:
    """Recherche web + scraping pour chaque entreprise. Retourne une liste de dicts."""
    log.info("Web enriching %d companies (this is the slow step)", len(companies))
    rows: list[dict] = []
    for i, c in enumerate(companies, 1):
        row = c.to_dict()
        try:
            row["web"] = enrich_one(row["name"], row["city"], row["siren"])
        except Exception as exc:
            log.debug("web enrich failed for %s: %s", row["name"], exc)
            row["web"] = {
                "site_url": "", "site_domain": "", "description": "",
                "emails": [], "phones": [], "linkedin_url": "",
            }
        rows.append(row)
        if i % 20 == 0:
            log.info("Web enriched %d/%d", i, len(companies))
    return rows
