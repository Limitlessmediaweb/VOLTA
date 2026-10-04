"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Strato che scorre a velocità diversa (speed: frazione dell'altezza viewport). */
export function ParallaxLayer({ children, speed = 0.15, className }: { children?: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        ref.current,
        { yPercent: -speed * 100 },
        { yPercent: speed * 100, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} aria-hidden className={className}>
      {children}
    </div>
  );
}
