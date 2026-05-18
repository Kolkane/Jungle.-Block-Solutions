"""Pipeline entry point — exécution hebdomadaire.

Flow :
  1. Collecte Sirene (filtre tier NAF + DOM-TOM + effectif côté Python)
  2. Enrichissement web (site, email, téléphone, description) — étape lente
  3. Scoring déterministe (règles ICP, pas d'IA)
  4. Filtre score >= min_score (tier 3 nécessite >= 53)
  5. Génération copy Claude (secteur + idées) sur les leads gardés
  6. Écriture du CSV trié
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
from .pipeline.deliver import write_csv
from .pipeline.enrich import enrich_web
from .pipeline.prescore import filter_acceptable
from .pipeline.score import generate_copy

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

    log.info("=== Step 1/5 : collect from Sirene (target=%d) ===", sample_size)
    companies = collect(config, sample_size)
    if not companies:
        log.error("No companies collected, aborting")
        return 1
    log.info("Step 1 done: %d companies in tier filter", len(companies))

    log.info("=== Step 2/5 : web enrichment ===")
    enriched = enrich_web(companies)
    _save("01_web_enriched.json", enriched)

    log.info("=== Step 3/5 : deterministic scoring ===")
    scored, stats = filter_acceptable(enriched, config)
    log.info("Stats: %s", stats)
    _save("02_scored.json", scored)

    if not scored:
        log.warning("No leads passed the score threshold — CSV will be empty")

    log.info("=== Step 4/5 : Claude copy generation on %d leads ===", min(len(scored), top_n))
    final_pool = scored[:top_n]
    final_pool = generate_copy(final_pool)
    _save("03_with_copy.json", final_pool)

    log.info("=== Step 5/5 : write CSV (top %d, sorted by score desc) ===", top_n)
    csv_path, n_leads = write_csv(final_pool, top_n, DATA_DIR)

    log.info("Pipeline summary: %d collected → %d scored ≥ threshold → %d in CSV", len(companies), len(scored), n_leads)
    log.info("Done. CSV: %s — download from GitHub Actions artifact.", csv_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
