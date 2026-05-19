"""Enrichissement web : trouve le site officiel, scrape coordonnées et description.

Sources :
- DuckDuckGo HTML (gratuit, sans clé) → identifier le domaine officiel
- Site officiel : meta description, emails, téléphones FR, lien LinkedIn entreprise
"""

from __future__ import annotations

import logging
import re
import time
from urllib.parse import quote_plus, urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

log = logging.getLogger(__name__)

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
HEADERS = {"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8"}

# Domaines à exclure des résultats : ce ne sont pas des sites officiels d'entreprise
BLOCKED_DOMAINS = {
    "linkedin.com", "facebook.com", "instagram.com", "twitter.com", "x.com",
    "pappers.fr", "societe.com", "infogreffe.fr", "verif.com", "manageo.fr",
    "bilansgratuits.fr", "data.gouv.fr", "insee.fr", "kompass.com", "europages.fr",
    "pagesjaunes.fr", "118712.fr", "118000.fr", "youtube.com", "wikipedia.org",
    "indeed.com", "francetravail.fr", "pole-emploi.fr", "annuaire-entreprises.data.gouv.fr",
    "google.com", "duckduckgo.com", "bing.com", "yelp.fr", "tripadvisor.fr",
    "amazon.fr", "leboncoin.fr", "welcometothejungle.com", "glassdoor.fr",
}

EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\b")
PHONE_RE = re.compile(r"(?:(?:\+33|0033)\s?|0)[1-9](?:[\s.\-]?\d{2}){4}")
LINKEDIN_COMPANY_RE = re.compile(
    r"https?://(?:[a-z]{2,3}\.)?linkedin\.com/(?:company|school)/[A-Za-z0-9_\-%]+",
    re.IGNORECASE,
)

# Emails évidemment génériques ou techniques à ignorer
IGNORE_EMAIL_PATTERNS = (
    "noreply@", "no-reply@", "donotreply@", "wordpress@", "postmaster@",
    "@sentry.io", "@wixpress.com", "@example.com", "@domain.com",
)


def _domain(url: str) -> str:
    try:
        return urlparse(url).netloc.lower().lstrip("www.")
    except Exception:
        return ""


def _is_blocked(url: str) -> bool:
    d = _domain(url)
    return any(d == bd or d.endswith("." + bd) for bd in BLOCKED_DOMAINS)


@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=2, min=2, max=10))
def _ddg_search(query: str) -> list[str]:
    """Retourne une liste d'URLs candidates pour la requête."""
    url = "https://html.duckduckgo.com/html/"
    r = requests.post(url, headers=HEADERS, data={"q": query}, timeout=15)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    results: list[str] = []
    for a in soup.select("a.result__a"):
        href = a.get("href") or ""
        if href.startswith("//duckduckgo.com/l/"):
            # DDG wraps results in redirect links — parse the `uddg` param
            from urllib.parse import parse_qs

            qs = parse_qs(urlparse("https:" + href).query)
            real = (qs.get("uddg") or [""])[0]
            if real:
                results.append(real)
        elif href.startswith("http"):
            results.append(href)
    return results


def find_official_site(name: str, city: str, siren: str) -> str | None:
    """Cherche le site officiel d'une entreprise via DuckDuckGo.

    Stratégie : on cherche `"nom" ville` et on prend le premier résultat
    qui n'est pas un annuaire / réseau social / portail d'emploi.
    """
    query = f'"{name}" {city}'
    try:
        candidates = _ddg_search(query)
    except Exception as exc:
        log.debug("DDG search failed for %s: %s", name, exc)
        return None

    for url in candidates[:10]:
        if not _is_blocked(url):
            return url
    return None


def _extract_meta_description(soup: BeautifulSoup) -> str:
    for selector in [
        {"name": "description"},
        {"property": "og:description"},
        {"name": "twitter:description"},
    ]:
        tag = soup.find("meta", attrs=selector)
        if tag and tag.get("content"):
            return tag["content"].strip()[:500]
    # Fallback : premier paragraphe significatif
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if len(text) > 60:
            return text[:500]
    return ""


def _extract_emails(text: str, site_domain: str) -> list[str]:
    raw = set(m.group(0) for m in EMAIL_RE.finditer(text))
    out: list[str] = []
    for email in raw:
        lower = email.lower()
        if any(p in lower for p in IGNORE_EMAIL_PATTERNS):
            continue
        if lower.endswith((".png", ".jpg", ".gif", ".svg", ".webp")):
            continue
        # Préférence pour les emails du même domaine que le site
        out.append(email)
    out.sort(key=lambda e: (0 if site_domain and site_domain in e.lower() else 1, len(e)))
    return out[:3]


def _extract_phones(text: str) -> list[str]:
    raw = []
    for m in PHONE_RE.finditer(text):
        normalized = re.sub(r"[\s.\-]", " ", m.group(0)).strip()
        if normalized not in raw:
            raw.append(normalized)
    return raw[:3]


def _extract_linkedin(text: str) -> str | None:
    m = LINKEDIN_COMPANY_RE.search(text)
    if m:
        url = m.group(0)
        return url.split("?")[0].rstrip("/")
    return None


def _find_contact_link(soup: BeautifulSoup, base_url: str) -> str | None:
    keywords = ("contact", "nous-contacter", "nous-ecrire", "mentions-legales", "a-propos", "about")
    for a in soup.find_all("a", href=True):
        href = a["href"].lower()
        text = a.get_text(strip=True).lower()
        if any(k in href for k in keywords) or any(k in text for k in keywords):
            return urljoin(base_url, a["href"])
    return None


def _scan_signals(text: str, html: str, signals: dict) -> dict:
    """Scanne le texte et le HTML brut pour détecter les signaux ICP.

    `text` est le texte visible (utilisé pour la plupart des signaux).
    `html` est le HTML brut (utilisé pour SaaS heavy qui peut être dans des
    balises script/link sans texte visible).
    """
    text_lower = text.lower()
    html_lower = html.lower()
    return {
        "has_subsidiary_mention": any(
            kw in text_lower for kw in signals.get("subsidiary_keywords", [])
        ),
        "has_saas_heavy": any(
            kw in html_lower for kw in signals.get("saas_heavy_signals", [])
        ),
        "has_pro_area": any(
            kw in text_lower for kw in signals.get("pro_area_keywords", [])
        ),
        "has_manual_process": any(
            kw in text_lower for kw in signals.get("manual_process_signals", [])
        ),
    }


def fetch_site(url: str, signals: dict | None = None) -> dict | None:
    """Scrape un site : homepage + page contact si trouvée."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=12, allow_redirects=True)
        if r.status_code >= 400:
            return None
        html = r.text
    except Exception as exc:
        log.debug("fetch failed %s: %s", url, exc)
        return None

    soup = BeautifulSoup(html, "lxml")
    site_url = r.url
    site_domain = _domain(site_url)

    description = _extract_meta_description(soup)
    full_text = soup.get_text(" ", strip=True)

    # Page contact pour multiplier les chances d'avoir email/tel
    contact_url = _find_contact_link(soup, site_url)
    contact_text = ""
    contact_html = ""
    if contact_url and contact_url != site_url:
        try:
            cr = requests.get(contact_url, headers=HEADERS, timeout=10)
            if cr.status_code < 400:
                contact_html = cr.text
                contact_text = BeautifulSoup(contact_html, "lxml").get_text(" ", strip=True)
        except Exception:
            pass

    combined_text = full_text + " " + contact_text
    combined_html = html + " " + contact_html
    emails = _extract_emails(combined_text, site_domain)
    phones = _extract_phones(combined_text)
    linkedin = _extract_linkedin(combined_html)

    flags = _scan_signals(combined_text, combined_html, signals or {})

    return {
        "site_url": site_url,
        "site_domain": site_domain,
        "description": description,
        "emails": emails,
        "phones": phones,
        "linkedin_url": linkedin,
        **flags,
    }


def enrich_one(name: str, city: str, siren: str, signals: dict | None = None) -> dict:
    """Pipeline complet pour une entreprise : recherche + scrape."""
    empty = {
        "site_url": "",
        "site_domain": "",
        "description": "",
        "emails": [],
        "phones": [],
        "linkedin_url": "",
        "has_subsidiary_mention": False,
        "has_saas_heavy": False,
        "has_pro_area": False,
        "has_manual_process": False,
    }
    site = find_official_site(name, city, siren)
    if not site:
        return empty
    time.sleep(0.4)  # politesse DDG
    data = fetch_site(site, signals=signals)
    if not data:
        return {**empty, "site_url": site, "site_domain": _domain(site)}
    return data
