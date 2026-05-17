# Jungle.Block Solutions

Site marketing premium (Next.js) + système interne de détection de leads.

## Structure

```
.                       # Site Next.js (déployé sur Vercel)
├── src/                # Pages, composants, styles
├── public/             # Assets statiques
├── package.json
└── next.config.ts

lead-detection/         # Pipeline interne de prospection (cron hebdo)
└── …                   # cf. lead-detection/README.md
```

## Site — développement

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Site — déploiement (Vercel)

Le site est déployé automatiquement sur [Vercel](https://vercel.com) à chaque push sur `main`.

- **Framework** : Next.js (détecté automatiquement)
- **Root Directory** : `.` (racine du repo)
- **Build Command** : `npm run build`
- **Output Directory** : `.next` (auto)

Aucune config manuelle nécessaire — Vercel détecte tout depuis `package.json` et `next.config.ts`.

## Système de détection de leads

Pipeline indépendant exécuté chaque lundi matin par GitHub Actions. Voir [`lead-detection/README.md`](./lead-detection/README.md) pour les détails.
