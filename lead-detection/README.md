# Lead Detection System — Jungle.Block Solutions

Pipeline hebdomadaire qui produit chaque **lundi matin un fichier de 100 PME françaises** prêtes à contacter, avec coordonnées, description d'activité et angle d'attaque personnalisé.

## Ce que tu reçois

Un CSV (séparateur `;`, UTF-8 BOM, ouvrable directement dans Excel/Numbers/Sheets), envoyé par email, contenant pour chaque lead :

| Colonne | Description |
|---|---|
| `score` | Score IA /100 (probabilité de devenir client à 6 mois) |
| `nom` | Nom commercial / raison sociale |
| `activite` | Code NAF |
| `description` | Description courte rédigée par l'IA à partir du site et du NAF |
| `effectif_estime` | Effectif estimé (milieu de tranche INSEE) |
| `adresse` / `code_postal` / `ville` / `departement` | Adresse postale du siège |
| `telephone` | Téléphone(s) scrapé(s) sur le site officiel |
| `email` | Email(s) scrapé(s) (priorité au domaine de l'entreprise) |
| `site_web` | URL du site officiel |
| `linkedin_entreprise` | Page LinkedIn entreprise (si trouvée) |
| `linkedin_recherche_decideur` | Lien LinkedIn pré-rempli pour identifier le décideur |
| `angle_attaque` | Message d'approche personnalisé (2 phrases max) prêt à adapter |
| `raison_score` | Pourquoi l'IA a donné ce score |
| `signaux_recrutement` | Mots-clés détectés dans les offres d'emploi récentes |
| `offres_emploi_30j` | Nombre d'annonces publiées les 30 derniers jours |
| `siren` / `siret` / `date_creation` | Identifiants légaux |

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
                          CSV trié top 100 → email
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
| `SMTP_USER` / `SMTP_PASS` | Gmail → compte → sécurité → "Mots de passe d'application" | Gratuit |
| `RECIPIENT_EMAIL` | Email destinataire du CSV | — |

## Exécution automatique

Workflow GitHub Actions `.github/workflows/weekly-leads.yml` — cron **tous les lundis à 06h UTC** (08h Paris été / 07h hiver).

Secrets à configurer dans GitHub → Settings → Secrets and variables → Actions :
- `INSEE_API_KEY`
- `FRANCE_TRAVAIL_CLIENT_ID`
- `FRANCE_TRAVAIL_SECRET`
- `ANTHROPIC_API_KEY`
- `SMTP_USER`
- `SMTP_PASS`
- `RECIPIENT_EMAIL`

Test manuel : onglet **Actions** → "Weekly leads detection" → **Run workflow**.

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
│   │   └── deliver.py          # CSV + email
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
