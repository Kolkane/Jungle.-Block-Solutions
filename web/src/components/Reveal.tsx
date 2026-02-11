"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delayMs = 0 }: { children: React.ReactNode; delayMs?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition duration-700 ease-out will-change-transform ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
