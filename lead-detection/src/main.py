"""Pipeline entry point — exécution hebdomadaire.

Flow :
  1. Collecte Sirene (~2000 PME)
  2. Enrichissement France Travail (offres d'emploi 30j)
  3. Pré-scoring heuristique → garder top N candidats (~200)
  4. Enrichissement web (site, email, tel, LinkedIn, description)
  5. Scoring final Claude → top 100 avec hook personnalisé
  6. CSV + email
"""

from __future__ import annotations

import json
import logging
import os
import sys
from pathlib import Path

import yaml
from dotenv import load_dotenv

from .pipeline.collect import collect
from .pipeline.deliver import send_email, write_csv
from .pipeline.enrich import enrich_jobs, enrich_web
from .pipeline.prescore import prescore_and_filter
from .pipeline.score import score_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger(__name__)

ROOT = Path(__file__).parent.parent
CONFIG_PATH = ROOT / "config" / "icp.yaml"
DATA_DIR = ROOT / "data"


def _save(name: str, payload) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str))


def main() -> int:
    load_dotenv(ROOT / ".env")
    config = yaml.safe_load(CONFIG_PATH.read_text(encoding="utf-8"))

    sample_size = int(os.environ.get("SAMPLE_SIZE", "2000"))
    top_n = int(os.environ.get("TOP_N", config["output"]["top_n"]))
    min_score = int(config["output"]["min_score"])
    # On enrichit web ~2× le top voulu pour avoir de la marge après filtre min_score.
    web_pool = int(os.environ.get("WEB_ENRICH_POOL", str(top_n * 2)))

    log.info("=== Step 1/6 : collect from Sirene (target=%d) ===", sample_size)
    companies = collect(config, sample_size)
    if not companies:
        log.error("No companies collected, aborting")
        return 1

    log.info("=== Step 2/6 : enrich France Travail (job signals) ===")
    enriched = enrich_jobs(companies, config)
    _save("01_enriched_jobs.json", enriched)

    log.info("=== Step 3/6 : heuristic prescore, keep top %d ===", web_pool)
    candidates = prescore_and_filter(enriched, config, keep_top=web_pool)
    _save("02_prescored.json", candidates)

    log.info("=== Step 4/6 : enrich web (site, email, tel, LinkedIn) on %d candidates ===", len(candidates))
    candidates = enrich_web(candidates)
    _save("03_web_enriched.json", candidates)

    log.info("=== Step 5/6 : final Claude scoring ===")
    scored = score_all(candidates)
    _save("04_scored.json", scored)

    log.info("=== Step 6/6 : write CSV + email (top %d, min_score=%d) ===", top_n, min_score)
    csv_path, n_leads = write_csv(scored, top_n, min_score, DATA_DIR)
    send_email(csv_path, n_leads)

    log.info("Done. CSV: %s (%d leads)", csv_path, n_leads)
    return 0


if __name__ == "__main__":
    sys.exit(main())
