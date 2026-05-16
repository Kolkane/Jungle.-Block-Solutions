"""Livraison : CSV final + email."""

from __future__ import annotations

import csv
import logging
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from urllib.parse import quote_plus

log = logging.getLogger(__name__)

CSV_FIELDS = [
    "score",
    "nom",
    "activite",
    "description",
    "effectif_estime",
    "adresse",
    "code_postal",
    "ville",
    "departement",
    "telephone",
    "email",
    "site_web",
    "linkedin_entreprise",
    "linkedin_recherche_decideur",
    "angle_attaque",
    "raison_score",
    "signaux_recrutement",
    "offres_emploi_30j",
    "siren",
    "siret",
    "naf_code",
    "date_creation",
]


def _flatten(row: dict) -> dict:
    jobs = row.get("jobs") or {}
    web = row.get("web") or {}
    name = row["name"]
    city = row["city"]
    linkedin_search = (
        f"https://www.linkedin.com/search/results/people/"
        f"?keywords={quote_plus(name + ' ' + city)}"
    )
    return {
        "score": row.get("score", 0),
        "nom": name,
        "activite": row.get("naf_code", ""),
        "description": row.get("description", "") or (web.get("description", "")[:200] if web else ""),
        "effectif_estime": row.get("effectif_estime", ""),
        "adresse": row.get("address", ""),
        "code_postal": row.get("postal_code", ""),
        "ville": city,
        "departement": row.get("department", ""),
        "telephone": " / ".join(web.get("phones") or []),
        "email": " / ".join(web.get("emails") or []),
        "site_web": web.get("site_url", ""),
        "linkedin_entreprise": web.get("linkedin_url", ""),
        "linkedin_recherche_decideur": linkedin_search,
        "angle_attaque": row.get("hook", ""),
        "raison_score": row.get("reason", ""),
        "signaux_recrutement": ", ".join(jobs.get("matched_signal_keywords", [])),
        "offres_emploi_30j": jobs.get("n_offers_30d", 0),
        "siren": row["siren"],
        "siret": row["siret"],
        "naf_code": row["naf_code"],
        "date_creation": row["date_creation"],
    }


def write_csv(rows: list[dict], top_n: int, min_score: int, out_dir: Path) -> tuple[Path, int]:
    out_dir.mkdir(parents=True, exist_ok=True)
    selected = [r for r in rows if r.get("score", 0) >= min_score]
    selected.sort(key=lambda r: r.get("score", 0), reverse=True)
    selected = selected[:top_n]

    ts = datetime.utcnow().strftime("%Y-%m-%d")
    path = out_dir / f"leads-{ts}.csv"
    with path.open("w", encoding="utf-8-sig", newline="") as f:  # BOM pour Excel FR
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS, delimiter=";")
        writer.writeheader()
        for row in selected:
            writer.writerow(_flatten(row))
    log.info("Wrote %d leads to %s", len(selected), path)
    return path, len(selected)


def send_email(csv_path: Path, n_leads: int) -> None:
    host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    recipient = os.environ.get("RECIPIENT_EMAIL")

    if not (user and password and recipient):
        log.warning("SMTP credentials missing, skipping email")
        return

    today = datetime.utcnow().strftime("%d/%m/%Y")
    msg = EmailMessage()
    msg["Subject"] = f"[Jungle.Block] {n_leads} leads PME — {today}"
    msg["From"] = user
    msg["To"] = recipient
    msg.set_content(
        f"""Bonjour Vincent,

Voici les {n_leads} leads PME de la semaine, triés par score décroissant.

Le CSV en pièce jointe (séparateur ";", encodage UTF-8 BOM, ouvrable direct dans Excel) contient pour chaque lead :

  • Nom, activité, description courte de l'activité
  • Coordonnées : adresse, téléphone, email, site web, LinkedIn entreprise
  • Lien de recherche LinkedIn pré-rempli pour identifier le décideur
  • Score IA /100 et raison du match
  • Angle d'attaque personnalisé prêt à adapter
  • Signaux de recrutement détectés (offres d'emploi récentes, mots-clés)

Bonne semaine de prospection.
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
