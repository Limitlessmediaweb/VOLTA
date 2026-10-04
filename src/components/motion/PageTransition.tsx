"use client";

import { ViewTransition, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Transizione tra pagine: View Transitions API tramite <ViewTransition> di React
 * (stili in globals.css). Dove l'API non esiste, fallback GSAP: dissolvenza con lieve salita.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const supported = typeof document !== "undefined" && "startViewTransition" in document;
      if (supported || !window.matchMedia(MQ.motion).matches) return;
      gsap.fromTo(ref.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "transform,opacity,visibility" });
    },
    { dependencies: [pathname] },
  );

  return (
    <ViewTransition>
      <div ref={ref}>{children}</div>
    </ViewTransition>
  );
}
