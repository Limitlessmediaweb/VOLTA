"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip, MQ } from "@/lib/gsap";
import { scenes, type SceneId } from "@/data/content";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SUN = "M520 92 C520 105.255 509.255 116 496 116 C482.745 116 472 105.255 472 92 C472 78.745 482.745 68 496 68 C509.255 68 520 78.745 520 92 Z";
const MOON = "M508 70 C496 74 488 84 488 96 C488 106 494 114 502 118 C488 118 472 106 472 92 C472 78 484 66 498 66 C502 66 505 68 508 70 Z";

/** Scenari luce interattivi: una stanza in SVG cambia colore e intensità. */
export function Scenes() {
  const [sceneId, setSceneId] = useState<SceneId>("cena");
  const scene = scenes.find((s) => s.id === sceneId)!;
  const [intensity, setIntensity] = useState(scene.intensity);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const astro = useRef<SVGPathElement>(null);
  const first = useRef(true);

  const choose = (id: SceneId) => {
    if (id === sceneId) return;
    flipState.current = Flip.getState("[data-flip-id='scene-ind']");
    const next = scenes.find((s) => s.id === id)!;
    setSceneId(id);
    setIntensity(next.intensity);
    track("scene_change", { scene: id });
  };

  useLayoutEffect(() => {
    const night = sceneId === "film" || sceneId === "notte";
    const reduce = !window.matchMedia(MQ.motion).matches;
    if (first.current) {
      first.current = false;
      if (astro.current) astro.current.setAttribute("d", night ? MOON : SUN);
      return;
    }
    if (flipState.current && !reduce) {
      Flip.from(flipState.current, { duration: 0.55, ease: "expo.out" });
    }
    flipState.current = null;
    gsap.to(astro.current, { morphSVG: night ? MOON : SUN, duration: reduce ? 0 : 0.9, ease: "power3.inOut" });
  }, [sceneId]);

  const k = intensity / 100;
  const vars = { "--scene": scene.color } as React.CSSProperties;
  const t = "transition-[opacity,fill] duration-700";

  return (
    <section aria-labelledby="scene-title" className="section relative">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-20">
        <div className="grid gap-8">
          <div className="grid gap-4">
            <p className="t-mono text-light-text">Scenari luce</p>
            <h2 id="scene-title" className="t-h2 max-w-[12ch]">
              Una stanza, quattro atmosfere.
            </h2>
            <p className="t-lead">Prova tu. Ogni scenario è un tasto sul muro o sul telefono.</p>
          </div>

          <div role="group" aria-label="Scegli uno scenario" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {scenes.map((s) => {
              const active = s.id === sceneId;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(s.id)}
                  className={cn(
                    "relative isolate min-h-12 rounded-full border px-4 text-sm font-bold transition-colors",
                    active ? "border-light text-[#0A0908]" : "border-line-strong text-fg hover:border-light",
                  )}
                >
                  {active && (
                    <span
                      data-flip-id="scene-ind"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ background: "radial-gradient(120% 140% at 50% 0%, #fff3cf, #FFC857 60%)" }}
                    />
                  )}
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="scene-intensity" className="t-mono text-muted">
                Intensità
              </label>
              <output htmlFor="scene-intensity" className="t-mono tabular-nums text-fg">
                {intensity}%
              </output>
            </div>
            <input
              id="scene-intensity"
              type="range"
              min={0}
              max={100}
              step={1}
              value={intensity}
              aria-valuetext={`${intensity} per cento`}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="h-11 w-full cursor-pointer accent-[var(--light)]"
            />
          </div>

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-6 text-sm" aria-live="polite">
            <dt className="t-mono text-muted">Scenario</dt>
            <dd className="font-semibold">{scene.label}</dd>
            <dt className="t-mono text-muted">Temperatura</dt>
            <dd className="font-mono">{scene.kelvin}</dd>
            <dt className="t-mono text-muted">Effetto</dt>
            <dd className="text-muted">{scene.description}</dd>
          </dl>
          <p className="t-mono text-muted">Valori indicativi · Dati dimostrativi</p>
        </div>

        {/* Stanza SVG */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface" style={vars}>
          <svg viewBox="0 0 600 420" className="h-auto w-full" role="img" aria-label={`Soggiorno con scenario ${scene.label}: ${scene.description}`}>
            <defs>
              <radialGradient id="sc-ceiling" cx="0.5" cy="0" r="0.9">
                <stop offset="0" style={{ stopColor: "var(--scene)" }} stopOpacity="0.8" />
                <stop offset="1" style={{ stopColor: "var(--scene)" }} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sc-spot" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" style={{ stopColor: "var(--scene)" }} stopOpacity="0.9" />
                <stop offset="1" style={{ stopColor: "var(--scene)" }} stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sc-tv" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#7FA8FF" stopOpacity="0.55" />
                <stop offset="1" stopColor="#7FA8FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="420" fill="var(--room-off)" />
            {/* finestra */}
            <rect x="440" y="44" width="112" height="128" rx="4" className={t} style={{ fill: scene.sky }} />
            <path ref={astro} d={SUN} fill="#FFF1D6" opacity="0.9" />
            <path d="M496 44 V172 M440 108 H552" stroke="var(--line-strong)" />
            {/* luce ambiente */}
            <rect width="600" height="420" fill="url(#sc-ceiling)" className={t} style={{ opacity: scene.ceiling * k }} />
            <path d="M300 0 V26 M262 26 H338" stroke="var(--line-strong)" strokeWidth="2" />
            <rect x="262" y="24" width="76" height="5" rx="2" style={{ fill: "var(--scene)", opacity: 0.25 + scene.ceiling * k * 0.75 }} className={t} />
            {/* lampada da tavolo / sospensione */}
            <circle cx="150" cy="210" r="150" fill="url(#sc-spot)" className={t} style={{ opacity: scene.lamp * k }} />
            <path d="M150 0 V170" stroke="var(--line-strong)" />
            <path d="M120 186 H180 L168 168 H132 Z" style={{ fill: "var(--scene)", opacity: 0.3 + scene.lamp * k * 0.7 }} className={t} />
            {/* tavolo */}
            <path d="M70 300 H230 M90 300 V360 M210 300 V360" stroke="color-mix(in oklab, var(--fg) 55%, transparent)" strokeWidth="2" fill="none" />
            {/* tv */}
            <circle cx="380" cy="250" r="140" fill="url(#sc-tv)" className={t} style={{ opacity: scene.tv * Math.max(k, 0.4) }} />
            <rect x="320" y="210" width="120" height="72" rx="4" stroke="color-mix(in oklab, var(--fg) 55%, transparent)" fill="#0b0d14" />
            <rect x="326" y="216" width="108" height="60" fill="#7FA8FF" className={t} style={{ opacity: scene.tv * 0.5 }} />
            {/* divano */}
            <path d="M300 380 V330 H560 V380 M300 330 V308 H560 V330" stroke="color-mix(in oklab, var(--fg) 55%, transparent)" strokeWidth="2" fill="none" />
            {/* luce a terra notturna */}
            <rect x="0" y="404" width="600" height="16" style={{ fill: "var(--scene)", opacity: sceneId === "notte" ? 0.35 + k : 0 }} className={t} />
            <path d="M0 404 H600" stroke="var(--line-strong)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
