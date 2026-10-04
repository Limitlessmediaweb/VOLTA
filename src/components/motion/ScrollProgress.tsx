"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Un filamento in cima alla pagina che si accende man mano che scorri. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(bar.current, { scaleX: 0 });
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div
        ref={bar}
        className="h-full origin-left bg-light shadow-[0_0_12px_var(--light)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
