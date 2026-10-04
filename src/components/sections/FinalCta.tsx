import { Phone } from "lucide-react";
import { FlickerText } from "@/components/motion/FlickerText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { callHref } from "@/data/business";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden border-t border-line">
      <ParallaxLayer speed={0.12} className="pointer-events-none absolute inset-x-0 -top-1/4 -z-10 h-[150%]">
        <div className="absolute top-1/2 left-1/2 size-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(closest-side, color-mix(in oklab, var(--light) 26%, transparent), transparent 75%)" }} />
      </ParallaxLayer>
      {/* Lampadina a tratto */}
      <svg aria-hidden viewBox="0 0 120 200" className="absolute top-[8%] left-1/2 h-[24vh] -translate-x-1/2 text-fg/50" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M60 0 V58" />
        <path d="M48 140 C 30 128 22 112 22 96 A 38 38 0 0 1 98 96 C 98 112 90 128 72 140 V152 H48 Z" />
        <path d="M50 162 H70 M53 170 H67" />
        <path d="M52 140 V110 C 52 102 58 100 60 106 C 62 112 68 102 68 110 V140" stroke="var(--light)" strokeWidth="1.8" />
      </svg>

      <div className="wrap grid justify-items-center gap-10 pt-[20vh] pb-16 text-center">
        <FlickerText as="h2" className="t-display block max-w-[12ch]">
          <span id="cta-title">Fai luce sul tuo progetto.</span>
        </FlickerText>
        <p className="t-lead text-center">Un sopralluogo, un preventivo scritto, nessuna sorpresa.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <MagneticButton>
            <TrackedLink href="/contatti#sopralluogo" eventLabel="cta_finale_sopralluogo" className="btn btn-primary">
              Richiedi un sopralluogo
            </TrackedLink>
          </MagneticButton>
          <TrackedLink href={callHref} event="call_click" eventLabel="cta_finale_chiama" className="btn btn-alarm">
            <Phone aria-hidden className="size-4" /> Chiama ora
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
