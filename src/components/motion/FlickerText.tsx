"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Accensione "a neon", una sola volta.
 * Sicurezza fotosensibile: 3 sfarfallii distanziati >= 350 ms (meno di 3 lampi al secondo),
 * con variazioni di opacità contenute.
 */
export function FlickerText({ as: Tag = "span", children, className }: { as?: ElementType; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.set(el, { opacity: 0.18 })
        .to(el, { opacity: 0.75, duration: 0.08 })
        .to(el, { opacity: 0.3, duration: 0.1 }, "+=0.25")
        .to(el, { opacity: 0.85, duration: 0.08 }, "+=0.27")
        .to(el, { opacity: 0.45, duration: 0.1 }, "+=0.2")
        .to(el, { opacity: 1, duration: 0.5, ease: "power2.out" }, "+=0.28")
        .fromTo(el, { textShadow: "0 0 0px transparent" }, { textShadow: "0 0 28px var(--glow)", duration: 0.8 }, "<");
      gsap.set(el, { opacity: 0.18 });
      el.dataset.animReady = "";
      const st = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", once: true, onEnter: () => tl.play() } });
      return () => {
        st.kill();
        tl.kill();
      };
    });
    return () => mm.revert();
  });

  return (
    <Tag ref={ref} data-anim className={cn(className)}>
      {children}
    </Tag>
  );
}
