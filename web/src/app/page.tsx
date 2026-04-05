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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProcessCard n="01" title="Exploration" desc="Clarification + cadrage + estimation." icon="clock" />
            <ProcessCard n="02" title="Prototype" desc="Version interactive pour valider la direction." icon="spark" />
            <ProcessCard n="03" title="Build" desc="UI/UX, data, IA, intégrations, production." icon="stack" />
            <ProcessCard n="04" title="Livraison" desc="Tests, itérations, handover GitHub." icon="check" />
          </div>
        </Container>
      </section>

{/* WHY */}
      <section className="section-divider mt-20">
        <Container>
          <SectionTitle eyebrow="Différence" title="Pourquoi Jungle.Block Solutions ?" />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <FeatureLine
                title="Vision produit + stratégie"
                desc="On challenge le besoin, on simplifie, on priorise. Roadmap actionnable."
                icon="compass"
              />
              <FeatureLine
                title="Exécution rapide & propre"
                desc="Ship vite sans casser la qualité : base solide, dette maîtrisée, prod propre."
                icon="bolt"
              />
              <FeatureLine
                title="UI/UX premium"
                desc="Micro-interactions, détails soignés, expérience qui convertit."
                icon="spark"
              />
              <FeatureLine
                title="Du prototype au produit"
                desc="Du test rapide à la mise en production + itérations."
                icon="stack"
              />
              <FeatureLine
                title="IA & automatisation"
                desc="Agents, workflows, intégrations — gain de temps concret."
                icon="robot"
              />
              <FeatureLine
                title="Exécution orientée ROI"
                desc="On mesure l’impact et on industrialise ce qui marche."
                icon="target"
              />
            </div>
          </div>
        </Container>
      </section>

{/* FIER DE PRÉSENTER — AGENTABLE */}
      <section className="section-divider mt-20">
        <Container>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Fier de présenter
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Un produit conçu et lancé par Jungle.Block Solutions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-white/60 leading-relaxed">
              Au-delà des missions clients, nous concevons et lançons nos propres produits. Agentable est la preuve
              concrète de notre capacité à aller de l&apos;idée au produit live — rapidement, proprement, avec impact.
            </p>
          </div>

          <div className="rounded-3xl border border-indigo-500/20 bg-indigo-950/30 backdrop-blur-sm overflow-hidden ring-1 ring-white/5">
            {/* Image */}
            <a href="https://agentable.fr" target="_blank" rel="noopener noreferrer" className="block relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://agentable.fr/og-image.png"
                alt="Agentable — Audit GEO automatisé pour PME françaises"
                className="w-full object-cover max-h-[380px] transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent" />
            </a>

            {/* Content */}
            <div className="p-8 md:p-10">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30 grid place-items-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">Agentable</h3>
                    <p className="text-xs text-indigo-400 font-medium tracking-wide">agentable.fr</p>
                  </div>
                </div>
                <a
                  href="https://agentable.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/40"
                >
                  Découvrir le produit
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-2xl">
                Le <strong className="text-white font-semibold">GEO (Generative Engine Optimization)</strong> est le
                nouveau SEO : il s&apos;agit d&apos;optimiser sa présence dans les réponses des IA comme ChatGPT, Perplexity
                ou Gemini. Agentable automatise l&apos;audit GEO pour les PME françaises — analyse de visibilité IA,
                recommandations actionnables, rapport détaillé — en quelques minutes.
              </p>

              {/* Feature pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-indigo-400 mb-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M12 7v5l3 2"/>
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">Audit en quelques minutes</div>
                  <div className="text-xs text-white/50">Analyse automatisée de votre visibilité dans les LLMs.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-indigo-400 mb-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">Score de visibilité IA</div>
                  <div className="text-xs text-white/50">Mesurez où vous en êtes face à vos concurrents.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-indigo-400 mb-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7l-9 9-4-4"/>
                    </svg>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">Recommandations actionnables</div>
                  <div className="text-xs text-white/50">Rapport clair avec les actions prioritaires à mener.</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

{/* VEILLOR_LAYER */}
      <section className="section-divider mt-20">
        <Container>
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--jbs-yellow))]/70 mb-3">
              Système propriétaire
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Données asymétriques. Avantage structurel.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-white/60 leading-relaxed">
              Veillor_Layer est un système de renseignement patrimonial conçu pour les cabinets CGP — détection de signaux faibles, scoring IA, brief confidentiel livré chaque semaine.
            </p>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Card 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">Signal</div>
                  <div className="text-lg font-semibold text-white">Signaux avant le marché</div>
                  <div className="mt-2 text-sm text-white/70">
                    9 800+ annonces analysées chaque semaine. Seules les opportunités à potentiel patrimonial réel remontent.
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M6.34 17.66l-1.41 1.41"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">IA</div>
                  <div className="text-lg font-semibold text-white">Scoring IA par cabinet</div>
                  <div className="mt-2 text-sm text-white/70">
                    Chaque signal est scoré et narrativisé par l&apos;IA. Le brief est personnalisé, pas générique.
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">Exclusivité</div>
                  <div className="text-lg font-semibold text-white">Exclusivité par zone</div>
                  <div className="mt-2 text-sm text-white/70">
                    Une zone = un cabinet. Une fois attribuée, elle n&apos;est plus disponible.
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc différenciateur — citation */}
          <div className="rounded-3xl border border-white/10 bg-black/30 p-8 md:p-10 text-center">
            <blockquote className="text-lg md:text-xl font-semibold text-white/90 italic leading-relaxed max-w-2xl mx-auto">
              &ldquo;Veillor n&apos;identifie pas une cession.<br className="hidden sm:block" />
              Veillor identifie des situations où une cession devient probable.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm text-white/40 tracking-wide">
              1 000€/mois · Zone exclusive · Brief confidentiel chaque semaine
            </p>
          </div>
        </Container>
      </section>

{/* RADAR IMMOBILIER */}
      <section className="section-divider mt-20">
        <Container>
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--jbs-yellow))]/70 mb-3">
              Outil propriétaire
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Intelligence territoriale. Décision avant le marché.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-white/60 leading-relaxed">
              Un outil de radar immobilier conçu sur-mesure — scoring de biens, analyse du marché actuel, carte thermique des opportunités. Déployable en white-label chez les agences et promoteurs.
            </p>
          </div>

          {/* 2 Cards côte à côte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Bloc 1 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">Analyse en temps réel</div>
                  <div className="text-lg font-semibold text-white">Marché actuel</div>
                  <div className="mt-2 text-sm text-white/70">
                    Annonces actives, nouvelles entrées, baisses de prix, particuliers détectés. Une lecture instantanée du territoire.
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bloc 2 */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50 mb-2">Détection algorithmique</div>
                  <div className="text-lg font-semibold text-white">Scoring d&apos;opportunités</div>
                  <div className="mt-2 text-sm text-white/70">
                    7 700+ biens scorés. Carte thermique HOT/CHAUD/NEUTRE. Top 10 opportunités du jour, CRM intégré, alertes automatiques.
                  </div>
                </div>
                <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bloc stats + phrase finale */}
          <div className="rounded-3xl border border-white/10 bg-black/30 p-8 md:p-10">
            {/* 3 stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 divide-x divide-white/10">
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-white">7 700+</div>
                <div className="mt-1 text-xs text-white/50 uppercase tracking-wide">Biens scorés</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-white">324</div>
                <div className="mt-1 text-xs text-white/50 uppercase tracking-wide">Secteurs analysés</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl md:text-3xl font-bold text-white">Score /100</div>
                <div className="mt-1 text-xs text-white/50 uppercase tracking-wide">Par bien, par IA</div>
              </div>
            </div>

            {/* Phrase finale */}
            <p className="text-center text-lg md:text-xl font-semibold text-white/90 italic">
              &ldquo;Property intelligence first.&rdquo;
            </p>
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
            <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-500 mt-4">
              <a href="/mentions-legales" className="hover:text-gray-300 transition-colors">Mentions légales</a>
              <a href="/confidentialite" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
              <a href="/cgu" className="hover:text-gray-300 transition-colors">CGU</a>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{subtitle}</div>
      <p className="mt-4 text-sm leading-relaxed text-white/70">{children}</p>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover min-h-[140px]">
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




function FeatureLine({
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
    <div className="flex min-h-[130px] items-start gap-4 border-t border-white/10 p-5 first:border-t-0">
      <div className="mt-0.5 grid h-11 w-11 flex-none place-items-center rounded-2xl bg-black/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-white/10">
        {Icon}
      </div>
      <div className="min-w-0">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/25 px-3 py-1.5">
          <span className="inline-flex h-4 w-7 items-center rounded-full bg-emerald-400/25 ring-1 ring-emerald-300/20">
            <span className="ml-[2px] h-3 w-3 rounded-full bg-emerald-200/90" />
          </span>
          <span className="truncate text-sm font-semibold">{title}</span>
        </div>
        <div className="mt-3 text-sm text-white/70">{desc}</div>
      </div>
    </div>
  );
}
