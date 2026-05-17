"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HeroBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Animated grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Soft glow halos */}
      <motion.div
        className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsla(218, 88%, 54%, 0.28) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute right-[-10%] top-40 h-[360px] w-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsla(45, 93%, 58%, 0.18) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Slow scanning beam */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsla(218, 88%, 64%, 0.55), transparent)",
            top: "30%",
          }}
          initial={{ x: "-30%", opacity: 0 }}
          animate={{ x: "60%", opacity: [0, 1, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
        />
      )}
    </div>
  );
}
