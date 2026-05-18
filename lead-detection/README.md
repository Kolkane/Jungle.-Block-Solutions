# Lead Detection System — Jungle.Block Solutions

Pipeline hebdomadaire qui produit **15-25 PME françaises ultra-ciblées** par semaine, prêtes à appeler à froid, avec des **idées concrètes liées à leur secteur**.

## Ce que tu reçois

Un CSV (séparateur `,`, UTF-8 BOM, importable direct dans Google Sheets / Excel) téléchargeable depuis l'onglet **Actions**, **8 colonnes** focalisées cold call :

| Colonne | Description |
|---|---|
| `score` | Score déterministe /100 (calculé en Python selon les règles ICP, pas par l'IA) |
| `entreprise` | Nom commercial / raison sociale |
| `secteur` | `[Activité] · ~[effectif] salariés · [ville]` |
| `ville` | Pour personnaliser l'accroche |
| `telephone` | Numéro(s) scrapé(s) sur le site |
| `site_web` | À ouvrir 30s avant l'appel pour briefing rapide |
| `idees` | 2-3 puces très spécifiques au métier : `• [action] → [bénéfice mesurable]` |
| `email` | Backup si pas de tel ou pour relance |

## ICP appliqué (cf. `config/icp.yaml`)

- **Effectif** : 35-150 salariés (sweet spot 50-100)
- **Géo** : France métropolitaine (DOM-TOM exclus)
- **Ancienneté** : > 2 ans, entreprise active

### NAF ciblés en 3 tiers

**Tier 1** (bonus score +15) — cibles prioritaires :
- 46.xx Commerce de gros, 28.xx Machines, 25.xx Métaux, 29.xx Automobile
- 52.xx Entreposage/transport auxiliaire, 49.41 Transport routier
- 69.20Z Expertise comptable

**Tier 2** (bonus +8) :
- 21.xx Pharma, 71.12B Ingénierie, 70.22Z Conseil
- 46.73/46.74 Négoces, 47.74Z Appareils médicaux

**Tier 3** (gardé seulement si score ≥ 53) :
- 68.31Z Agences immo, 78.xx Travail temporaire, 45.11Z/19Z Véhicules

**NAF exclus** : BTP (41-43), juridique (69.10Z), santé (86-88), enseignement (85), HoReCa (55-56), finance/assurance (64-66), SSII (62-63), admin/asso (84, 94, 96…).

## Logique de scoring

100% déterministe en Python (`src/pipeline/prescore.py`) :

```
base 40
+15 si NAF tier 1            -5 si pas de site web
+8  si NAF tier 2            -8 si DOM-TOM (déjà filtré en amont)
+5  si "espace pro" / "contact commercial" sur le site
+5  si effectif 50-100 (sweet spot)
+3  si téléphone trouvé
+3  si email commercial trouvé (commercial@, sales@, contact@…)

Seuil acceptation : score >= 45 (tier 1/2) ou >= 53 (tier 3)
```

L'IA Claude n'évalue plus — elle ne fait que générer le texte (`secteur` + `idees`) pour les leads qui ont passé le filtre. Économie de tokens.

## Quick start (local)

```bash
cd lead-detection
cp .env.example .env  # renseigne INSEE_API_KEY et ANTHROPIC_API_KEY
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m src.main
```

## Clés API requises

| Variable | Comment l'obtenir | Coût |
|---|---|---|
| `INSEE_API_KEY` | https://portail-api.insee.fr → app Sirene V3.11 | Gratuit, 30 req/min |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | ~0,30 € / run (peu de tokens) |

## Exécution automatique

Workflow `.github/workflows/weekly-leads.yml` — cron **tous les lundis 06h UTC**.

Secrets GitHub à configurer (Settings → Secrets and variables → Actions) :
- `INSEE_API_KEY`
- `ANTHROPIC_API_KEY`

Test manuel : onglet **Actions** → "Weekly leads detection" → **Run workflow**.

## Récupérer le CSV

1. Onglet **Actions** → dernier run "Weekly leads detection"
2. Bas de page → section **Artifacts** → clic sur `leads-<run_id>` → `.zip`
3. Décompresse → `leads-YYYY-MM-DD.csv`

## Importer dans Google Sheets

1. **Fichier → Importer → Insérer un fichier** → upload le CSV
2. Séparateur : **Détecter automatiquement**
3. **Importer les données**

Pense à **élargir la colonne `idees`** et activer le retour à la ligne (Format → Habillage).

## Structure

```
lead-detection/
├── src/
│   ├── sources/
│   │   ├── sirene.py           # INSEE Sirene + filtres en amont (tier NAF, DOM-TOM, effectif)
│   │   └── web_enrich.py       # DuckDuckGo + scrape site (email, tel, description)
│   ├── pipeline/
│   │   ├── collect.py          # appel Sirene
│   │   ├── enrich.py           # web scraping
│   │   ├── prescore.py         # scoring déterministe + filtre acceptation
│   │   ├── score.py            # génération copy Claude (secteur + idees)
│   │   └── deliver.py          # écriture CSV
│   ├── prompts/scoring.md      # brief Claude pour génération du copy
│   └── main.py
├── config/icp.yaml             # règles ICP, NAF tiers, scoring
├── data/                       # outputs (gitignored)
└── .github/workflows/weekly-leads.yml
```
