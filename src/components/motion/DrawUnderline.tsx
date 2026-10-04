"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "./introSignal";

/** Parola con sottolineatura a filamento disegnata con DrawSVG. */
export function DrawUnderline({ children, onLoad = false }: { children: ReactNode; onLoad?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tween = gsap.from("path", {
          drawSVG: "0%",
          duration: 1.4,
          ease: "power2.inOut",
          delay: onLoad ? 1.1 : 0.2,
          paused: onLoad,
          scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: "top 85%", once: true },
        });
        if (onLoad) return onIntroDone(() => tween.play());
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.28em] w-full overflow-visible">
        <path
          d="M2 12 C 50 4, 90 18, 150 10 S 250 4, 298 11"
          fill="none"
          stroke="var(--light)"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 6px var(--light))" }}
        />
      </svg>
    </span>
  );
}
