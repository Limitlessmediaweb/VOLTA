"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Codici e numeri che si "decodificano" entrando nel viewport (ScrambleText). */
export function ScrambleText({ text, className, chars = "0123456789VAKΩ·/" }: { text: string; className?: string; chars?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(el, { duration: 1.2, scrambleText: { text, chars, speed: 0.6, revealDelay: 0.2 }, ease: "none" }),
      });
    });
    return () => mm.revert();
  });

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </span>
  );
}
