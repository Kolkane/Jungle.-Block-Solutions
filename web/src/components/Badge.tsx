export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--jbs-yellow))] shadow-[0_0_20px_rgba(251,191,36,.55)]" />
      {children}
    </span>
  );
}
