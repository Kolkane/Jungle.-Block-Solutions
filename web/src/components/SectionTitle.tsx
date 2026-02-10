export function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.18em] text-white/50">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {desc ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{desc}</p> : null}
    </div>
  );
}
