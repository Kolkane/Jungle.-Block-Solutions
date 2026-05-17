# Lead Detection System — Jungle.Block Solutions

Pipeline hebdomadaire qui produit chaque **lundi matin un fichier de 100 PME françaises** prêtes à appeler à froid, avec un **script d'appel personnalisé** prêt à lire à l'oral.

## Ce que tu reçois

Un CSV (séparateur `,`, UTF-8 BOM, importable directement dans Google Sheets / Excel / Numbers), disponible en téléchargement dans l'onglet **Actions** du repo, **8 colonnes** focalisées cold call :

| Colonne | Description |
|---|---|
| `score` | Score IA /100 (probabilité de devenir client à 6 mois) |
| `entreprise` | Nom commercial / raison sociale |
| `secteur` | Description claire en 1 phrase de ce que fait l'entreprise (pas le code NAF) |
| `ville` | Pour personnaliser l'accroche |
| `telephone` | Numéro(s) scrapé(s) sur le site — c'est ce que tu composes |
| `site_web` | À ouvrir 30s avant l'appel pour briefing rapide |
| `script_appel` | Script complet en 4 blocs : accroche / pitch / 2 idées concrètes / closing — prêt à lire |
| `email` | Backup si pas de tel ou pour relance après l'appel |

## Architecture

Pipeline en 2 passes pour économiser les coûts (on n'enrichit/score finement que les meilleurs candidats) :

```
┌─────────────────────────────────────────────────────────────────────────┐
│  PASSE LARGE (~2000 entreprises)                                        │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Sirene API (INSEE)        → ~2000 PME (filtres ICP, échantillon)   │
│  2. France Travail API        → offres d'emploi 30j sur chaque         │
│  3. Pré-scoring heuristique   → garder top 200 (sans appel LLM)         │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  PASSE FINE (~200 entreprises)                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  4. DuckDuckGo search         → identifier le site officiel             │
│  5. Scrape homepage + contact → description, emails, tél, LinkedIn      │
│  6. Claude Sonnet 4.6         → score + description + raison + hook     │
└─────────────────────────────────────────────────────────────────────────┘
                                  ↓
                          CSV trié top 100 → artifact GitHub Actions
```

Temps d'exécution typique : **30-45 min** sur GitHub Actions.

## ICP appliqué

Défini dans `config/icp.yaml`, éditable sans toucher au code :

- **Effectif** : 10-500 salariés (sweet spot 20-250)
- **Ancienneté** : > 2 ans, entreprise active
- **NAF exclus** : SSII / éditeurs logiciels / administration / enseignement / asso
- **Géo bonus** : Île-de-France, Nouvelle-Aquitaine
- **Signaux d'achat** : offres d'emploi mentionnant IA, automation, data, digital, transformation, ops, growth, no-code…

Le scoring final Claude pondère ces axes (cf. `src/prompts/scoring.md`).

## Quick start (local)

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
| `INSEE_API_KEY` | https://api.insee.fr → créer une app Sirene V3.11 | Gratuit, 30 req/min |
| `FRANCE_TRAVAIL_CLIENT_ID` / `_SECRET` | https://francetravail.io → API "Offres d'emploi v2", scopes `api_offresdemploiv2 o2dsoffre` | Gratuit |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com | ~$0.50-1.50 / run hebdo |

## Exécution automatique

Workflow GitHub Actions `.github/workflows/weekly-leads.yml` — cron **tous les lundis à 06h UTC** (08h Paris été / 07h hiver).

Secrets à configurer dans GitHub → Settings → Secrets and variables → Actions :
- `INSEE_API_KEY`
- `FRANCE_TRAVAIL_CLIENT_ID`
- `FRANCE_TRAVAIL_SECRET`
- `ANTHROPIC_API_KEY`

Test manuel : onglet **Actions** → "Weekly leads detection" → **Run workflow**.

## Récupérer le CSV

Le CSV est uploadé comme **artifact GitHub Actions** à chaque run (rétention 90 jours).

1. Va sur l'onglet **Actions** du repo
2. Clic sur le dernier run "Weekly leads detection" (le plus récent en haut)
3. En bas de la page, section **Artifacts** → clic sur `leads-<run_id>` → téléchargement d'un `.zip`
4. Décompresse → tu obtiens `leads-YYYY-MM-DD.csv`

## Importer dans Google Sheets

1. Ouvre une nouvelle Google Sheet
2. **Fichier → Importer → Insérer un fichier** → upload le `leads-YYYY-MM-DD.csv`
3. Type de séparateur : **Détecter automatiquement** (le CSV utilise la virgule)
4. **Importer les données**

Les colonnes s'auto-formatent : score numérique trié, hyperliens cliquables pour `site_web` / `linkedin_*`, etc.

## Structure

```
lead-detection/
├── src/
│   ├── sources/
│   │   ├── sirene.py           # collecteur INSEE Sirene
│   │   ├── france_travail.py   # offres d'emploi
│   │   └── web_enrich.py       # recherche site officiel + scraping
│   ├── pipeline/
│   │   ├── collect.py          # appel Sirene
│   │   ├── enrich.py           # France Travail + web
│   │   ├── prescore.py         # filtre heuristique sans LLM
│   │   ├── score.py            # scoring Claude final
│   │   └── deliver.py          # écriture CSV
│   ├── prompts/scoring.md      # brief Claude
│   └── main.py
├── config/icp.yaml             # règles ICP, pondérations, géo bonus
├── data/                       # outputs (gitignored)
└── .github/workflows/weekly-leads.yml
```

## Limites V1 (assumées)

- **Scraping web** : DuckDuckGo HTML peut être rate-limité ou bloquer certains résultats. ~70-80% des sites sont identifiés. Pour le reste, le lead arrive sans site/téléphone mais avec adresse + LinkedIn search.
- **Pas de Pappers** : pour gagner dirigeants nominatifs, comptes annuels et téléphones plus fiables, intégration possible en V2 si abonnement Pappers (19€/mois pour 1000 fiches).
- **Pas de scraping LinkedIn direct** : on fournit un lien de recherche pré-rempli pour identifier le décideur manuellement (ou via Sales Navigator). Scraping LinkedIn = risque ToS.
- **Échantillonnage Sirene aléatoire** : l'API limite à 10k résultats par requête, on tire 2k au hasard dans cette fenêtre pour varier les leads d'une semaine à l'autre.
