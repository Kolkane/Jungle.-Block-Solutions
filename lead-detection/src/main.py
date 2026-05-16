"""Pipeline entry point — exécution hebdomadaire."""

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
from .pipeline.enrich import enrich
from .pipeline.score import score_all

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger(__name__)

ROOT = Path(__file__).parent.parent
CONFIG_PATH = ROOT / "config" / "icp.yaml"
DATA_DIR = ROOT / "data"


def main() -> int:
    load_dotenv(ROOT / ".env")
    config = yaml.safe_load(CONFIG_PATH.read_text(encoding="utf-8"))

    sample_size = int(os.environ.get("SAMPLE_SIZE", "2000"))
    top_n = int(os.environ.get("TOP_N", config["output"]["top_n"]))
    min_score = int(config["output"]["min_score"])

    log.info("=== Step 1/4 : collect from Sirene (target sample=%d) ===", sample_size)
    companies = collect(config, sample_size)
    if not companies:
        log.error("No companies collected, aborting")
        return 1

    log.info("=== Step 2/4 : enrich with France Travail job signals ===")
    enriched = enrich(companies, config)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "enriched.json").write_text(json.dumps(enriched, ensure_ascii=False, indent=2))

    log.info("=== Step 3/4 : score with Claude ===")
    scored = score_all(enriched)
    (DATA_DIR / "scored.json").write_text(json.dumps(scored, ensure_ascii=False, indent=2))

    log.info("=== Step 4/4 : write CSV + send email (top %d, min_score=%d) ===", top_n, min_score)
    csv_path = write_csv(scored, top_n, min_score, DATA_DIR)

    n_leads = sum(1 for r in scored if r.get("score", 0) >= min_score)
    n_leads = min(n_leads, top_n)
    send_email(csv_path, n_leads)

    log.info("Done. CSV: %s", csv_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
