"""France Travail (ex-Pôle Emploi) Offres d'emploi API.

Doc: https://francetravail.io/produits-partages/catalogue/offres-emploi/documentation
Auth: OAuth2 client credentials (scope: api_offresdemploiv2 o2dsoffre).
"""

from __future__ import annotations

import logging
import time
from datetime import datetime, timedelta
from typing import Any

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

log = logging.getLogger(__name__)

TOKEN_URL = "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire"
OFFERS_URL = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search"


_token_cache: dict[str, Any] = {"token": None, "expires_at": 0.0, "failed": False}


class FranceTravailAuthError(RuntimeError):
    pass


def _get_token(client_id: str, client_secret: str) -> str:
    # Une fois que l'auth a échoué, on n'essaie plus de la régénérer pour chaque SIREN.
    if _token_cache["failed"]:
        raise FranceTravailAuthError("auth previously failed, skipping")
    if _token_cache["token"] and time.time() < _token_cache["expires_at"] - 30:
        return _token_cache["token"]

    # France Travail attend un scope qui inclut explicitement application_<client_id>
    # en plus des scopes API demandés. Doc :
    # https://francetravail.io/data/documentation/comprendre-dispositif-acces-aux-api/generer-access-token
    scope = f"application_{client_id} api_offresdemploiv2 o2dsoffre"
    r = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": scope,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=15,
    )
    if r.status_code >= 400:
        _token_cache["failed"] = True
        log.error("France Travail auth %d: %s", r.status_code, r.text[:500])
        raise FranceTravailAuthError(f"{r.status_code}: {r.text[:200]}")
    payload = r.json()
    _token_cache["token"] = payload["access_token"]
    _token_cache["expires_at"] = time.time() + payload.get("expires_in", 1500)
    return _token_cache["token"]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=20))
def _search(token: str, params: dict) -> dict:
    r = requests.get(
        OFFERS_URL,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        params=params,
        timeout=20,
    )
    if r.status_code == 204:
        return {"resultats": []}
    if r.status_code == 429:
        time.sleep(3)
        r.raise_for_status()
    r.raise_for_status()
    return r.json()


def offers_for_siren(
    client_id: str,
    client_secret: str,
    siren: str,
    days_back: int = 30,
) -> list[dict]:
    """Retourne les offres d'emploi publiées par un SIREN dans les `days_back` derniers jours.

    Note : le filtre `entreprise.siret` n'existe pas dans l'API publique ;
    on filtre côté client après recherche par mots-clés sur le nom.
    Pour une recherche directe, on utilise le paramètre `entreprisesAdaptees`
    + un matching post-hoc.
    """
    token = _get_token(client_id, client_secret)
    min_date = (datetime.utcnow() - timedelta(days=days_back)).strftime("%Y-%m-%dT00:00:00Z")
    params = {
        "publieeDepuis": days_back,
        "minCreationDate": min_date,
        "range": "0-49",
    }
    # On exploite le champ `entreprise.siret` côté résultat ; pour limiter les appels,
    # on passe par une recherche libre incluant le SIREN dans `motsCles`.
    params["motsCles"] = siren
    data = _search(token, params)
    results = data.get("resultats", [])
    return [o for o in results if (o.get("entreprise") or {}).get("siret", "").startswith(siren)]


def summarize_offers(offers: list[dict], signal_keywords: list[str]) -> dict:
    if not offers:
        return {"n_offers_30d": 0, "matched_signal_keywords": [], "sample_titles": []}
    titles = [(o.get("intitule") or "").strip() for o in offers if o.get("intitule")]
    descriptions = " ".join((o.get("description") or "")[:500] for o in offers).lower()
    haystack = (" ".join(titles) + " " + descriptions).lower()
    matched = sorted({kw for kw in signal_keywords if kw.lower() in haystack})
    return {
        "n_offers_30d": len(offers),
        "matched_signal_keywords": matched,
        "sample_titles": titles[:5],
    }
