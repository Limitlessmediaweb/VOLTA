"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";

/** Lenis sincronizzato con ScrollTrigger tramite il ticker GSAP. Spento con prefers-reduced-motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (window.matchMedia(MQ.motion).matches) {
      lenis = new Lenis({ lerp: 0.11, anchors: { offset: -96 }, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // I font cambiano le misure: ricalcola i trigger quando sono pronti.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  // A ogni cambio pagina torna in cima e ricalcola.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
