# Brief — Détection de leads pour agent IA de recouvrement d'impayés

> **À transmettre à une nouvelle conversation Claude (ou Claude Code)** pour cloner et adapter le pipeline de détection de leads d'un projet existant (`Jungle.Block Solutions`) à un nouveau cas d'usage : agent IA spécialisé dans le recouvrement amiable et la relance d'impayés B2B.

---

## 0. Mode d'emploi de ce brief

Ce document décrit :
1. **Le système source** qui fonctionne déjà sur un autre repo (architecture, choix techniques, pièges connus)
2. **Le nouveau cas d'usage** et l'ICP cible (recouvrement d'impayés)
3. **Le plan de portage** étape par étape

Le but : permettre à un agent IA de **recréer un repo similaire from scratch** sans avoir accès au code source initial. Tout ce qui suit est suffisant pour reconstruire le pipeline.

Si tu as besoin du code source de référence : `https://github.com/Kolkane/Jungle.-Block-Solutions` → dossier `lead-detection/`.

---

## 1. Vue d'ensemble du système

### 1.1 Ce que produit le pipeline

Chaque lundi matin, un CSV de **15-25 PME françaises** ultra-qualifiées, importable direct dans Google Sheets, avec **8 colonnes** orientées cold call :

| Colonne | Contenu |
|---|---|
| `score` | Score déterministe /100 calculé en Python (pas par l'IA) |
| `entreprise` | Nom commercial / raison sociale |
| `secteur` | `[Activité] · ~[effectif] salariés · [ville]` |
| `ville` | Pour personnaliser l'accroche |
| `telephone` | Numéros scrapés sur le site officiel |
| `site_web` | À ouvrir avant l'appel |
| `idees` | 2-3 puces très spécifiques : `• [action métier] → [bénéfice chiffré]` |
| `email` | Backup si pas de tel |

### 1.2 Pipeline en 5 étapes

```
┌────────────────────────────────────────────────────────────────┐
│  1. COLLECT — INSEE Sirene API                                 │
│     Query minimale (sièges actifs créés avant N-2)             │
│     Filtres en Python : état actif, tranche effectif, NAF,    │
│     DOM-TOM exclus, tier NAF cible                            │
│  → ~250 entreprises retenues sur ~3000 tirées                  │
└────────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────────┐
│  2. WEB ENRICH — DuckDuckGo + scraping du site officiel        │
│     Trouve : site, emails, téléphones, description meta,       │
│     LinkedIn entreprise, FLAGS de signaux ICP (filiale,        │
│     SaaS lourd installé, espace pro, vocab process manuels)    │
│  → ~250 dicts enrichis (étape la plus lente : 15-20 min)       │
└────────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────────┐
│  3. SCORING DÉTERMINISTE — 100% Python                         │
│     base 40 + bonus NAF tier + bonus signaux web favorables    │
│     - malus si site absent, SaaS lourd, DOM-TOM                │
│     Exclusion immédiate si filiale de groupe détectée          │
│  → Filtre score >= min_score (50)                              │
└────────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────────┐
│  4. CLAUDE COPY — génère `secteur` + `idees`                   │
│     Uniquement pour les leads qui ont passé le filtre.         │
│     Pas de scoring par l'IA. Économie de tokens massive.       │
│  → ~20 leads avec copy prête                                   │
└────────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────────┐
│  5. CSV — 8 colonnes triées par score décroissant              │
│     UTF-8 BOM, séparateur virgule → import direct Sheets       │
│  → Artifact GitHub Actions (rétention 90j)                     │
└────────────────────────────────────────────────────────────────┘
```

### 1.3 Stack technique

- **Python 3.11**
- **INSEE Sirene API v3.11** (gratuit, 30 req/min, clé via portail-api.insee.fr)
- **Anthropic Claude** (modèle Sonnet récent — le code utilise un identifiant explicite)
- **DuckDuckGo HTML** pour trouver les sites officiels (gratuit, sans clé)
- **BeautifulSoup + lxml** pour le scraping
- **GitHub Actions** pour l'exécution hebdomadaire + artifact CSV
- Pas de DB. Tout en mémoire + JSON intermédiaires pour debug.

### 1.4 Coût

- INSEE Sirene : gratuit
- Anthropic : ~0,30 € par run (très peu de tokens, ~20 leads × ~1k tokens)
- GitHub Actions : gratuit (sous les quotas Hobby)
- Total : **< 1,5 € / mois** pour 4 runs hebdo

---

## 2. Architecture des fichiers (à recréer dans le nouveau repo)

Structure exacte à reproduire dans le nouveau repo (sous-dossier ou à la racine selon préférence) :

```
lead-detection/
├── README.md
├── requirements.txt
├── .env.example
├── config/
│   └── icp.yaml                  # ⭐ tous les paramètres métier
├── src/
│   ├── __init__.py
│   ├── main.py                   # orchestrateur
│   ├── sources/
│   │   ├── __init__.py
│   │   ├── sirene.py             # client INSEE + filtres en amont
│   │   └── web_enrich.py         # DDG + scrape + détection signaux
│   ├── pipeline/
│   │   ├── __init__.py
│   │   ├── collect.py            # wrapper sirene
│   │   ├── enrich.py             # wrapper web_enrich (boucle)
│   │   ├── prescore.py           # scoring déterministe + filtres
│   │   ├── score.py              # génération copy Claude
│   │   └── deliver.py            # écriture CSV
│   └── prompts/
│       └── scoring.md            # ⭐ brief Claude pour le copy
├── data/                         # outputs JSON + CSV (gitignored)
└── .github/workflows/
    └── weekly-leads.yml
```

### 2.1 `requirements.txt`

```
anthropic>=0.40
beautifulsoup4>=4.12
lxml>=5.0
python-dotenv>=1.0
pyyaml>=6.0
requests>=2.32
tenacity>=8.5
```

### 2.2 `.env.example`

```
INSEE_API_KEY=
ANTHROPIC_API_KEY=

SAMPLE_SIZE=2000
TOP_N=25
```

### 2.3 `.github/workflows/weekly-leads.yml`

```yaml
name: Weekly leads detection

on:
  schedule:
    - cron: "0 6 * * 1"  # lundis 06h UTC
  workflow_dispatch:

jobs:
  run-pipeline:
    runs-on: ubuntu-latest
    timeout-minutes: 90
    defaults:
      run:
        working-directory: lead-detection
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip
          cache-dependency-path: lead-detection/requirements.txt
      - run: pip install -r requirements.txt
      - name: Run pipeline
        env:
          INSEE_API_KEY: ${{ secrets.INSEE_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SAMPLE_SIZE: "2000"
          TOP_N: "25"
        run: python -m src.main
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: leads-${{ github.run_id }}
          path: lead-detection/data/*.csv
          retention-days: 90
```

---

## 3. Pièges techniques connus (à reproduire dans la nouvelle implémentation)

### 3.1 Sirene v3.11 — la query DOIT être minimale

L'API rejette en 400 ("Erreur de syntaxe") toute combinaison non triviale :
- range sur strings : `trancheEffectifsEtablissement:[11 TO 32]` → 400
- wildcard avec négation : `-periode(activitePrincipaleEtablissement:62*)` → 400
- wildcard dans une range : `dateCreationEtablissement:[* TO 2024-12-31]` → 400
- OR à l'intérieur de `periode(...)` → 400

**La SEULE query qui passe de manière fiable** :

```python
q = (
    "etablissementSiege:true"
    " AND dateCreationEtablissement:[1900-01-01 TO {cutoff_year}-12-31]"
)
```

Tous les autres filtres (état actif, tranche d'effectif, NAF, DOM-TOM, tier cible) sont appliqués **côté Python** sur les résultats.

Header HTTP requis : `X-INSEE-Api-Key-Integration: <key>`.

Endpoint : `https://api.insee.fr/api-sirene/3.11/siret`.

Échantillonnage : tirer des pages à des **offsets aléatoires** dans la fenêtre `[0, min(total, 10_000)]`. Ne pas tirer toujours en haut.

Respecter 30 req/min : `time.sleep(2.1)` entre pages.

### 3.2 DuckDuckGo HTML pour trouver les sites

Endpoint : `POST https://html.duckduckgo.com/html/` avec `data={"q": query}`. Pas de clé.

Les liens DDG sont wrappés en `//duckduckgo.com/l/?uddg=<url_encodée>` → parser le paramètre `uddg`.

Liste de domaines à bannir (annuaires, RS, portails emploi) — sinon on récupère leur fiche Pappers/Societe.com au lieu du vrai site :

```python
BLOCKED_DOMAINS = {
    "linkedin.com", "facebook.com", "instagram.com", "twitter.com", "x.com",
    "pappers.fr", "societe.com", "infogreffe.fr", "verif.com", "manageo.fr",
    "bilansgratuits.fr", "data.gouv.fr", "insee.fr", "kompass.com",
    "europages.fr", "pagesjaunes.fr", "118712.fr", "118000.fr",
    "youtube.com", "wikipedia.org", "indeed.com", "francetravail.fr",
    "pole-emploi.fr", "annuaire-entreprises.data.gouv.fr", "google.com",
    "duckduckgo.com", "bing.com", "yelp.fr", "tripadvisor.fr",
    "amazon.fr", "leboncoin.fr", "welcometothejungle.com", "glassdoor.fr",
}
```

User-Agent crédible (sinon DDG bloque) : `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"`.

### 3.3 Scraping du site

- Suivre les redirects (`allow_redirects=True`)
- Timeout 12s
- Récupérer la **homepage** ET une **page contact** si on en trouve une (mots-clés : `contact`, `nous-contacter`, `mentions-legales`, `a-propos`, `about`)
- Extraire :
  - **Meta description** (`<meta name="description">`, `og:description`, `twitter:description`, fallback premier `<p>` significatif)
  - **Emails** : regex `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+\b`, ignorer les génériques (`noreply@`, `wordpress@`, `@wixpress.com`, `@example.com`…), préférer ceux du domaine du site
  - **Téléphones FR** : regex `(?:(?:\+33|0033)\s?|0)[1-9](?:[\s.\-]?\d{2}){4}`
  - **LinkedIn entreprise** : regex `https?://(?:[a-z]{2,3}\.)?linkedin\.com/(?:company|school)/[A-Za-z0-9_\-%]+`

### 3.4 Anthropic — utiliser le prompt caching

```python
from anthropic import Anthropic
client = Anthropic(api_key=...)
resp = client.messages.create(
    model="claude-sonnet-4-6",  # ou plus récent au moment de l'écriture
    max_tokens=4000,
    system=[
        {
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"},  # ← cache 5 min
        }
    ],
    messages=[{"role": "user", "content": user_msg_with_batch}],
)
```

Batch les entreprises par 10 dans le même appel pour mutualiser tokens d'entrée.

Le prompt demande un JSON array strict (1 objet par entreprise, dans l'ordre). Parser avec extraction de bloc `\`\`\`json` si Claude wrappe la réponse.

### 3.5 CSV pour Google Sheets

```python
csv.DictWriter(f, fieldnames=..., delimiter=",", quoting=csv.QUOTE_MINIMAL)
# Encoding: "utf-8-sig" (BOM pour la rétro-compat Excel FR)
```

Séparateur **virgule** (Google Sheets l'auto-détecte). Les retours de ligne dans `idees` sont gérés naturellement par `QUOTE_MINIMAL`.

### 3.6 Mode de livraison

Pas d'email, pas de page web. Le CSV est uploadé en **artifact GitHub Actions** (rétention 90 jours). L'utilisateur va le télécharger manuellement dans l'onglet Actions du repo.

Rationale : zéro infra à maintenir, zéro secret SMTP, accès lié aux droits du repo.

---

## 4. Spécification du nouveau projet : agent IA de recouvrement d'impayés B2B

### 4.1 Le produit

Agent IA qui automatise les relances clients impayés en B2B :
- Détection des factures en retard depuis la compta (ou import CSV)
- Personnalisation du ton de relance selon l'historique client et le montant
- Envoi multi-canaux séquencé (email J+1, email J+7, SMS J+14, appel humain à programmer)
- Suivi des promesses de paiement et relance auto si non tenue
- Tableau de bord du portefeuille impayés
- Génération automatique des courriers de mise en demeure pré-rédigés

**Positionnement** : alternative légère et abordable aux solutions enterprise (Sidetrade, Aston iTF, GCollect). Cible PME où la directrice administrative gère le recouvrement à la main (Excel + emails).

### 4.2 Persona client cible

**Le bon client** : PME 30-150 salariés, B2B, qui :
- Facture en différé (30-60-90 jours)
- A un volume de factures suffisant pour que le recouvrement soit pénible (>50 factures/mois)
- N'a **pas** déjà investi dans un outil de recouvrement enterprise
- A une **personne identifiable** qui gère le sujet (DAF, comptable, ADV)
- Subit des impayés réguliers (sinon pas de douleur)

**Le mauvais client** : artisan facture comptant, e-commerce B2C, grands groupes (équipés en SAP/Sidetrade), services publics, secteurs cash-only.

### 4.3 ICP — Effectif et géo

- **Effectif** : 30-150 salariés
- **Sweet spot** : 50-120 salariés (volume facturé + une personne dédiée mais pas une équipe)
- **Ancienneté** : > 3 ans (sinon process pas encore formalisés)
- **Géo** : France métropolitaine, DOM-TOM exclus (départements 971, 972, 973, 974, 976)

### 4.4 NAF cibles (Tier 1 — bonus +15)

Secteurs où le **B2B en différé est la norme** + volume de factures critique :

```yaml
tier_1:
  bonus: 15
  naf_codes:
    - "46"        # Commerce de gros interentreprises (cœur de cible : factures fournisseurs/clients en différé)
    - "49.41A"    # Transport routier de fret interurbain
    - "49.41B"    # Transport routier de fret de proximité
    - "49.42Z"    # Services de déménagement
    - "52"        # Entreposage et services auxiliaires des transports
    - "78"        # Intérim et placement (gros volume factures clients)
    - "80"        # Sécurité privée (gardiennage, télésurveillance)
    - "81.21Z"    # Nettoyage courant des bâtiments
    - "81.22Z"    # Nettoyage industriel et autres activités de nettoyage
    - "82.20Z"    # Centres d'appels
    - "69.20Z"    # Expertise comptable (ironie : ils ont eux aussi des honoraires impayés)
    - "71.12B"    # Ingénierie et études techniques (factures sur livrables longs)
    - "70.22Z"    # Conseil pour les affaires
    - "33.20"     # Installation de machines et équipements industriels
```

### 4.5 NAF cibles (Tier 2 — bonus +8)

Secteurs intéressants mais signal moins fort :

```yaml
tier_2:
  bonus: 8
  naf_codes:
    - "25"        # Travail des métaux (PME industrielles, factures B2B)
    - "28"        # Fabrication de machines
    - "73.11Z"    # Activités des agences de publicité (impayés agences-clients)
    - "74.10Z"    # Activités spécialisées de design
    - "77"        # Activités de location et location-bail (loyers impayés)
    - "43.21A"    # Travaux d'installation électrique (sous-traitants BTP)
    - "43.22A"    # Travaux d'installation d'équipements thermiques
```

### 4.6 NAF exclus (refus immédiat)

```yaml
naf_exclude_prefixes:
  - "01"   # Agriculture (modèle cash + subventions)
  - "55"   # Hébergement (paiement immédiat)
  - "56"   # Restauration (paiement immédiat)
  - "47"   # Commerce de détail (B2C cash)
  - "64"   # Activités financières (sont leur propre recouvrement)
  - "65"   # Assurance
  - "66"   # Activités auxiliaires services financiers
  - "84"   # Administration publique
  - "85"   # Enseignement (paiement scolarité = autre logique)
  - "86"   # Santé humaine (réglementaire spécifique)
  - "87"   # Action sociale avec hébergement
  - "88"   # Action sociale sans hébergement
  - "94"   # Organisations associatives
  - "97"   # Activités des ménages employeurs
  - "99"   # Organisations extra-territoriales
  - "62"   # Programmation informatique (concurrence + autonomes)
  - "63"   # Services d'information
naf_exclude_exact:
  - "69.10Z"   # Activités juridiques (avocats = font le recouvrement eux-mêmes)
```

### 4.7 Signaux web spécifiques

#### Anti-signal majeur : concurrence déjà installée → exclusion ou gros malus

Détecter dans le HTML / footer / mentions légales la présence de logiciels de recouvrement déjà déployés :

```yaml
competitor_saas_signals:
  - "sidetrade"
  - "aston itf"
  - "gcollect"
  - "upflow.io"
  - "hoopiz"
  - "creditsafe"
  - "cegid recouvrement"
  - "you don't nag"
  - "libeo"
  - "agicap"
  - "kyriba"
  - "esker"
  - "iqualif"
  - "billtrust"
  - "highradius"
```

→ **Exclusion immédiate** (l'entreprise est déjà équipée).

#### Signal positif : mention de relances / impayés / paiement

Présence de ces mots-clés sur le site = sujet conscient :

```yaml
pain_signals:
  - "conditions de règlement"
  - "conditions de paiement"
  - "délai de paiement"
  - "délai de règlement"
  - "service comptabilité"
  - "service compta"
  - "service recouvrement"
  - "service facturation"
  - "facturation"
  - "comptabilité fournisseurs"
  - "comptabilité clients"
  - "30 jours net"
  - "60 jours fin de mois"
  - "à réception de facture"
  - "lcr"
  - "litige"
```

→ Bonus +5 si détecté.

#### Anti-signal : filiale d'un groupe (DSI groupe bloque)

Même logique que le projet source :

```yaml
subsidiary_keywords:
  - "filiale de"
  - "filiale du groupe"
  - "appartient au groupe"
  - "subsidiary of"
  - "member of the"
  - "fait partie du groupe"
  - "société du groupe"
```

→ Exclusion immédiate.

### 4.8 Scoring déterministe

```yaml
scoring:
  base: 40
  bonus_tier_1: 15        # automatique selon NAF
  bonus_tier_2: 8         # automatique selon NAF
  bonus_pain_signals: 5   # vocab "conditions de règlement", "service compta"…
  bonus_pro_area: 3       # espace pro = B2B mature
  bonus_effectif_sweet_spot: 5  # 50-120 salariés
  bonus_phone: 3
  bonus_commercial_email: 3
  malus_no_site: -5
  malus_competitor_saas: -100   # = exclusion de fait (jamais accepté)
  malus_dom_tom: -8

hard_web_filters:
  exclude_if_subsidiary: true
  exclude_if_competitor_saas: true   # plus propre que le malus -100

output:
  top_n: 25
  min_score: 50
```

### 4.9 Prompt Claude — génération `secteur` + `idees`

Adapter le prompt source en remplaçant le persona "dev solo IA generaliste" par "vendeur d'un agent IA de recouvrement". Les idées proposées doivent être **liées au recouvrement uniquement**.

Structure du prompt :

```markdown
Tu es l'analyste commercial de **[NOM DU PRODUIT]** — un agent IA spécialisé qui automatise
la relance des impayés B2B pour PME 30-150 salariés. Premier déploiement en 7 jours, ROI
mesurable dès le 1er mois.

**Ce que fait concrètement l'agent** :
- Détecte les factures en retard depuis l'export compta (Sage, Cegid, EBP, Quickbooks, ou CSV)
- Personnalise la relance selon l'historique client et le montant
- Envoie email J+1, email J+7, SMS J+14, programme un appel J+21 si rien
- Suit les promesses de paiement, relance auto si non tenue
- Génère les mises en demeure pré-rédigées prêtes à signer
- Dashboard du portefeuille impayés (DSO, top mauvais payeurs, encours risqué)

**Cible** : PME 30-150 salariés, B2B, qui font du 30-60 jours et où une personne (DAF,
ADV, comptable) gère le recouvrement à la main aujourd'hui.

---

## Ta tâche

Pour chaque entreprise reçue, génère 2 champs :

### 1. `secteur` (1 phrase, format strict)
Format : `[Activité concrète] · ~[effectif] salariés · [ville]`

### 2. `idees` (2-3 puces courtes)
Format strict :
• [Action ultra-concrète liée au recouvrement] → [bénéfice mesurable]

Règles :
- TOUJOURS lié au recouvrement / DSO / impayés, JAMAIS générique
- Tient compte du secteur du prospect (transporteur = LCR + impayés clients pro ;
  société d'intérim = factures multiples mensuelles ; ESN = factures sur livrables ;
  cabinet d'expertise = honoraires à recouvrer)
- Quantifie le bénéfice : "-10 jours sur le DSO", "3-4h gagnées/semaine pour la DAF",
  "réduction de 40% des impayés > 60j", "1 mise en demeure prête en 2 min"
- 2 puces si contexte mince, 3 si description site riche
- 1 ligne max par puce

### Exemples par secteur

**Commerce de gros (NAF 46, ~70 salariés)** :
```
• Relance auto des clients en retard >15j, ton dur si encours >5k€ → 3-4 jours gagnés sur le DSO
• Détection IA des "mauvais payeurs récidivistes" dans votre portefeuille → trésorerie sécurisée
• Mise en demeure pré-rédigée prête à signer en 2 min → fin du copier-coller Word
```

**Transporteur (NAF 49.41, ~90 salariés)** :
```
• Relance multi-canal (email/SMS) sur les BL non payés à J+45 → -15% d'encours >60j
• Génération auto des LCR avec accord du chargeur → moins de tension trésorerie
```

**Cabinet d'ingénierie (NAF 71.12B, ~50 salariés)** :
```
• Suivi des promesses de paiement clients par mission → relances divisées par 2
• Tableau de bord du DSO par client / projet → arbitrages plus rapides en COMEX
```

**Société de nettoyage (NAF 81.21Z, ~120 salariés)** :
```
• Relance auto sur les factures mensuelles récurrentes en retard → finie la perte de 1-2 jours par mois
• Alerte sur les clients qui dépassent 60j 2 fois de suite → action préventive avant litige
```

## Format de sortie

JSON array, 1 objet par entreprise dans l'ordre reçu :

```json
[
  {
    "siret": "12345678900012",
    "secteur": "Grossiste en fournitures industrielles · ~75 salariés · Lille",
    "idees": "• Relance auto J+15/J+30/J+45 sur les factures impayées, ton adapté au montant → 3-4 jours gagnés sur le DSO\n• Détection IA des nouveaux clients à risque sur historique de paiement → arbitrage commercial plus serein\n• Mise en demeure pré-rédigée prête à signer en 2 min → fin du copier-coller Word"
  }
]
```
```

---

## 5. Plan d'implémentation pas à pas

### Étape 1 — Setup du nouveau repo

```bash
# Sur ta machine
mkdir nom-du-nouveau-projet
cd nom-du-nouveau-projet
git init
```

Créer le sous-dossier `lead-detection/` avec la structure de la section 2.

### Étape 2 — Recréer le code des sources INSEE et web

Voir les **pièges techniques** en section 3. En particulier :
- Query Sirene minimale (3.1)
- Politesse 30 req/min
- Détection des signaux web spécifiques au use case (4.7)
- Détection competitor SaaS dans le HTML brut (pas juste le texte visible)

### Étape 3 — Implémenter le scoring déterministe

Section 4.8 du brief. Le scoring se fait sur le row enrichi (avec les flags web). Filter `score >= min_score` puis trier décroissant.

### Étape 4 — Implémenter la génération de copy Claude

Section 4.9 du brief. Batch de 10 entreprises par appel, prompt caching activé.

### Étape 5 — Configurer GitHub Actions

Section 2.3 du brief. Cron lundi 06h UTC. Artifact CSV en sortie.

### Étape 6 — Ajouter les secrets GitHub

Settings → Secrets and variables → Actions → New repository secret :
- `INSEE_API_KEY` (obtenu sur https://portail-api.insee.fr)
- `ANTHROPIC_API_KEY` (obtenu sur https://console.anthropic.com)

### Étape 7 — Premier test manuel

Actions → "Weekly leads detection" → **Run workflow**. Attendre 25-30 min.

Vérifier dans les logs :
```
Sirene query: etablissementSiege:true AND dateCreationEtablissement:[1900-01-01 TO YYYY-12-31]
Sirene total matches: XX millions
fetch_sample done: NN kept after MM pages
Scoring: kept N/M (min_score=50). Rejected: X subsidiary, Y competitor_saas, Z low_score
Pipeline summary: NN collected → N scored ≥ threshold → N in CSV
```

Télécharger le CSV depuis Artifacts. Si vide, ajuster :
- `SAMPLE_SIZE` à 3000 dans le workflow
- `min_score` à 48 dans icp.yaml
- Vérifier que la liste `competitor_saas_signals` n'exclut pas trop

---

## 6. Ce qu'il NE faut PAS faire (leçons apprises sur le projet source)

1. **Ne pas utiliser France Travail** pour signal "ils recrutent en compta". L'API OAuth de France Travail est instable et l'auth a foiré pendant des semaines. Les signaux web suffisent.

2. **Ne pas envoyer le CSV par email**. SMTP = secrets à gérer + risque de spam + pas de versioning. Artifact GitHub Actions = 0 maintenance.

3. **Ne pas faire scorer Claude**. Le scoring déterministe en Python est plus stable, plus debug-friendly, et permet de filtrer AVANT l'appel LLM (économie 90% des tokens).

4. **Ne pas demander à Claude de produire 22 colonnes**. 8 colonnes utiles > 22 colonnes dont 14 jamais lues.

5. **Ne pas faire des queries Sirene complexes**. L'API v3.11 est très fragile sur la syntaxe. La query minimale + filtres Python est la seule approche stable.

6. **Ne pas oublier la liste de domaines bannis** sur DDG (sinon le "site officiel" devient Pappers ou Societe.com pour 60% des résultats).

7. **Ne pas pousser le seuil min_score trop bas**. Mieux vaut 15 leads excellents que 100 leads médiocres. Le but est le taux de conversion en RDV, pas le volume.

---

## 7. Checklist finale avant le premier run

- [ ] Repo créé, code complet, dépendances installées
- [ ] `config/icp.yaml` adapté au use case recouvrement (NAF tiers, signaux pain, competitors)
- [ ] `src/prompts/scoring.md` réécrit avec le persona "agent IA recouvrement"
- [ ] Secrets `INSEE_API_KEY` et `ANTHROPIC_API_KEY` configurés côté GitHub
- [ ] Workflow `weekly-leads.yml` en place avec cron + workflow_dispatch
- [ ] Test manuel lancé, logs vérifiés (pas de 400 Sirene, génération copy OK)
- [ ] CSV téléchargé, ouvert dans Google Sheets, 5 leads vérifiés à la main (le site web cible existe, le score est cohérent, les idées sont spécifiques au recouvrement)
- [ ] Cron hebdo validé en production

---

## 8. Questions à poser à l'utilisateur avant de coder

1. **Nom du produit** ? (placeholder `[NOM DU PRODUIT]` dans le prompt Claude)
2. **Url marketing du produit** ? (à mentionner dans le script si pertinent — mais on ne génère plus de script, juste des idées)
3. **Pricing** ? Pour calibrer les "ordres de grandeur" dans les bénéfices proposés
4. **Intégrations compta supportées** ? (Sage, Cegid, EBP, Quickbooks, Pennylane…) — utile dans les idées
5. **Borne haute d'effectif vraiment 150 ou descendre à 120** ? (au-delà de 120, souvent une équipe compta avec leurs propres outils)
6. **Géo bonus région ?** (proximité commerciale physique)
7. **Veut-il garder le cron lundi 06h UTC** ou autre rythme ?
8. **Veut-il un mix équilibré entre secteurs** (quotas par tier) ou laisser le tirage Sirene faire ?

---

## 9. Évolutions possibles (V2)

- **Pappers API** (19 €/mois pour 1000 fiches) pour récupérer le **nom du DAF** directement — le décideur sur le recouvrement
- **Détection de "DSO communiqué publiquement"** dans les rapports financiers déposés au greffe (signal très fort)
- **LinkedIn Sales Navigator export** pour cross-référencer avec les leads scorés
- **Détection "récente levée de fonds"** (signal : argent + besoin de structurer le cash management)
- **Slack webhook** pour notifier en temps réel quand un lead score > 80
