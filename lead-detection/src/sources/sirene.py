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
    r.raise_for_status()
    return r.json()


def _build_query(
    effectif_min_tranche: str,
    effectif_max_tranche: str,
    age_min_years: int,
    excluded_naf_prefixes: list[str],
) -> str:
    cutoff = datetime.utcnow().year - age_min_years
    parts = [
        "etablissementSiege:true",
        "etatAdministratifEtablissement:A",
        f"trancheEffectifsEtablissement:[{effectif_min_tranche} TO {effectif_max_tranche}]",
        f"dateCreationEtablissement:[* TO {cutoff}-12-31]",
    ]
    for prefix in excluded_naf_prefixes:
        parts.append(f"-periode(activitePrincipaleEtablissement:{prefix}*)")
    return " AND ".join(parts)


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


def fetch_sample(
    api_key: str,
    effectif_min: int,
    effectif_max: int,
    age_min_years: int,
    excluded_naf_prefixes: list[str],
    sample_size: int,
    page_size: int = 100,
) -> Iterator[Company]:
    """Stream un échantillon de PME depuis Sirene.

    Pour diversifier, on tire plusieurs pages à des offsets aléatoires plutôt que
    tout en haut de l'index (qui serait toujours les mêmes entreprises).
    """
    q = _build_query(
        _effectif_to_tranche(effectif_min),
        _effectif_to_tranche(effectif_max),
        age_min_years,
        excluded_naf_prefixes,
    )
    log.info("Sirene query: %s", q)

    first = _query_sirene(api_key, q, 1, 0)
    total = first.get("header", {}).get("total", 0)
    log.info("Sirene total matches: %d", total)
    if total == 0:
        return

    yielded = 0
    seen: set[str] = set()
    # Sirene API limite debut+nombre à 10 000. On échantillonne dans cette fenêtre.
    max_offset = min(total, 10_000) - page_size
    while yielded < sample_size:
        offset = random.randint(0, max(0, max_offset))
        try:
            page = _query_sirene(api_key, q, page_size, offset)
        except Exception as exc:
            log.warning("page fetch failed at offset %d: %s", offset, exc)
            time.sleep(2)
            continue
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
            company = _parse_etablissement(et)
            if not company:
                continue
            # Filtre NAF (le -periode dans la query ne filtre pas toujours strictement).
            if any(company.naf_code.startswith(p) for p in excluded_naf_prefixes):
                continue
            yield company
            yielded += 1
        time.sleep(2.1)  # respecter 30 req/min


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    key = os.environ["INSEE_API_KEY"]
    for c in fetch_sample(key, 10, 500, 2, ["62", "63", "84", "85"], sample_size=5):
        print(c)
