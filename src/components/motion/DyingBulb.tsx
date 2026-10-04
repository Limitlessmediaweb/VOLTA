"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Lampadina che sfarfalla e si spegne (404). Sfarfallii distanziati (< 3 al secondo),
 * poi resta spenta. Con reduced-motion è già spenta.
 */
export function DyingBulb() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const lit = ".bulb-lit";
        gsap.set(lit, { opacity: 1 });
        gsap
          .timeline({ delay: 0.6, defaults: { ease: "none" } })
          .to(lit, { opacity: 0.25, duration: 0.08 })
          .to(lit, { opacity: 0.9, duration: 0.1 }, "+=0.3")
          .to(lit, { opacity: 0.15, duration: 0.08 }, "+=0.4")
          .to(lit, { opacity: 0.6, duration: 0.12 }, "+=0.35")
          .to(lit, { opacity: 0, duration: 0.9, ease: "power2.in" }, "+=0.45");
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 300" className="h-auto w-40 sm:w-52" role="img" aria-label="Una lampadina spenta">
      <defs>
        <radialGradient id="db-glow">
          <stop offset="0" stopColor="var(--light)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--light)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M100 0 V70" stroke="var(--line-strong)" strokeWidth="2" />
      <circle className="bulb-lit" cx="100" cy="150" r="100" fill="url(#db-glow)" opacity="0" />
      <path d="M78 222 C 50 202 40 178 40 154 A 60 60 0 0 1 160 154 C 160 178 150 202 122 222 V240 H78 Z" fill="none" stroke="color-mix(in oklab, var(--fg) 60%, transparent)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M80 254 H120 M86 266 H114" stroke="color-mix(in oklab, var(--fg) 60%, transparent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 222 V176 C 84 166 92 162 96 172 C 100 182 108 166 112 172 C 116 178 116 170 116 176 V222" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
      <path className="bulb-lit" d="M84 222 V176 C 84 166 92 162 96 172 C 100 182 108 166 112 172 C 116 178 116 170 116 176 V222" fill="none" stroke="var(--light)" strokeWidth="2.6" strokeLinecap="round" opacity="0" />
    </svg>
  );
}
