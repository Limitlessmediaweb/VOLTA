"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Logo } from "@/components/ui/Logo";
import { markIntroDone } from "./introSignal";

const WIRE = "M540 300 H820 V470 H180 V250 L500 90 L820 250 V360 H500 V300";

/**
 * Intro "interruttore → filo → casa → lampadina → VOLTA" (~4,6 s), una volta per sessione.
 * È mostrata solo se lo script inline in <head> ha impostato html[data-intro="1"]:
 * l'hero è già renderizzato sotto, quindi non blocca l'LCP. Failsafe CSS dopo 7 s.
 * Con prefers-reduced-motion: semplice dissolvenza di 0,3 s.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.dataset.intro !== "1") return;
      const el = root.current!;

      const finish = () => {
        try {
          sessionStorage.setItem("volta-intro", "1");
        } catch {}
        delete html.dataset.intro;
        markIntroDone();
      };

      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(el.querySelectorAll("[data-i]"), { autoAlpha: 0 });
        gsap.set("[data-i='logo']", { autoAlpha: 1 });
        gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.3, onComplete: finish });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "power2.inOut" } });
      const skip = () => tl.progress(1);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
      window.addEventListener("keydown", onKey);
      el.querySelector<HTMLButtonElement>("[data-skip]")?.addEventListener("click", skip);

      gsap.set("[data-i='lever']", { rotationX: -32, transformPerspective: 220 });
      gsap.set("[data-i='wire']", { drawSVG: "0% 0%" });
      gsap.set("[data-i='glow']", { scale: 0, autoAlpha: 0 });
      gsap.set("[data-i='point']", { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set("[data-i='logo'] [data-logo='letters'] path, [data-i='logo'] [data-logo='bulb'] path", { drawSVG: "0%" });
      gsap.set("[data-i='logo'] [data-logo='filament']", { drawSVG: "0%" });
      gsap.set("[data-i='logo']", { autoAlpha: 1 });

      tl
        // 1. l'interruttore compare
        .fromTo("[data-i='switch']", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" }, 0.1)
        // 2. clic della levetta (3D leggero) e partenza del filo
        .to("[data-i='lever']", { rotationX: 32, duration: 0.14, ease: "back.out(3)" }, 0.7)
        .fromTo("[data-i='switch']", { x: 0 }, { x: 2, duration: 0.05, repeat: 1, yoyo: true }, 0.72)
        .to("[data-i='wire']", { drawSVG: "0% 18%", duration: 0.65, ease: "power1.in" }, 0.75)
        // 3. il filo disegna la casa, poi si ritrae in un punto
        .to("[data-i='switch']", { autoAlpha: 0, scale: 0.9, duration: 0.5 }, 1.5)
        .to("[data-i='wire']", { drawSVG: "0% 100%", duration: 1.0, ease: "power1.inOut" }, 1.4)
        .to("[data-i='wire']", { drawSVG: "100% 100%", duration: 0.4, ease: "power2.in" }, 2.4)
        .to("[data-i='point']", { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, 2.6)
        // 4. la lampadina si accende e il filamento forma VOLTA
        .to("[data-i='glow']", { autoAlpha: 1, scale: 1, duration: 1, ease: "expo.out" }, 2.8)
        .to("[data-i='point']", { autoAlpha: 0, duration: 0.4 }, 2.9)
        .to("[data-i='logo'] [data-logo='bulb'] path", { drawSVG: "100%", duration: 0.6, ease: "power2.out" }, 2.85)
        .to("[data-i='logo'] [data-logo='filament']", { drawSVG: "100%", duration: 0.5 }, 3.0)
        .to("[data-i='logo'] [data-logo='letters'] path", { drawSVG: "100%", duration: 0.6, stagger: 0.07, ease: "power2.out" }, 3.05)
        // 5. flash morbido e rivelazione dell'hero (un solo lampo)
        .to("[data-i='flash']", { autoAlpha: 0.9, duration: 0.35, ease: "power2.in" }, 3.8)
        .to(el, { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 4.15);

      return () => {
        window.removeEventListener("keydown", onKey);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="intro fixed inset-0 z-[100] overflow-hidden bg-[#0A0908] text-[#FFF6E5]" role="region" aria-label="Animazione di apertura">
      <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="intro-dot">
            <stop offset="0" stopColor="#FFF3CF" />
            <stop offset="0.4" stopColor="#FFC857" />
            <stop offset="1" stopColor="#FFC857" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path data-i="wire" d={WIRE} fill="none" stroke="#FFC857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px #FFC857)" }} />
        <circle data-i="point" cx="500" cy="300" r="14" fill="url(#intro-dot)" />
      </svg>

      {/* Interruttore a levetta (HTML per la rotazione 3D) */}
      <div data-i="switch" className="absolute top-1/2 left-1/2 -mt-[44px] -ml-[30px] h-[88px] w-[60px] rounded-[10px] border border-[#FFF6E5]/30 bg-[#141210] opacity-0 [perspective:300px]">
        <div className="absolute inset-[14px] rounded-[6px] border border-[#FFF6E5]/15 bg-[#0A0908]" />
        <div
          data-i="lever"
          className="absolute top-[22px] left-1/2 -ml-[9px] h-[44px] w-[18px] rounded-[5px] bg-gradient-to-b from-[#FFF6E5] to-[#b8ad9b]"
          style={{ transform: "rotateX(-32deg)", transformOrigin: "50% 50%" }}
        />
      </div>

      <div data-i="glow" className="absolute top-1/2 left-1/2 -mt-[45vmin] -ml-[45vmin] size-[90vmin] rounded-full opacity-0" style={{ background: "radial-gradient(closest-side, rgb(255 200 87 / 0.55), rgb(255 200 87 / 0.12) 55%, transparent)" }} />

      <div data-i="logo" className="absolute inset-0 flex items-center justify-center opacity-0">
        <Logo className="w-[min(64vw,380px)] drop-shadow-[0_0_18px_rgb(255_200_87/0.6)]" idPrefix="intro" />
      </div>

      <div data-i="flash" className="pointer-events-none absolute inset-0 opacity-0" style={{ background: "radial-gradient(circle at 50% 50%, #FFF6E5, #FFE3A3 60%, #FFC857)" }} />

      <button
        type="button"
        data-skip
        className="absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-10 inline-flex min-h-11 items-center rounded-full border border-[#FFF6E5]/30 px-5 font-mono text-xs tracking-[0.14em] text-[#FFF6E5] uppercase hover:border-[#FFC857] sm:right-8 sm:bottom-8"
      >
        Salta
      </button>
    </div>
  );
}
