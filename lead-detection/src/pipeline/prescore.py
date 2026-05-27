"""Scoring déterministe + filtres durs selon les règles ICP."""

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


def _is_commercial_email(emails: list[str], prefixes: list[str]) -> bool:
    prefixes_lower = [p.lower() for p in prefixes]
    for email in emails or []:
        local = email.split("@", 1)[0].lower()
        if any(local.startswith(p) for p in prefixes_lower):
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

    if web.get("has_pro_area"):
        score += rules.get("bonus_pro_area", 5)
        breakdown["pro_area"] = rules.get("bonus_pro_area", 5)

    if web.get("has_manual_process"):
        score += rules.get("bonus_manual_signals", 5)
        breakdown["manual_signals"] = rules.get("bonus_manual_signals", 5)

    if web.get("has_saas_heavy"):
        score += rules.get("malus_saas_heavy", -10)
        breakdown["saas_heavy"] = rules.get("malus_saas_heavy", -10)

    if web.get("has_subsidiary_mention"):
        score += rules.get("malus_subsidiary", -8)
        breakdown["subsidiary"] = rules.get("malus_subsidiary", -8)

    if web.get("phones"):
        score += rules.get("bonus_phone", 3)
        breakdown["phone"] = rules.get("bonus_phone", 3)

    if _is_commercial_email(web.get("emails") or [], web_signals.get("commercial_email_prefixes", [])):
        score += rules.get("bonus_commercial_email", 3)
        breakdown["commercial_email"] = rules.get("bonus_commercial_email", 3)

    eff = row.get("effectif_estime", 0)
    if 50 <= eff <= 120:
        score += rules.get("bonus_effectif_sweet_spot", 5)
        breakdown["sweet_spot"] = rules.get("bonus_effectif_sweet_spot", 5)

    if row.get("department") in (config.get("dom_tom_departments") or []):
        score += rules.get("malus_dom_tom", -8)
        breakdown["dom_tom"] = rules.get("malus_dom_tom", -8)

    dept = row.get("department", "")
    for geo_name, geo_info in (config.get("geo_bonus") or {}).items():
        if dept in geo_info.get("departments", []):
            bonus = geo_info.get("bonus", 0)
            score += bonus
            breakdown[f"geo_{geo_name}"] = bonus
            break

    score = max(0, min(score, 100))
    breakdown["__total__"] = score
    breakdown["__tier__"] = tier_name
    return score, breakdown


def filter_acceptable(rows: list[dict], config: dict) -> tuple[list[dict], dict]:
    """Applique le scoring + filtres durs (filiale, score min).

    Retourne (kept, stats) où stats compte les rejets par raison.
    """
    min_score = int(config.get("output", {}).get("min_score", 50))
    tiers = config.get("naf_tiers", {})
    hard_web = config.get("hard_web_filters", {})
    exclude_subsidiary = bool(hard_web.get("exclude_if_subsidiary", False))

    kept: list[dict] = []
    stats = {
        "total": len(rows),
        "kept": 0,
        "rejected_subsidiary": 0,
        "rejected_low_score": 0,
        "rejected_tier_floor": 0,
    }

    for row in rows:
        web = row.get("web") or {}
        if exclude_subsidiary and web.get("has_subsidiary_mention"):
            stats["rejected_subsidiary"] += 1
            continue

        score, breakdown = compute_score(row, config)
        row["score"] = score
        row["score_breakdown"] = breakdown
        tier = breakdown.get("__tier__", "")
        tier_floor = int((tiers.get(tier) or {}).get("min_score", 0))
        threshold = max(min_score, tier_floor)
        if score < threshold:
            if score < min_score:
                stats["rejected_low_score"] += 1
            else:
                stats["rejected_tier_floor"] += 1
            continue
        kept.append(row)

    kept.sort(key=lambda r: r["score"], reverse=True)
    stats["kept"] = len(kept)
    kept_by_tier: dict[str, int] = {}
    for r in kept:
        t = (r.get("score_breakdown") or {}).get("__tier__", "")
        kept_by_tier[t or "_none"] = kept_by_tier.get(t or "_none", 0) + 1
    log.info(
        "Scoring: kept %d/%d (min_score=%d). Rejected: %d subsidiary, %d low_score, %d tier_floor. Kept by tier: %s",
        len(kept), len(rows), min_score,
        stats["rejected_subsidiary"], stats["rejected_low_score"], stats["rejected_tier_floor"],
        kept_by_tier,
    )
    return kept, stats
