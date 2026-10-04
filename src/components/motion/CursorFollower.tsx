"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Piccolo alone che segue il puntatore fine. Si allarga sugli elementi interattivi. */
export function CursorFollower() {
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.finePointer, () => {
      const el = dot.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
      let shown = false;
      const move = (e: PointerEvent) => {
        if (!shown) {
          gsap.set(el, { x: e.clientX, y: e.clientY });
          gsap.to(el, { autoAlpha: 1, duration: 0.3 });
          shown = true;
        }
        x(e.clientX);
        y(e.clientY);
        const interactive = (e.target as Element | null)?.closest?.("a, button, input, select, textarea, label, [role='slider']");
        gsap.to(el, { scale: interactive ? 2.2 : 1, duration: 0.35, overwrite: "auto" });
      };
      const leave = () => {
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
        shown = false;
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden size-5 rounded-full opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{
        background: "radial-gradient(circle, color-mix(in oklab, var(--light) 70%, transparent) 0%, color-mix(in oklab, var(--light) 18%, transparent) 55%, transparent 72%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
