"""Scoring déterministe selon les règles ICP.

Le score est 100% calculé en Python — Claude ne note plus, il ne fait
que générer le copy (secteur + idées).

Règles :
  base 40
  + tier_1: +15 | tier_2: +8 | tier_3: 0
  + bonus_pro_area: +5 (espace pro ou contact commercial sur le site)
  + bonus_effectif_sweet_spot: +5 (50-100 salariés)
  + bonus_phone: +3
  + bonus_commercial_email: +3
  - malus_no_site: -5
  - malus_dom_tom: -8 (filtré en amont en principe)
  - malus_effectif_hors_plage: -5 (filtré en amont en principe)

Acceptation :
  - tier_1/2 : score >= min_score (45)
  - tier_3 : score >= max(min_score, tier_3.min_score=53)
"""

from __future__ import annotations

import logging

log = logging.getLogger(__name__)


def _tier_of(naf_code: str, tiers: dict) -> tuple[str, int, int]:
    """Retourne (nom_tier, bonus, seuil_acceptation_specifique)."""
    for tier_name, info in tiers.items():
        for code in info.get("naf_codes", []):
            if naf_code.startswith(code):
                return tier_name, info.get("bonus", 0), info.get("min_score", 0)
    return "", 0, 0


def _detect_pro_area(web: dict, signals: dict) -> bool:
    description = (web.get("description") or "").lower()
    keywords = [k.lower() for k in signals.get("pro_area_keywords", [])]
    return any(k in description for k in keywords)


def _detect_commercial_email(emails: list[str], signals: dict) -> bool:
    prefixes = [p.lower() for p in signals.get("commercial_email_prefixes", [])]
    for email in emails or []:
        local = email.split("@", 1)[0].lower()
        if any(local.startswith(p) for p in prefixes):
            return True
    return False


def compute_score(row: dict, config: dict) -> tuple[int, dict]:
    """Calcule le score final + retourne le détail pour log/debug."""
    rules = config.get("scoring", {})
    tiers = config.get("naf_tiers", {})
    web_signals = config.get("web_signals", {})

    score = rules.get("base", 40)
    breakdown: dict = {"base": score}

    tier_name, tier_bonus, _ = _tier_of(row.get("naf_code", ""), tiers)
    if tier_bonus:
        score += tier_bonus
        breakdown[tier_name] = tier_bonus

    web = row.get("web") or {}
    if not web.get("site_url"):
        score += rules.get("malus_no_site", -5)
        breakdown["no_site"] = rules.get("malus_no_site", -5)

    if _detect_pro_area(web, web_signals):
        score += rules.get("bonus_pro_area", 5)
        breakdown["pro_area"] = rules.get("bonus_pro_area", 5)

    if web.get("phones"):
        score += rules.get("bonus_phone", 3)
        breakdown["phone"] = rules.get("bonus_phone", 3)

    if _detect_commercial_email(web.get("emails") or [], web_signals):
        score += rules.get("bonus_commercial_email", 3)
        breakdown["commercial_email"] = rules.get("bonus_commercial_email", 3)

    eff = row.get("effectif_estime", 0)
    if 50 <= eff <= 100:
        score += rules.get("bonus_effectif_sweet_spot", 5)
        breakdown["sweet_spot"] = rules.get("bonus_effectif_sweet_spot", 5)
    hf = config.get("hard_filters", {})
    if eff and (eff < hf.get("effectif_min", 0) or eff > hf.get("effectif_max", 999)):
        score += rules.get("malus_effectif_hors_plage", -5)
        breakdown["effectif_hors_plage"] = rules.get("malus_effectif_hors_plage", -5)

    if row.get("department") in (config.get("dom_tom_departments") or []):
        score += rules.get("malus_dom_tom", -8)
        breakdown["dom_tom"] = rules.get("malus_dom_tom", -8)

    score = max(0, min(score, 100))
    breakdown["__total__"] = score
    breakdown["__tier__"] = tier_name
    return score, breakdown


def filter_acceptable(rows: list[dict], config: dict) -> tuple[list[dict], dict]:
    """Filtre les leads acceptables selon les seuils ICP.

    Retourne (kept, stats) où stats compte les rejets par raison.
    """
    min_score = int(config.get("output", {}).get("min_score", 45))
    tiers = config.get("naf_tiers", {})
    tier_3_min = int((tiers.get("tier_3") or {}).get("min_score", min_score))

    kept: list[dict] = []
    stats = {"total": len(rows), "kept": 0, "rejected_low_score": 0, "rejected_tier3_floor": 0}

    for row in rows:
        score, breakdown = compute_score(row, config)
        row["score"] = score
        row["score_breakdown"] = breakdown
        tier = breakdown.get("__tier__", "")
        if tier == "tier_3":
            threshold = max(min_score, tier_3_min)
            if score < threshold:
                stats["rejected_tier3_floor"] += 1
                continue
        elif score < min_score:
            stats["rejected_low_score"] += 1
            continue
        kept.append(row)

    kept.sort(key=lambda r: r["score"], reverse=True)
    stats["kept"] = len(kept)
    log.info(
        "Scoring: kept %d/%d (min_score=%d, tier_3_floor=%d). Rejected: %d low_score, %d tier3_floor",
        len(kept), len(rows), min_score, tier_3_min,
        stats["rejected_low_score"], stats["rejected_tier3_floor"],
    )
    return kept, stats
