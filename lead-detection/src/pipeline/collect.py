"""Collecte des PME depuis Sirene."""

from __future__ import annotations

import logging
import os

from ..sources.sirene import Company, fetch_sample

log = logging.getLogger(__name__)


def collect(config: dict, sample_size: int) -> list[Company]:
    api_key = os.environ["INSEE_API_KEY"]
    hf = config["hard_filters"]
    excluded = config["naf_exclude_prefixes"]
    sectors = config.get("target_sectors") or {}
    sector_quotas = None
    if sectors:
        per_sector = max(1, sample_size // len(sectors))
        sector_quotas = {name: {"prefixes": s["naf_prefixes"], "quota": per_sector}
                         for name, s in sectors.items()}
        log.info("Target sectors: %s (quota %d each)", list(sectors.keys()), per_sector)
    companies = list(
        fetch_sample(
            api_key=api_key,
            effectif_min=hf["effectif_min"],
            effectif_max=hf["effectif_max"],
            age_min_years=hf["age_minimum_annees"],
            excluded_naf_prefixes=excluded,
            sample_size=sample_size,
            sector_quotas=sector_quotas,
        )
    )
    log.info("Collected %d companies from Sirene", len(companies))
    return companies
