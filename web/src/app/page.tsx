import Badge from "@/components/Badge";
import Container from "@/components/Container";
import ChatTicket from "@/components/ChatTicket";
import Reveal from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

export default function Home() {
  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <Container>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Jungle.Block Solutions" className="h-9 w-9 object-contain" />
              </div>
              <div className="font-semibold tracking-tight">Jungle.Block Solutions</div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#chat"
                className="rounded-xl bg-[hsl(var(--jbs-yellow))] px-4 py-2 text-sm font-medium text-black hover:brightness-95"
              >
                Créer un ticket
              </a>
              <a
                href="#contact"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Contact
              </a>
            </div>
          </div>
        </Container>
      </header>

      <Reveal>{/* HERO (centered + slightly smaller for 1st scroll) */}
      <section className="pt-12 md:pt-16">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <Badge>Décrivez votre besoin en 30 secondes.</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Audit tech & produit. Build sur-mesure. IA intégrée.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
              Jungle.Block Solutions conçoit et livre des solutions digitales premium : diagnostic 360°, prototypes rapides,
              développement sur-mesure, agents IA, SaaS complets. Une exécution rapide, propre, orientée ROI.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-white/60 md:text-sm">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Audit stratégique</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Développement sur mesure</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Agents IA</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SaaS complets</span>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="#chat"
                className="rounded-xl bg-[hsl(var(--jbs-blue))] px-5 py-3 text-sm font-medium hover:brightness-110"
              >
                Démarrer (ticket)
              </a>
              <a
                href="#process"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                Voir le process
              </a>
            </div>

            <div className="mt-8 w-full rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">Positionnement</div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniKpi label="Prototype" value="72h → 7j" />
                <MiniKpi label="Exploration" value="20 min" />
                <MiniKpi label="Livraison" value="MVP → produit" />
              </div>
            </div>
          </div>
        </Container>
      </section></Reveal>

      <Reveal delayMs={80}>{/* TICKET (more horizontal + subtler UI) */}
      <section id="chat" className="mt-10 scroll-mt-24 md:mt-12">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/50">Ticket projet</div>
                <div className="mt-2 text-xl font-semibold">Générez un ticket en 30 secondes</div>
                <div className="mt-2 text-sm text-white/70">
                  3 questions. Ensuite email ou téléphone pour être recontacté dans les plus brefs délais.
                </div>
              </div>
              <a
                href="#contact"
                className="rounded-xl bg-[hsl(var(--jbs-yellow))] px-5 py-3 text-sm font-medium text-black hover:brightness-95"
              >
                Contact direct
              </a>
            </div>

            {/* main row */}
            <div className="mt-6">
              <ChatTicket recipientEmail="fnr.vincent.pro@gmail.com" />
            </div>

            {/* what you receive BELOW */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-6">
              <div className="text-sm font-semibold">Ce que vous recevez</div>
              <p className="mt-2 text-sm text-white/70">Un ticket clair (type, objectif, timing, contact) + une prochaine étape.</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70 md:flex-row md:flex-wrap">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--jbs-yellow))]" />Cadrage rapide</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--jbs-yellow))]" />Estimation</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--jbs-yellow))]" />Proposition de prochaine étape</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>


      {/* OFFER */}
      <section className="mt-20">
        <Container>
          <SectionTitle
            eyebrow="Offre"
            title="Ce que propose Jungle.Block Solutions"
            desc="Deux blocs simples. Une approche premium, orientée solutions."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card title="Audit stratégique" subtitle="Diagnostic 360°">
              Clarification du besoin, cartographie des flux, analyse de la stack, risques, opportunités, priorisation, roadmap.
              Un livrable qui permet de décider vite et bien.
            </Card>
            <Card title="Développement sur mesure" subtitle="Build propre, rapide, scalable">
              UI/UX premium, base de données, IA, intégrations, mise en production, observabilité. Du prototype au produit.
            </Card>
          </div>
        </Container>
      </section></Reveal>

      <Reveal delayMs={140}>{/* PROCESS */}
      <section id="process" className="section-divider mt-20 scroll-mt-24">
        <Container>
          <SectionTitle
            eyebrow="Méthode"
            title="Process de travail"
            desc="4 étapes, du cadrage à la livraison. Exécution rapide, décisions claires."
          />

          {/* Desktop: horizontal roadmap. Mobile: stacked cards */}
          <div className="hidden md:block">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 glass-hover">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-[hsl(var(--jbs-yellow))]/10 via-transparent to-[hsl(var(--jbs-blue))]/10" />

              <div className="relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                  <div className="h-[2px] w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
                </div>

                <div className="grid grid-cols-4 gap-6">
                  <RoadStep
                    n="01"
                    title="Exploration"
                    desc="Clarification + cadrage + estimation."
                    icon="clock"
                    align="top"
                  />
                  <RoadStep
                    n="02"
                    title="Prototype"
                    desc="Version interactive pour valider la direction."
                    icon="spark"
                    align="bottom"
                  />
                  <RoadStep
                    n="03"
                    title="Build"
                    desc="UI/UX, data, IA, intégrations, production."
                    icon="stack"
                    align="top"
                  />
                  <RoadStep
                    n="04"
                    title="Livraison"
                    desc="Tests, itérations, handover GitHub."
                    icon="check"
                    align="bottom"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4">
              <ProcessCard n="01" title="Exploration" desc="Clarification + cadrage + estimation." icon="clock" />
              <ProcessCard n="02" title="Prototype" desc="Version interactive pour valider la direction." icon="spark" />
              <ProcessCard n="03" title="Build" desc="UI/UX, data, IA, intégrations, production." icon="stack" />
              <ProcessCard n="04" title="Livraison" desc="Tests, itérations, handover GitHub." icon="check" />
            </div>
          </div>
        </Container>
      </section>

{/* WHY */}
      <section className="section-divider mt-20">
        <Container>
          <SectionTitle eyebrow="Différence" title="Pourquoi Jungle.Block Solutions ?" />

          {/* Coherent layout: 2 wide cards, then 3 equal cards, then 1 full-width */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-fr">
            <div className="md:col-span-3">
              <FeatureCard
                title="Vision produit + stratégie"
                desc="On challenge le besoin, on simplifie, on priorise. Décisions claires, roadmap actionnable."
                icon="compass"
              />
            </div>
            <div className="md:col-span-3">
              <FeatureCard
                title="Exécution rapide & propre"
                desc="Ship vite sans casser la qualité : base solide, dette maîtrisée, mise en prod propre."
                icon="bolt"
              />
            </div>

            <div className="md:col-span-2">
              <FeatureCard
                title="UI/UX premium"
                desc="Interfaces nettes, micro-interactions, détails soignés. Une expérience qui convertit."
                icon="spark"
              />
            </div>
            <div className="md:col-span-2">
              <FeatureCard
                title="Du prototype au produit"
                desc="Du test rapide à la mise en production + itérations."
                icon="stack"
              />
            </div>
            <div className="md:col-span-2">
              <FeatureCard
                title="IA & automatisation"
                desc="Agents, workflows, intégrations — gain de temps concret."
                icon="robot"
              />
            </div>

            <div className="md:col-span-6">
              <FeatureCard
                title="Exécution orientée ROI"
                desc="On mesure l’impact, on industrialise ce qui marche. Handover GitHub + itérations si besoin."
                icon="target"
              />
            </div>
          </div>
        </Container>
      </section>

{/* CONTACT */}
      <section id="contact" className="mt-20 pb-20 scroll-mt-24">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 glass-hover">
            <div className="text-xs uppercase tracking-[0.18em] text-white/50">Contact</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">On avance ?</div>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Utilisez le chatbot pour générer un ticket projet. Ou contactez-moi directement.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#chat"
                className="rounded-xl bg-[hsl(var(--jbs-yellow))] px-5 py-3 text-sm font-medium text-black hover:brightness-95"
              >
                Utiliser le chatbot
              </a>
              <a
                href="mailto:fnr.vincent.pro@gmail.com"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                fnr.vincent.pro@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/vincent-fournier-939021170/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
              >
                LinkedIn
              </a>
            </div>

            <div className="mt-8 text-xs text-white/40">
              © {new Date().getFullYear()} Jungle.Block Solutions. Audit & build premium.
            </div>
          </div>
        </Container>
      </section></Reveal>
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{subtitle}</div>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{children}</p>
    </div>
  );
}





function RoadStep({
  n,
  title,
  desc,
  icon,
  align,
}: {
  n: string;
  title: string;
  desc: string;
  icon: "clock" | "spark" | "stack" | "check";
  align: "top" | "bottom";
}) {
  const Icon = icon === "clock" ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path d="M12 7v5l3 2" />
    </svg>
  ) : icon === "spark" ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  ) : icon === "stack" ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 7l-9 9-4-4" />
    </svg>
  );

  const isTop = align === "top";

  return (
    <div className={`relative ${isTop ? "pb-16" : "pt-16"}`}>
      {/* node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30 shadow-[0_0_30px_rgba(37,99,235,.15)]">
          {Icon}
        </div>
      </div>

      {/* card */}
      <div
        className={`mx-auto w-[92%] rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_0_0_1px_rgba(255,255,255,.04)] ${
          isTop ? "-translate-y-2" : "translate-y-2"
        }`}
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">Étape {n}</div>
        <div className="mt-2 text-base font-semibold">{title}</div>
        <div className="mt-1 text-sm text-white/70">{desc}</div>
      </div>
    </div>
  );
}

function ProcessCard({
  n,
  title,
  desc,
  icon,
}: {
  n: string;
  title: string;
  desc: string;
  icon: "clock" | "spark" | "stack" | "check";
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Étape {n}</div>
          <div className="mt-2 text-lg font-semibold">{title}</div>
          <div className="mt-2 text-sm text-white/70">{desc}</div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
          {
            icon === "clock" ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M12 7v5l3 2" />
              </svg>
            ) : icon === "spark" ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
              </svg>
            ) : icon === "stack" ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l9 5-9 5-9-5 9-5z" />
                <path d="M3 12l9 5 9-5" />
                <path d="M3 17l9 5 9-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-9 9-4-4" />
              </svg>
            )
          }
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: "compass" | "bolt" | "spark" | "robot" | "stack" | "target";
}) {
  const Icon =
    icon === "compass" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        <path d="M14.5 9.5l-1.5 5-5 1.5 1.5-5 5-1.5z" />
      </svg>
    ) : icon === "bolt" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ) : icon === "spark" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
      </svg>
    ) : icon === "robot" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v3" />
        <path d="M8 6h8" />
        <rect x="5" y="8" width="14" height="12" rx="3" />
        <path d="M9 14h.01" />
        <path d="M15 14h.01" />
      </svg>
    ) : icon === "stack" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l9 5-9 5-9-5 9-5z" />
        <path d="M3 12l9 5 9-5" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
        <path d="M12 7v5l3 2" />
      </svg>
    );

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[hsl(var(--jbs-blue))]/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-[hsl(var(--jbs-yellow))]/10 blur-3xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold">{title}</div>
          <div className="mt-2 text-sm text-white/70">{desc}</div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-white/10">
          {Icon}
        </div>
      </div>
    </div>
  );
}
