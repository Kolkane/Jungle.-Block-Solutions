"use client";

import { useMemo, useState } from "react";

type Step = 0 | 1 | 2 | 3;

const TYPES = [
  "SaaS",
  "Outil interne",
  "Automatisation",
  "IA / Agents",
  "Site vitrine premium",
  "Autre",
] as const;

const OBJECTIVES = [
  "Gagner du temps",
  "Augmenter les ventes",
  "Fiabiliser un process",
  "Mieux exploiter la data",
  "Améliorer l’expérience client",
  "Autre",
] as const;

const TIMELINES = ["Urgent", "1–3 mois", "Plus tard"] as const;

export default function ChatTicket({ recipientEmail = "fnr.vincent.pro@gmail.com" }: { recipientEmail?: string }) {
  const [step, setStep] = useState<Step>(0);
  const [type, setType] = useState<string>("");
  const [objective, setObjective] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [contact, setContact] = useState<string>("");

  const readyForContact = step >= 3;

  const ticket = useMemo(() => {
    const lines = [
      "Nouveau ticket projet — Jungle.Block Solutions",
      "",
      `Type de solution: ${type || "—"}`,
      `Objectif principal: ${objective || "—"}`,
      `Échéance idéale: ${timeline || "—"}`,
      "",
      `Contact (email ou téléphone): ${contact || "—"}`,
      "",
      "Contexte / notes (optionnel):",
      "- ",
    ];
    return lines.join("\n");
  }, [type, objective, timeline, contact]);

  function nextFrom0(v: string) {
    setType(v);
    setStep(1);
  }

  function nextFrom1(v: string) {
    setObjective(v);
    setStep(2);
  }

  function nextFrom2(v: string) {
    setTimeline(v);
    setStep(3);
  }

  const canSend = Boolean(type && objective && timeline && contact);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent("[JBS] Nouveau ticket projet");
    const body = encodeURIComponent(ticket);
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  }, [ticket, recipientEmail]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Décrivez votre besoin en 30 secondes.</div>
          <div className="mt-1 text-xs text-white/60">3 questions → ticket projet</div>
        </div>
        <button
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
          onClick={() => {
            setStep(0);
            setType("");
            setObjective("");
            setTimeline("");
            setContact("");
          }}
        >
          Réinitialiser
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <Bubble who="JBS">Quel type de solution souhaitez-vous développer ?</Bubble>

        {step === 0 ? (
          <Choices items={TYPES as unknown as string[]} onPick={nextFrom0} />
        ) : (
          <Bubble who="Vous">{type}</Bubble>
        )}

        <Bubble who="JBS">Quel est votre objectif principal ?</Bubble>
        {step === 1 ? (
          <Choices items={OBJECTIVES as unknown as string[]} onPick={nextFrom1} />
        ) : step > 1 ? (
          <Bubble who="Vous">{objective}</Bubble>
        ) : null}

        <Bubble who="JBS">Quelle échéance idéale pour avancer ?</Bubble>
        {step === 2 ? (
          <Choices items={TIMELINES as unknown as string[]} onPick={nextFrom2} />
        ) : step > 2 ? (
          <Bubble who="Vous">{timeline}</Bubble>
        ) : null}

        {readyForContact ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium">Dernière étape</div>
            <div className="mt-1 text-xs text-white/60">Entrez votre email ou votre numéro pour être recontacté au plus vite.</div>
            <input
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:ring-2 focus:ring-[hsl(var(--jbs-yellow))]/40"
              placeholder="Email ou téléphone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${
                  canSend
                    ? "bg-[hsl(var(--jbs-yellow))] text-black hover:brightness-95"
                    : "bg-white/10 text-white/40 pointer-events-none"
                }`}
                href={mailto}
              >
                Générer mon ticket projet
              </a>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => navigator.clipboard.writeText(ticket)}
              >
                Copier
              </button>
            </div>

            <div className="mt-3 text-xs text-white/50">
              En cliquant, votre ticket sera préparé par email (vous pourrez l’envoyer en 1 clic). Réponse rapide.
            </div>
          </div>
        ) : null}

        <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <summary className="cursor-pointer text-sm text-white/70">Aperçu du ticket</summary>
          <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs text-white/70">{ticket}</pre>
        </details>
      </div>
    </div>
  );
}

function Bubble({ who, children }: { who: "Vous" | "JBS"; children: React.ReactNode }) {
  const isYou = who === "Vous";
  return (
    <div className={`flex ${isYou ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          isYou
            ? "bg-[hsl(var(--jbs-blue))]/25 border border-[hsl(var(--jbs-blue))]/30"
            : "bg-white/5 border border-[hsl(var(--jbs-yellow))]/25 shadow-[0_0_0_1px_rgba(251,191,36,.08)]"
        }`}
      >
        <div className={`text-[11px] uppercase tracking-wide ${isYou ? "text-white/50" : "text-[hsl(var(--jbs-yellow))]/80"}`}>
          {who}
        </div>
        <div className="mt-0.5 font-medium">{children}</div>
      </div>
    </div>
  );
}

function Choices({ items, onPick }: { items: string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          onClick={() => onPick(it)}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
