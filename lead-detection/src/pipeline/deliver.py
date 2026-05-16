"""Livraison : CSV + email."""

from __future__ import annotations

import csv
import logging
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path

log = logging.getLogger(__name__)

CSV_FIELDS = [
    "score",
    "name",
    "siren",
    "siret",
    "naf_code",
    "effectif_estime",
    "city",
    "department",
    "date_creation",
    "n_offers_30d",
    "matched_signal_keywords",
    "sample_job_titles",
    "reason",
    "hook",
    "linkedin_search",
]


def _flatten(row: dict) -> dict:
    jobs = row.get("jobs", {})
    name = row["name"].replace(" ", "+")
    return {
        "score": row.get("score", 0),
        "name": row["name"],
        "siren": row["siren"],
        "siret": row["siret"],
        "naf_code": row["naf_code"],
        "effectif_estime": row["effectif_estime"],
        "city": row["city"],
        "department": row["department"],
        "date_creation": row["date_creation"],
        "n_offers_30d": jobs.get("n_offers_30d", 0),
        "matched_signal_keywords": ", ".join(jobs.get("matched_signal_keywords", [])),
        "sample_job_titles": " | ".join(jobs.get("sample_titles", [])),
        "reason": row.get("reason", ""),
        "hook": row.get("hook", ""),
        "linkedin_search": f"https://www.linkedin.com/search/results/people/?keywords={name}",
    }


def write_csv(rows: list[dict], top_n: int, min_score: int, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    selected = [r for r in rows if r.get("score", 0) >= min_score]
    selected.sort(key=lambda r: r.get("score", 0), reverse=True)
    selected = selected[:top_n]

    ts = datetime.utcnow().strftime("%Y-%m-%d")
    path = out_dir / f"leads-{ts}.csv"
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for row in selected:
            writer.writerow(_flatten(row))
    log.info("Wrote %d leads to %s", len(selected), path)
    return path


def send_email(csv_path: Path, n_leads: int) -> None:
    host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    recipient = os.environ.get("RECIPIENT_EMAIL")

    if not (user and password and recipient):
        log.warning("SMTP credentials missing, skipping email")
        return

    msg = EmailMessage()
    msg["Subject"] = f"[Jungle.Block] {n_leads} leads — {datetime.utcnow().strftime('%d/%m/%Y')}"
    msg["From"] = user
    msg["To"] = recipient
    msg.set_content(
        f"""Bonjour Vincent,

Voici la liste hebdomadaire de {n_leads} PME françaises à fort potentiel,
détectées et scorées par le pipeline Jungle.Block lead detection.

Le CSV en pièce jointe est trié par score décroissant. Pour chaque ligne :
- le score IA /100 et la raison du match
- un hook personnalisé à adapter
- un lien LinkedIn pré-rempli pour identifier le décideur
- les signaux d'achat détectés (offres d'emploi récentes, mots-clés)

Bonnes prospections.
"""
    )
    with csv_path.open("rb") as f:
        msg.add_attachment(
            f.read(), maintype="text", subtype="csv", filename=csv_path.name
        )

    with smtplib.SMTP(host, port) as s:
        s.starttls()
        s.login(user, password)
        s.send_message(msg)
    log.info("Email sent to %s", recipient)
