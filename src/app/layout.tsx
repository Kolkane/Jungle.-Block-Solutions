import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://jungleblocksolutions.com";
const SITE_NAME = "Jungle.Block Solutions";
const TAGLINE = "Solutions sur-mesure pour dirigeants : audit, IA, automatisation";
const DESCRIPTION =
  "Cabinet de conseil et de mise en œuvre pour dirigeants. J'audite votre activité, j'identifie les leviers d'impact, puis je conçois et déploie une solution IA ou technologique sur-mesure. ROI mesurable, aucun template.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Vincent Fournier", url: "https://www.linkedin.com/company/jungle-block-solutions" }],
  creator: "Vincent Fournier",
  publisher: SITE_NAME,
  keywords: [
    "conseil IA",
    "audit stratégique",
    "agent IA sur-mesure",
    "automatisation entreprise",
    "GEO Generative Engine Optimization",
    "consultant IA France",
    "développement sur-mesure",
    "SaaS sur-mesure",
    "intégration IA PME",
    "Bayonne",
    "Vincent Fournier",
    "Jungle.Block Solutions",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${TAGLINE}`,
    description: DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/logo.png"],
  },
  icons: { icon: "/favicon.png" },
  category: "business",
};

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vincent Fournier",
  jobTitle: "Consultant en stratégie technologique et IA",
  worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  url: "https://www.linkedin.com/in/vincent-fournier-939021170/",
  sameAs: [
    "https://www.linkedin.com/in/vincent-fournier-939021170/",
    "https://www.linkedin.com/company/jungle-block-solutions",
  ],
  address: { "@type": "PostalAddress", addressLocality: "Bayonne", addressCountry: "FR" },
  knowsAbout: [
    "Intelligence artificielle",
    "Agents IA",
    "Large Language Models",
    "GEO Generative Engine Optimization",
    "Automatisation",
    "Stratégie produit",
    "Audit technologique",
    "Développement SaaS",
  ],
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: SITE_NAME,
  alternateName: "JBS",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: DESCRIPTION,
  email: "fnr.vincent.pro@gmail.com",
  telephone: "+33681285433",
  founder: { "@type": "Person", name: "Vincent Fournier" },
  foundingLocation: { "@type": "Place", name: "Bayonne, France" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bayonne",
    addressRegion: "Nouvelle-Aquitaine",
    addressCountry: "FR",
  },
  areaServed: [
    { "@type": "Country", name: "France" },
    { "@type": "Place", name: "Europe francophone" },
  ],
  serviceType: [
    "Audit stratégique technologique",
    "Conception et déploiement d'agents IA",
    "Automatisation de processus métier",
    "Développement de SaaS sur-mesure",
    "Audit et stratégie GEO (Generative Engine Optimization)",
    "Conseil produit et stratégie IA",
  ],
  knowsAbout: [
    "Intelligence artificielle",
    "Agents IA",
    "RAG (Retrieval Augmented Generation)",
    "Large Language Models",
    "GEO Generative Engine Optimization",
    "Automatisation",
    "ETL",
    "SaaS",
    "Scoring algorithmique",
  ],
  sameAs: [
    "https://www.linkedin.com/company/jungle-block-solutions",
    "https://www.linkedin.com/in/vincent-fournier-939021170/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "fnr.vincent.pro@gmail.com",
    telephone: "+33681285433",
    areaServed: "FR",
    availableLanguage: ["French", "English"],
  },
  identifier: { "@type": "PropertyValue", propertyID: "SIRET", value: "99521609000010" },
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Service",
      position: 1,
      name: "Audit stratégique",
      description:
        "Immersion dans votre activité, cartographie des flux, diagnostic 360°, analyse de la stack, identification des risques et opportunités. Livrable permettant de décider rapidement.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "FR",
    },
    {
      "@type": "Service",
      position: 2,
      name: "Agent IA sur-mesure",
      description:
        "Conception et déploiement d'agents conversationnels et workflows IA adaptés à votre métier : RAG, intégrations applicatives, fine-tuning si nécessaire.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "FR",
    },
    {
      "@type": "Service",
      position: 3,
      name: "Automatisation de processus métier",
      description:
        "Orchestration de processus, ETL/ELT, intégrations API, mix no-code et code pour fiabiliser et accélérer vos opérations.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "FR",
    },
    {
      "@type": "Service",
      position: 4,
      name: "Audit GEO (Generative Engine Optimization)",
      description:
        "Mesure de votre visibilité dans les IA génératives (ChatGPT, Claude, Perplexity, Gemini), recommandations actionnables, plan d'action priorisé.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "FR",
    },
    {
      "@type": "Service",
      position: 5,
      name: "Développement de produit digital sur-mesure",
      description:
        "Du prototype à la production : SaaS, outil interne, site premium, application web. UI/UX, base de données, IA, intégrations, mise en production.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "FR",
    },
  ],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quels services propose Jungle.Block Solutions ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jungle.Block Solutions propose des audits stratégiques technologiques, la conception et le déploiement d'agents IA sur-mesure, l'automatisation de processus métier, des audits GEO (visibilité dans les IA génératives) et le développement de produits digitaux sur-mesure (SaaS, outils internes, sites premium). Chaque mission commence par un audit, puis l'identification des leviers d'impact, puis la mise en œuvre.",
      },
    },
    {
      "@type": "Question",
      name: "À qui s'adressent les services de Jungle.Block Solutions ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les services s'adressent principalement aux dirigeants de PME, ETI et scale-ups qui cherchent à intégrer l'IA dans leur activité, automatiser des processus, ou lancer un produit digital sur-mesure. Le positionnement est haut de gamme : pas de template, chaque mission est unique et orientée ROI mesurable.",
      },
    },
    {
      "@type": "Question",
      name: "Comment se déroule une mission type ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trois étapes : (1) Audit — immersion, cartographie des flux, diagnostic 360°, analyse de la stack. (2) Identification — isolation des points de friction, priorisation des leviers d'impact, roadmap actionnable. (3) Mise en œuvre — conception et livraison de la solution sur-mesure, itérations, mise en production.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le délai pour un premier livrable ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entre 72 heures et 7 jours après le cadrage initial selon la complexité de la mission. Un audit stratégique de 30 minutes (gratuit) est disponible sur Calendly pour cadrer le besoin.",
      },
    },
    {
      "@type": "Question",
      name: "Jungle.Block Solutions fait-il du GEO (Generative Engine Optimization) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Jungle.Block Solutions a conçu Agentable (agentable.fr), un outil d'audit GEO automatisé pour PME françaises. La société accompagne les marques pour améliorer leur visibilité dans les IA génératives (ChatGPT, Claude, Perplexity, Gemini) via audits, recommandations et plans d'action.",
      },
    },
    {
      "@type": "Question",
      name: "Où est basé Jungle.Block Solutions ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jungle.Block Solutions est basé à Bayonne, en Nouvelle-Aquitaine (France). La société intervient à distance partout en France et en Europe francophone.",
      },
    },
    {
      "@type": "Question",
      name: "Comment contacter Jungle.Block Solutions ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Réservation directe d'un audit stratégique de 30 minutes (gratuit) sur https://calendly.com/fnr-vincent-pro/audit-strategique. Email : fnr.vincent.pro@gmail.com. LinkedIn entreprise : https://www.linkedin.com/company/jungle-block-solutions.",
      },
    },
  ],
};

const ALL_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [ORG_JSONLD, PERSON_JSONLD, WEBSITE_JSONLD, SERVICE_JSONLD, FAQ_JSONLD],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <Script
          src="https://www.agentable.fr/api/geo/972cc684-30a0-46f5-b903-43216420b22d/script"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ALL_JSONLD) }}
        />
      </head>
      <body className="min-h-screen text-white antialiased">
        <ScrollProgress />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
