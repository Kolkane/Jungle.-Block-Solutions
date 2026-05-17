"""INSEE Sirene API client.

Doc: https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/item-info.jag?name=Sirene&version=V3.11
Auth: Bearer token via API key (X-INSEE-Api-Key-Integration).
Rate limit: 30 req/min.
"""

from __future__ import annotations

import logging
import os
import random
import time
from dataclasses import dataclass
from datetime import datetime
from typing import Iterator

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

log = logging.getLogger(__name__)

SIRENE_URL = "https://api.insee.fr/api-sirene/3.11/siret"


@dataclass
class Company:
    siret: str
    siren: str
    name: str
    naf_code: str
    naf_label: str
    effectif_tranche: str
    effectif_estime: int
    date_creation: str
    address: str
    postal_code: str
    city: str
    department: str

    def to_dict(self) -> dict:
        return {
            "siret": self.siret,
            "siren": self.siren,
            "name": self.name,
            "naf_code": self.naf_code,
            "naf_label": self.naf_label,
            "effectif_tranche": self.effectif_tranche,
            "effectif_estime": self.effectif_estime,
            "date_creation": self.date_creation,
            "address": self.address,
            "postal_code": self.postal_code,
            "city": self.city,
            "department": self.department,
        }


# Tranche INSEE → fourchette d'effectif moyenne.
EFFECTIF_TRANCHES = {
    "01": 2, "02": 4, "03": 7, "11": 15, "12": 35, "21": 75,
    "22": 150, "31": 350, "32": 750, "41": 1500, "42": 3500,
    "51": 7500, "52": 15000, "53": 25000,
}


def _estimate_effectif(tranche: str | None) -> int:
    if not tranche:
        return 0
    return EFFECTIF_TRANCHES.get(tranche, 0)


@retry(stop=stop_after_attempt(4), wait=wait_exponential(multiplier=2, min=2, max=30))
def _query_sirene(api_key: str, q: str, nombre: int, debut: int) -> dict:
    headers = {"X-INSEE-Api-Key-Integration": api_key, "Accept": "application/json"}
    params = {"q": q, "nombre": nombre, "debut": debut}
    r = requests.get(SIRENE_URL, headers=headers, params=params, timeout=30)
    if r.status_code == 429:
        log.warning("Sirene rate limit, sleeping 5s")
        time.sleep(5)
        r.raise_for_status()
    if r.status_code >= 400:
        log.error("Sirene %d on q=%r → body: %s", r.status_code, q, r.text[:1000])
    r.raise_for_status()
    return r.json()


def _build_query(age_min_years: int) -> str:
    """Query Sirene v3.11 minimale qui passe sans erreur de syntaxe.

    On filtre juste sur les sièges créés avant le cutoff. Tout le reste
    (état actif, tranche d'effectif, NAF) est filtré côté Python sur la
    réponse — c'est moins économe en bande passante mais robuste.
    """
    cutoff = datetime.utcnow().year - age_min_years
    return (
        "etablissementSiege:true"
        f" AND dateCreationEtablissement:[1900-01-01 TO {cutoff}-12-31]"
    )


def _effectif_to_tranche(eff: int) -> str:
    if eff < 10:
        return "03"
    if eff < 20:
        return "11"
    if eff < 50:
        return "12"
    if eff < 100:
        return "21"
    if eff < 200:
        return "22"
    if eff < 500:
        return "31"
    return "32"


def _parse_etablissement(et: dict) -> Company | None:
    try:
        unite = et.get("uniteLegale", {})
        adr = et.get("adresseEtablissement", {})
        periode = (et.get("periodesEtablissement") or [{}])[0]

        name = (
            unite.get("denominationUniteLegale")
            or " ".join(filter(None, [unite.get("prenom1UniteLegale"), unite.get("nomUniteLegale")]))
            or "—"
        )
        naf = periode.get("activitePrincipaleEtablissement") or unite.get("activitePrincipaleUniteLegale") or ""
        tranche = et.get("trancheEffectifsEtablissement") or unite.get("trancheEffectifsUniteLegale")

        postal = adr.get("codePostalEtablissement") or ""
        return Company(
            siret=et.get("siret", ""),
            siren=et.get("siren", ""),
            name=name.strip(),
            naf_code=naf,
            naf_label="",  # libellé NAF non fourni directement par l'API, on enrichira au besoin
            effectif_tranche=tranche or "",
            effectif_estime=_estimate_effectif(tranche),
            date_creation=et.get("dateCreationEtablissement", ""),
            address=" ".join(
                filter(None, [
                    adr.get("numeroVoieEtablissement"),
                    adr.get("typeVoieEtablissement"),
                    adr.get("libelleVoieEtablissement"),
                ])
            ),
            postal_code=postal,
            city=adr.get("libelleCommuneEtablissement") or "",
            department=postal[:2] if len(postal) >= 2 else "",
        )
    except Exception as exc:
        log.debug("parse error: %s", exc)
        return None


def _is_active(et: dict) -> bool:
    """Vrai si la période en cours porte etatAdministratifEtablissement = A."""
    periodes = et.get("periodesEtablissement") or []
    if not periodes:
        return False
    # La première période est la plus récente sur l'API v3.11
    return periodes[0].get("etatAdministratifEtablissement") == "A"


def _match_sector(naf_code: str, sector_quotas: dict | None) -> str | None:
    if not sector_quotas:
        return "_default"
    for name, info in sector_quotas.items():
        if any(naf_code.startswith(p) for p in info["prefixes"]):
            return name
    return None


def fetch_sample(
    api_key: str,
    effectif_min: int,
    effectif_max: int,
    age_min_years: int,
    excluded_naf_prefixes: list[str],
    sample_size: int,
    page_size: int = 100,
    sector_quotas: dict | None = None,
) -> Iterator[Company]:
    """Stream un échantillon de PME depuis Sirene avec quota par secteur.

    Si `sector_quotas` est fourni, on continue à tirer des pages tant qu'un
    secteur n'a pas atteint son quota — les entreprises hors secteurs cibles
    sont jetées. Sans quotas, on tire jusqu'à `sample_size` toutes catégories.
    """
    q = _build_query(age_min_years)
    log.info("Sirene query: %s", q)

    first = _query_sirene(api_key, q, 1, 0)
    total = first.get("header", {}).get("total", 0)
    log.info("Sirene total matches: %d", total)
    if total == 0:
        return

    min_tranche = _effectif_to_tranche(effectif_min)
    max_tranche = _effectif_to_tranche(effectif_max)

    sector_counts: dict[str, int] = {name: 0 for name in (sector_quotas or {})}

    def all_quotas_met() -> bool:
        if not sector_quotas:
            return False
        return all(sector_counts[name] >= info["quota"] for name, info in sector_quotas.items())

    yielded = 0
    seen: set[str] = set()
    pages_seen = 0
    pages_max = 400  # garde-fou augmenté car beaucoup de tirages tombent hors secteurs cibles
    max_offset = min(total, 10_000) - page_size
    while yielded < sample_size and pages_seen < pages_max and not all_quotas_met():
        offset = random.randint(0, max(0, max_offset))
        try:
            page = _query_sirene(api_key, q, page_size, offset)
        except Exception as exc:
            log.warning("page fetch failed at offset %d: %s", offset, exc)
            time.sleep(2)
            continue
        pages_seen += 1
        ets = page.get("etablissements", [])
        if not ets:
            break
        for et in ets:
            if yielded >= sample_size:
                return
            siret = et.get("siret", "")
            if not siret or siret in seen:
                continue
            seen.add(siret)
            if not _is_active(et):
                continue
            company = _parse_etablissement(et)
            if not company:
                continue
            if not company.effectif_tranche or not (
                min_tranche <= company.effectif_tranche <= max_tranche
            ):
                continue
            if any(company.naf_code.startswith(p) for p in excluded_naf_prefixes):
                continue
            sector = _match_sector(company.naf_code, sector_quotas)
            if sector is None:
                continue
            if sector_quotas and sector_counts[sector] >= sector_quotas[sector]["quota"]:
                continue
            sector_counts[sector] = sector_counts.get(sector, 0) + 1
            yield company
            yielded += 1
        if pages_seen % 20 == 0:
            log.info("fetch_sample progress: %d kept after %d pages, sectors=%s",
                     yielded, pages_seen, sector_counts)
        time.sleep(2.1)
    log.info("fetch_sample done: %d kept after %d pages, sectors=%s",
             yielded, pages_seen, sector_counts)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    key = os.environ["INSEE_API_KEY"]
    for c in fetch_sample(key, 10, 500, 2, ["62", "63", "84", "85"], sample_size=5):
        print(c)
