import { Phone } from "lucide-react";
import { Spotlight } from "@/components/motion/Spotlight";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { callHref } from "@/data/business";

/** Strato rivelato dal cono di luce: progetto elettrico "nascosto" nel buio. Decorativo. */
function Blueprint() {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" fill="none">
        <defs>
          <pattern id="bp-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0 H0 V48" stroke="var(--light)" strokeOpacity="0.16" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#bp-grid)" />
        <g stroke="var(--light)" strokeWidth="1.4" strokeOpacity="0.85">
          <path d="M120 700 H520 V420 H860 V240 H1320" strokeDasharray="6 8" />
          <path d="M240 160 V420 H520" />
          <path d="M980 700 V520 H1200 V820" strokeDasharray="2 6" />
          <circle cx="520" cy="420" r="6" fill="var(--light)" />
          <circle cx="860" cy="240" r="6" fill="var(--light)" />
          <circle cx="980" cy="520" r="6" fill="var(--light)" />
          <path d="M1290 225 l15 15 m0 -15 l-15 15" />
          <path d="M228 148 h24 v24 h-24 z" />
          <circle cx="1200" cy="820" r="18" />
          <path d="M1188 820 h24 M1200 808 v24" />
        </g>
        <g fill="var(--light)" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="2">
          <text x="534" y="410">L1 · LUCI ZONA GIORNO</text>
          <text x="874" y="230">L2 · PRESE CUCINA 16A</text>
          <text x="994" y="510">L3 · GIARDINO IP65</text>
          <text x="262" y="150">QE · QUADRO GENERALE</text>
          <text x="1110" y="860">230 V · 50 Hz</text>
          <text x="130" y="690">2700 K → 4000 K</text>
        </g>
      </svg>
      <p className="t-display absolute right-[-2vw] bottom-[6vh] text-transparent select-none [-webkit-text-stroke:1px_var(--light)] opacity-70">Volta</p>
    </div>
  );
}

export function Hero() {
  return (
    <Spotlight reveal={<Blueprint />} className="min-h-[100svh]">
      {/* Penombra di base: un alone fisso molto tenue, sempre visibile */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(60% 50% at 70% 10%, color-mix(in oklab, var(--light) 9%, transparent), transparent 70%)" }} />

      <div className="wrap relative z-[2] flex min-h-[100svh] flex-col justify-end pt-36 pb-32 lg:justify-center lg:pt-40 lg:pb-24">
        <p className="t-mono mb-6 text-muted">
          <span aria-hidden className="mr-3 inline-block size-1.5 translate-y-[-2px] rounded-full bg-light shadow-[0_0_10px_var(--light)]" />
          Impianti elettrici · Luce · Domotica
        </p>

        <SplitReveal as="h1" trigger="load" className="t-display max-w-[13ch]">
          Accendi la casa che hai in mente.
        </SplitReveal>

        <p className="t-lead mt-8 text-fg/80">
          Impianti, luci su misura e domotica per case e locali di pregio. Progettati con calma, realizzati con precisione.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <MagneticButton>
            <TrackedLink href="/contatti#sopralluogo" eventLabel="hero_sopralluogo" className="btn btn-primary w-full sm:w-auto">
              Richiedi un sopralluogo
            </TrackedLink>
          </MagneticButton>
          <TrackedLink href={callHref} event="call_click" eventLabel="hero_guasto" className="btn btn-alarm">
            <Phone aria-hidden className="size-4" />
            Guasto? Chiama ora
          </TrackedLink>
        </div>

        <p className="t-mono mt-14 hidden text-muted lg:block" aria-hidden>
          Muovi il puntatore: c&apos;è un progetto nel buio
        </p>
      </div>
    </Spotlight>
  );
}
