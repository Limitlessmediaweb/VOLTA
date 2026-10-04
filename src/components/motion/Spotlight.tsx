"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Cono di luce. Il contenuto base è sempre leggibile; lo strato `reveal` (decorativo, aria-hidden)
 * compare solo dentro la luce, tramite una maschera radial-gradient pilotata da variabili CSS.
 * Desktop: segue il puntatore (aggiornato in requestAnimationFrame). Mobile: scende con lo scroll.
 */
export function Spotlight({ children, reveal, className }: { children: ReactNode; reveal: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const aura = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();

    mm.add(MQ.finePointer, () => {
      let raf = 0;
      let px = 0;
      let py = 0;
      let rect = el.getBoundingClientRect();
      const ro = new ResizeObserver(() => (rect = el.getBoundingClientRect()));
      ro.observe(el);
      const ax = gsap.quickTo(aura.current, "x", { duration: 0.9, ease: "power3" });
      const ay = gsap.quickTo(aura.current, "y", { duration: 0.9, ease: "power3" });

      const paint = () => {
        raf = 0;
        el.style.setProperty("--mx", `${px}px`);
        el.style.setProperty("--my", `${py}px`);
        ax(px);
        ay(py);
      };
      const move = (e: PointerEvent) => {
        rect = el.getBoundingClientRect();
        px = e.clientX - rect.left;
        py = e.clientY - rect.top;
        el.classList.add("is-lit");
        if (!raf) raf = requestAnimationFrame(paint);
      };
      const leave = () => el.classList.remove("is-lit");
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        el.classList.remove("is-lit");
      };
    });

    // Touch / puntatore grossolano: la luce scende lungo la sezione con lo scroll.
    mm.add("(hover: none), (pointer: coarse)", () => {
      if (!window.matchMedia(MQ.motion).matches) return;
      el.classList.add("is-lit");
      const state = { p: 0 };
      const apply = () => {
        const r = el.getBoundingClientRect();
        const x = r.width * (0.5 + Math.sin(state.p * Math.PI * 1.5) * 0.28);
        const y = r.height * (0.18 + state.p * 0.7);
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        gsap.set(aura.current, { x, y });
      };
      apply();
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          state.p = self.progress;
          apply();
        },
      });
      return () => {
        st.kill();
        el.classList.remove("is-lit");
      };
    });

    return () => mm.revert();
  });

  return (
    <div ref={ref} className={cn("spot relative isolate overflow-hidden", className)}>
      <div ref={aura} className="spot-aura -z-10" aria-hidden />
      {children}
      <div className="spot-reveal absolute inset-0 z-[1]" aria-hidden>
        {reveal}
      </div>
    </div>
  );
}
