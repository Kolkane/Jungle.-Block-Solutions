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
      <section id="process" className="mt-20 scroll-mt-24">
        <Container>
          <SectionTitle
            eyebrow="Méthode"
            title="Process de travail"
            desc="4 étapes, du cadrage à la livraison. Exécution rapide, décisions claires."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StepCard
              n="01"
              title="Exploration (20 minutes)"
              desc="Clarification du besoin + cadrage + estimation."
            />
            <StepCard n="02" title="Prototype (72h → 7 jours)" desc="Version interactive pour valider la direction." />
            <StepCard
              n="03"
              title="Build (MVP → produit complet)"
              desc="UI/UX, base de données, IA, intégrations, production."
            />
            <StepCard n="04" title="Livraison + itérations" desc="Tests, debug, optimisation, handover GitHub." />
          </div>
        </Container>
      </section></Reveal>

      <Reveal delayMs={160}>{/* WHY */}
      <section className="mt-20">
        <Container>
          <SectionTitle eyebrow="Différence" title="Pourquoi Jungle.Block Solutions ?" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "Vision produit + stratégie, pas juste du code",
              "Développement rapide & propre",
              "Capacité à livrer de l’idée au produit",
              "Spécialiste UI/UX premium",
              "Exécution orientée ROI & industrialisation",
              "Expertise multi-projets (SaaS, IA, outils internes)",
            ].map((p) => (
              <div key={p} className="rounded-3xl border border-white/10 bg-white/5 p-5 glass-hover">
                <div className="text-sm font-semibold">{p}</div>
              </div>
            ))}
          </div>
        </Container>
      </section></Reveal>

      <Reveal delayMs={180}>{/* CONTACT */}
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

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  const icon =
    n === "01" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path d="M12 7v5l3 2" />
      </svg>
    ) : n === "02" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    ) : n === "03" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16" />
        <path d="M7 16V7h10v9" />
        <path d="M9 10h6" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 7l-9 9-4-4" />
        <path d="M4 4h16v16H4z" />
      </svg>
    );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass-hover">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/50">Étape {n}</div>
          <div className="mt-2 text-lg font-semibold">{title}</div>
          <div className="mt-2 text-sm text-white/70">{desc}</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[hsl(var(--jbs-blue))]/20 text-[hsl(var(--jbs-yellow))] ring-1 ring-[hsl(var(--jbs-blue))]/30">
          {icon}
        </div>
      </div>
    </div>
  );
}
