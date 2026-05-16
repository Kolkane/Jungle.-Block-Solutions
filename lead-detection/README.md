# Lead Detection System — Jungle.Block Solutions

Pipeline hebdomadaire qui produit une liste de **100 PME françaises à fort potentiel** pour les services Jungle.Block Solutions (audit stratégique, IA sur-mesure, automatisation, produit digital).

## Architecture

```
┌────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Sirene API    │     │              │     │   Claude     │     │   CSV +      │
│  (INSEE)       │ ──▶ │  Collecte +  │ ──▶ │   scoring    │ ──▶ │   email      │
├────────────────┤     │  enrichis-   │     │   (fit ICP)  │     │              │
│  France        │     │  sement      │     │              │     │              │
│  Travail API   │ ──▶ │              │     │              │     │              │
└────────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Collecte** : tirage d'un échantillon de ~2 000 PME depuis Sirene (filtres : entreprise active, effectif 10-500, ancienneté > 2 ans, pas de NAF "SSII").
2. **Enrichissement** : pour chaque entreprise, recherche d'offres d'emploi récentes (< 30 j) sur France Travail → signal d'achat.
3. **Scoring IA** : Claude évalue chaque lead sur 5 axes (fit secteur, taille, signaux d'achat, accessibilité, géographie) → score /100 + raison + accroche.
4. **Livraison** : top 100 → CSV horodaté → envoi par email.

## ICP (Ideal Customer Profile)

| Critère | Valeur |
|---|---|
| Pays | France entière (bonus Île-de-France et Nouvelle-Aquitaine) |
| Effectif | 10-500 salariés (sweet spot 20-250) |
| Ancienneté | > 2 ans, active |
| Secteurs | Tous, sauf SSII / éditeurs logiciels (concurrents directs) |
| Signaux d'achat | Offre d'emploi récente mentionnant : IA, automatisation, data, digital, transformation, ops, growth |

Le scoring IA fait le tri final — pas de filtre sectoriel rigide.

## Quick start

```bash
cd lead-detection
cp .env.example .env  # renseigne les clés API
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m src.main
```

## Clés API requises

| Variable | Comment l'obtenir | Coût |
|---|---|---|
| `INSEE_API_KEY` | https://api.insee.fr (inscription gratuite, créer une app Sirene V3) | Gratuit, 30 req/min |
| `FRANCE_TRAVAIL_CLIENT_ID` / `_SECRET` | https://francetravail.io (inscription, API "Offres d'emploi v2") | Gratuit |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | ~$1-3 / run hebdo (2k leads scorés) |
| `SMTP_USER` / `SMTP_PASS` | App password Gmail (compte Google → sécurité → mots de passe d'application) | Gratuit |
| `RECIPIENT_EMAIL` | Email où recevoir le CSV | — |

## Exécution automatique

Le workflow GitHub Actions `.github/workflows/weekly-leads.yml` exécute le pipeline tous les **lundis à 6h UTC** et envoie le CSV par email.

Secrets GitHub à configurer (Settings → Secrets → Actions) :
- `INSEE_API_KEY`
- `FRANCE_TRAVAIL_CLIENT_ID`
- `FRANCE_TRAVAIL_SECRET`
- `ANTHROPIC_API_KEY`
- `SMTP_USER`
- `SMTP_PASS`
- `RECIPIENT_EMAIL`

## Configuration

`config/icp.yaml` — pondérations de scoring, secteurs exclus, géographies bonus. Édite ce fichier pour ajuster le ciblage sans toucher au code.

## Structure

```
lead-detection/
├── src/
│   ├── sources/        # collecteurs externes
│   │   ├── sirene.py
│   │   └── france_travail.py
│   ├── pipeline/       # orchestration
│   │   ├── collect.py
│   │   ├── enrich.py
│   │   ├── score.py
│   │   └── deliver.py
│   ├── prompts/
│   │   └── scoring.md  # prompt Claude
│   └── main.py
├── config/
│   └── icp.yaml
├── data/               # outputs (gitignored)
└── .github/workflows/weekly-leads.yml
```
