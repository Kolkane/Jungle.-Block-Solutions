"""Enrichissement : ajoute le signal 'offres d'emploi récentes' depuis France Travail."""

from __future__ import annotations

import logging
import os
import time

from ..sources.france_travail import offers_for_siren, summarize_offers
from ..sources.sirene import Company

log = logging.getLogger(__name__)


def enrich(companies: list[Company], config: dict) -> list[dict]:
    client_id = os.environ.get("FRANCE_TRAVAIL_CLIENT_ID")
    client_secret = os.environ.get("FRANCE_TRAVAIL_SECRET")
    keywords = config["job_signal_keywords"]

    enriched: list[dict] = []
    skip_jobs = not (client_id and client_secret)
    if skip_jobs:
        log.warning("France Travail credentials missing, skipping job signal enrichment")

    for i, c in enumerate(companies, 1):
        row = c.to_dict()
        if skip_jobs:
            row["jobs"] = {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
        else:
            try:
                offers = offers_for_siren(client_id, client_secret, c.siren, days_back=30)
                row["jobs"] = summarize_offers(offers, keywords)
            except Exception as exc:
                log.warning("France Travail failed for %s: %s", c.siren, exc)
                row["jobs"] = {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
            time.sleep(0.3)  # courtoisie

        if i % 50 == 0:
            log.info("Enriched %d/%d", i, len(companies))
        enriched.append(row)
    return enriched
