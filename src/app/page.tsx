"use client";

import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container";
import ChatTicket from "@/components/ChatTicket";
import HeroBackdrop from "@/components/HeroBackdrop";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/MotionReveal";

const CALENDLY = "https://calendly.com/fnr-vincent-pro/audit-strategique";
const LINKEDIN_COMPANY = "https://www.linkedin.com/company/jungle-block-solutions";
const EMAIL = "fnr.vincent.pro@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  return (
    <div>
      <SiteHeader />
      <Hero />
      <Methodology />
      <Values />
      <Realizations />
      <LinkedInBridge />
      <TicketSection />
      <ContactSection />
    </div>
  );
}

/* ─────────────────────────────  HEADER  ───────────────────────────── */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Jungle.Block Solutions" className="h-9 w-9 object-contain" />
            </div>
            <div className="font-semibold tracking-tight">Jungle.Block Solutions</div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#methode"
              className="hidden rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white md:inline-block"
            >
              Méthode
            </a>
            <a
              href="#realisations"
              className="hidden rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white md:inline-block"
            >
              Réalisations
            </a>
            <a
              href="#contact"
              className="hidden rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white md:inline-block"
            >
              Contact
            </a>
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--jbs-yellow))] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95"
            >
              Réserver un audit
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}

/* ─────────────────────────────  HERO  ───────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative pt-20 md:pt-28">
      <HeroBackdrop />
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--jbs-yellow))] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--jbs-yellow))]" />
            </span>
            Audit · Stratégie · IA sur-mesure
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          >
            Des solutions sur-mesure
            <br className="hidden md:block" />{" "}
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              pour décider mieux, livrer plus vite.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
          >
            J&apos;audite votre activité, j&apos;identifie les leviers d&apos;impact, puis je conçois
            et déploie la solution stratégique ou technologique qui résout votre problème.
            Aucun template, uniquement de l&apos;ingénierie sur-mesure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--jbs-yellow))] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(251,191,36,0.4),0_20px_60px_-20px_rgba(251,191,36,0.5)] transition hover:brightness-95"
            >
              Réserver un audit stratégique
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#methode"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
            >
              Voir la méthode
            </a>
          </motion.div>

          {/* KPI strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
            className="mt-16 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur"
          >
            <div className="grid grid-cols-1 divide-white/10 sm:grid-cols-3 sm:divide-x">
              <KpiCell label="Premier livrable" value="72 h à 7 j" />
              <KpiCell label="Audit stratégique" value="30 min offerts" />
              <KpiCell label="Spécialité" value="IA · Automatisation · Produit" />
            </div>
          </motion.div>

          {!reduce && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex flex-col items-center gap-2 text-xs text-white/40"
            >
              <span>Scroller pour découvrir la méthode</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-6 w-px bg-gradient-to-b from-white/40 to-transparent"
              />
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

function KpiCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-5 text-center">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</div>
      <div className="mt-2 text-sm font-semibold md:text-base">{value}</div>
    </div>
  );
}

/* ─────────────────────────────  MÉTHODE  ───────────────────────────── */

function Methodology() {
  const steps = [
    {
      n: "01",
      title: "Audit",
      desc: "Je m'immerge dans votre activité, vos flux et votre stack pour comprendre vos enjeux réels.",
      bullets: ["Cartographie", "Diagnostic 360°", "Risques & opportunités"],
    },
    {
      n: "02",
      title: "Identification",
      desc: "J'isole les points de friction et identifie les leviers d'impact prioritaires sur le ROI.",
      bullets: ["Priorisation", "Hypothèses business", "Roadmap actionnable"],
    },
    {
      n: "03",
      title: "Mise en œuvre",
      desc: "Je conçois et livre la solution sur-mesure : IA, automatisation, produit digital, intégrations.",
      bullets: ["Build rapide", "Itérations", "Mise en production"],
    },
  ];

  return (
    <section id="methode" className="relative mt-32 scroll-mt-24 md:mt-40">
      <Container>
        <MotionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--jbs-yellow))]/80">
              Méthode
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Trois étapes. Aucune improvisation.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Une démarche structurée pour transformer un besoin flou en livrable précis,
              utile, et mesurable. Vous décidez à chaque étape.
            </p>
          </div>
        </MotionReveal>

        <MotionStagger className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <MotionItem key={s.n}>
              <StepCard {...s} />
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}

function StepCard({
  n,
  title,
  desc,
  bullets,
}: {
  n: string;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 backdrop-blur"
    >
      {/* subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--jbs-blue))]/40 to-transparent" />

      <div className="flex items-baseline justify-between">
        <div className="font-mono text-xs tracking-[0.2em] text-[hsl(var(--jbs-yellow))]/80">
          ÉTAPE {n}
        </div>
        <div className="text-5xl font-semibold leading-none text-white/[0.06] transition group-hover:text-white/[0.10]">
          {n}
        </div>
      </div>

      <h3 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{desc}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {bullets.map((b) => (
          <span
            key={b}
            className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/60"
          >
            {b}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────  VALEURS  ───────────────────────────── */

function Values() {
  return (
    <section className="mt-32 md:mt-40">
      <Container>
        <MotionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--jbs-yellow))]/80">
              Valeurs
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Ce qui guide chaque mission.
            </h2>
          </div>
        </MotionReveal>

        <MotionStagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <MotionItem>
            <ValueCard
              eyebrow="Sur-mesure"
              title="Pas de template, jamais."
              desc="Chaque mission est unique. Je refuse les solutions copiées-collées. Je passe du temps à comprendre votre contexte avant de proposer quoi que ce soit, puis je conçois des solutions innovantes qui répondent précisément à vos enjeux."
              points={[
                "Diagnostic propre à votre contexte",
                "Architecture pensée pour vous",
                "Recommandations défendables",
              ]}
              accent="blue"
            />
          </MotionItem>
          <MotionItem>
            <ValueCard
              eyebrow="ROI mesurable"
              title="L’impact business avant la techno."
              desc="J’aime réfléchir et mettre en œuvre, mais seulement si l’impact est mesurable. Pas de techno pour la techno. Chaque décision est justifiée par son retour sur investissement attendu, et chaque livrable s’évalue contre des indicateurs concrets."
              points={[
                "Hypothèses business explicites",
                "Indicateurs définis dès le cadrage",
                "Itérations guidées par la donnée",
              ]}
              accent="yellow"
            />
          </MotionItem>
        </MotionStagger>
      </Container>
    </section>
  );
}

function ValueCard({
  eyebrow,
  title,
  desc,
  points,
  accent,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  points: string[];
  accent: "blue" | "yellow";
}) {
  const accentClass =
    accent === "blue"
      ? "from-[hsl(var(--jbs-blue))]/30 via-transparent"
      : "from-[hsl(var(--jbs-yellow))]/25 via-transparent";
  const dotClass = accent === "blue" ? "bg-[hsl(var(--jbs-blue))]" : "bg-[hsl(var(--jbs-yellow))]";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur md:p-10"
    >
      <div className={`pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-gradient-to-br ${accentClass} to-transparent blur-3xl`} />

      <div className="text-xs uppercase tracking-[0.22em] text-white/45">{eyebrow}</div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h3>
      <p className="mt-5 text-sm leading-relaxed text-white/70 md:text-base">{desc}</p>

      <ul className="mt-7 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm text-white/80">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${dotClass}`} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ─────────────────────────────  RÉALISATIONS  ───────────────────────────── */

type Product = {
  name: string;
  tag: string;
  desc: string;
  href: string;
  metric?: { value: string; label: string };
  accent: "indigo" | "yellow" | "emerald" | "sky" | "violet";
};

const PRODUCTS: Product[] = [
  {
    name: "Agentable",
    tag: "GEO · IA",
    desc: "Audit GEO automatisé pour PME : mesure de visibilité dans les LLM (ChatGPT, Perplexity, Gemini) et recommandations actionnables.",
    href: "https://agentable.fr",
    metric: { value: "10 min", label: "Audit complet" },
    accent: "indigo",
  },
  {
    name: "Rekovly",
    tag: "IA · Recouvrement",
    desc: "Premier agent IA de recouvrement pour TPE/PME. Marc, chargé de recouvrement virtuel, relance vos clients en retard 24/7 par email, SMS et courrier recommandé. Compatible Pennylane, Sellsy, Tiime, Axonaut.",
    href: "https://www.rekovly.com",
    metric: { value: "24/7", label: "Relances automatisées" },
    accent: "sky",
  },
  {
    name: "Bastien",
    tag: "IA · Expertise comptable",
    desc: "Collaborateur IA pour cabinets d'experts-comptables. Surveille la santé financière des clients PME via les FEC, détecte les difficultés 6 à 12 mois en avance, livre chaque lundi un rapport avec emails pré-rédigés. 100% souverain français.",
    href: "https://www.veillor.fr",
    metric: { value: "6-12 mois", label: "D'anticipation" },
    accent: "violet",
  },
  {
    name: "Veillor_Layer",
    tag: "Renseignement · CGP",
    desc: "Système de signaux faibles patrimoniaux pour cabinets CGP. Détection IA, scoring narratif, brief confidentiel hebdomadaire.",
    href: "#contact",
    metric: { value: "9 800+", label: "Annonces / semaine" },
    accent: "yellow",
  },
  {
    name: "Radar Immobilier",
    tag: "Intelligence territoriale",
    desc: "Scoring algorithmique de biens, carte thermique des opportunités, alertes temps réel. Déployable en white-label.",
    href: "#contact",
    metric: { value: "7 700+", label: "Biens scorés" },
    accent: "emerald",
  },
];

function Realizations() {
  return (
    <section id="realisations" className="mt-32 scroll-mt-24 md:mt-40">
      <Container>
        <MotionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--jbs-yellow))]/80">
              Réalisations
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Des produits livrés, pas des slides.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Au-delà des missions clients, j&apos;ai conçu et lancé mes propres produits.
              Voici cinq preuves concrètes de ma capacité à passer de l&apos;idée au produit en production.
            </p>
          </div>
        </MotionReveal>

        <MotionStagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <MotionItem key={p.name}>
              <ProductCard {...p} />
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}

function ProductCard({ name, tag, desc, href, metric, accent }: Product) {
  const isExternal = href.startsWith("http");
  const accentMap = {
    indigo: { bg: "bg-indigo-500/15", ring: "ring-indigo-400/30", text: "text-indigo-300" },
    yellow: { bg: "bg-amber-400/15", ring: "ring-amber-300/30", text: "text-amber-300" },
    emerald: { bg: "bg-emerald-500/15", ring: "ring-emerald-400/30", text: "text-emerald-300" },
    sky: { bg: "bg-sky-500/15", ring: "ring-sky-400/30", text: "text-sky-300" },
    violet: { bg: "bg-violet-500/15", ring: "ring-violet-400/30", text: "text-violet-300" },
  }[accent];

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-7 backdrop-blur transition-colors hover:border-white/20"
    >
      {/* glow */}
      <div className={`pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full ${accentMap.bg} blur-3xl opacity-60 transition-opacity group-hover:opacity-100`} />

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center justify-center rounded-full ${accentMap.bg} px-3 py-1 text-[11px] font-medium tracking-wide ${accentMap.text} ring-1 ${accentMap.ring}`}>
          {tag}
        </span>
        {isExternal && (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        )}
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight">{name}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">{desc}</p>

      {metric && (
        <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
          <div>
            <div className="text-2xl font-semibold tracking-tight">{metric.value}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-white/45">
              {metric.label}
            </div>
          </div>
          <div className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
            {isExternal ? "Visiter →" : "En savoir plus →"}
          </div>
        </div>
      )}
    </motion.a>
  );
}

/* ─────────────────────────────  LINKEDIN BRIDGE  ───────────────────────────── */

function LinkedInBridge() {
  return (
    <section className="mt-20 md:mt-24">
      <Container>
        <MotionReveal>
          <a
            href={LINKEDIN_COMPANY}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[hsl(var(--jbs-blue))]/10 via-white/[0.02] to-white/[0.02] p-8 backdrop-blur transition hover:border-white/20 md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[hsl(var(--jbs-blue))]/20 blur-3xl transition-opacity group-hover:opacity-80" />

            <div className="relative max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0A66C2]/15 ring-1 ring-[#0A66C2]/40">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#70B5F9]" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Aller plus loin
                </div>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                Découvrez le détail des missions et de l&apos;expertise sur LinkedIn.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                Cas d&apos;usage IA, retours d&apos;expérience, publications stratégiques :
                la page entreprise complète ce que ce site ne peut pas dire.
              </p>
            </div>

            <div className="relative shrink-0">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition group-hover:bg-white/10">
                Voir la page LinkedIn
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </div>
          </a>
        </MotionReveal>
      </Container>
    </section>
  );
}

/* ─────────────────────────────  TICKET  ───────────────────────────── */

function TicketSection() {
  return (
    <section id="ticket" className="mt-32 scroll-mt-24 md:mt-40">
      <Container>
        <MotionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--jbs-yellow))]/80">
              Cadrage rapide
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Décrivez votre besoin en 30 secondes.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Trois questions, un ticket clair, une prochaine étape. Idéal si vous voulez
              avancer sans encore décrocher le téléphone.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur md:p-3">
            <ChatTicket recipientEmail={EMAIL} />
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}

/* ─────────────────────────────  CONTACT  ───────────────────────────── */

function ContactSection() {
  return (
    <section id="contact" className="mt-32 scroll-mt-24 pb-24 md:mt-40">
      <Container>
        <MotionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-white/[0.02] p-10 backdrop-blur md:p-14">
            <div className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-[hsl(var(--jbs-yellow))]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[hsl(var(--jbs-blue))]/20 blur-3xl" />

            <div className="relative">
              <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--jbs-yellow))]/80">
                Contact
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                On en discute ?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                30 minutes pour comprendre votre contexte et identifier si nous pouvons travailler
                ensemble. Aucun engagement, juste une conversation utile.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={CALENDLY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--jbs-yellow))] px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(251,191,36,0.4),0_20px_60px_-20px_rgba(251,191,36,0.5)] transition hover:brightness-95"
                >
                  Réserver 30 min sur Calendly
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" /><path d="M4 4l8 8 8-8" />
                  </svg>
                  {EMAIL}
                </a>
                <a
                  href={LINKEDIN_COMPANY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Page LinkedIn
                </a>
              </div>

              <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
                <div>© {new Date().getFullYear()} Jungle.Block Solutions · Bayonne, France</div>
                <div className="flex flex-wrap gap-5">
                  <a href="/mentions-legales" className="hover:text-white/70 transition">Mentions légales</a>
                  <a href="/confidentialite" className="hover:text-white/70 transition">Confidentialité</a>
                  <a href="/cgu" className="hover:text-white/70 transition">CGU</a>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
