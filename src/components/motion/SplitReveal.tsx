"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "./introSignal";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "load": parte subito (dopo l'intro); "scroll": quando entra nel viewport. */
  trigger?: "load" | "scroll";
  delay?: number;
  id?: string;
};

/** Titolo che sale riga per riga da una maschera (SplitText). */
export function SplitReveal({ as: Tag = "h2", children, className, trigger = "scroll", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let off: (() => void) | undefined;
        const split = SplitText.create(el, {
          type: "lines,words",
          // Titoli "load" (h1): niente maschera e opacità minima > 0, così il testo resta dipinto
          // e conta subito come LCP anche mentre l'intro lo copre.
          mask: trigger === "scroll" ? "lines" : undefined,
          autoSplit: true,
          onSplit(self) {
            const from =
              trigger === "scroll"
                ? { yPercent: 115, rotate: 4 }
                : { yPercent: 40, opacity: 0.02 };
            const tween = gsap.from(self.words, {
              ...from,
              duration: 1.1,
              stagger: 0.06,
              ease: "expo.out",
              delay,
              paused: true,
            });
            if (trigger === "scroll") {
              ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tween.play() });
            } else {
              off?.();
              off = onIntroDone(() => tween.play());
            }
            return tween;
          },
        });
        el.dataset.animReady = "";
        return () => {
          off?.();
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-anim={trigger === "load" ? "lcp" : ""} className={cn(className)}>
      {children}
    </Tag>
  );
}
