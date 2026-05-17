"""Enrichissement en 2 étapes : France Travail (rapide) puis web (lourd, sur top N)."""

from __future__ import annotations

import logging
import os
import time

from ..sources.france_travail import FranceTravailAuthError, offers_for_siren, summarize_offers
from ..sources.sirene import Company
from ..sources.web_enrich import enrich_one

log = logging.getLogger(__name__)


def enrich_jobs(companies: list[Company], config: dict) -> list[dict]:
    """Étape 1 : ajoute le signal France Travail pour toutes les entreprises."""
    client_id = os.environ.get("FRANCE_TRAVAIL_CLIENT_ID")
    client_secret = os.environ.get("FRANCE_TRAVAIL_SECRET")
    keywords = config["job_signal_keywords"]
    skip_jobs = not (client_id and client_secret)
    if skip_jobs:
        log.warning("France Travail credentials missing, skipping job signal enrichment")

    enriched: list[dict] = []
    auth_dead = False
    auth_dead_logged = False
    for i, c in enumerate(companies, 1):
        row = c.to_dict()
        if skip_jobs or auth_dead:
            row["jobs"] = {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
        else:
            try:
                offers = offers_for_siren(client_id, client_secret, c.siren, days_back=30)
                row["jobs"] = summarize_offers(offers, keywords)
            except FranceTravailAuthError as exc:
                if not auth_dead_logged:
                    log.error("France Travail auth dead, skipping remaining %d: %s", len(companies) - i + 1, exc)
                    auth_dead_logged = True
                auth_dead = True
                row["jobs"] = {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
            except Exception as exc:
                log.warning("France Travail failed for %s: %s", c.siren, exc)
                row["jobs"] = {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
            time.sleep(0.3)
        if i % 100 == 0:
            log.info("Jobs enriched %d/%d", i, len(companies))
        enriched.append(row)
    return enriched


def enrich_web(rows: list[dict]) -> list[dict]:
    """Étape 2 : recherche web + scraping du site officiel. Appelé sur le top pre-scored."""
    log.info("Web enriching %d companies (this is the slow step)", len(rows))
    for i, row in enumerate(rows, 1):
        try:
            web = enrich_one(row["name"], row["city"], row["siren"])
        except Exception as exc:
            log.debug("web enrich failed for %s: %s", row["name"], exc)
            web = {
                "site_url": "", "site_domain": "", "description": "",
                "emails": [], "phones": [], "linkedin_url": "",
            }
        row["web"] = web
        if i % 20 == 0:
            log.info("Web enriched %d/%d", i, len(rows))
    return rows
