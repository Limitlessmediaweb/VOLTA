"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  header: ReactNode;
  /** Elemento fisso accanto/sopra la traccia; riceve l'indice della scheda attiva (-1 = tutte). */
  aside: (active: number) => ReactNode;
  item: (index: number, active: number) => ReactNode;
  label: string;
};

/**
 * Sezione fissata in cui la traccia di schede scorre in orizzontale mentre si scorre in verticale.
 * Reduced-motion / senza JS: scorrimento orizzontale nativo con scroll-snap, nessun pin.
 */
export function HorizontalScroll({ count, header, aside, item, label }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const [enhanced, setEnhanced] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      setEnhanced(true);
      setActive(0);
      const t = track.current!;
      const distance = () => Math.max(0, t.scrollWidth - t.clientWidth);
      let last = 0;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(count - 1, Math.round(self.progress * (count - 1)));
            if (i !== last) {
              last = i;
              setActive(i);
            }
          },
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(t, { clearProps: "transform" });
        setEnhanced(false);
        setActive(-1);
      };
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} aria-label={label} className={cn("relative overflow-hidden", enhanced && "h-svh")}>
      <div className={cn("wrap grid h-full gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14", enhanced ? "content-center pt-24 pb-24 lg:py-0" : "py-24")}>
        <div className="grid gap-6">
          {header}
          <div className="mx-auto w-full max-w-[200px] sm:max-w-[280px] lg:max-w-[360px]">{aside(active)}</div>
        </div>
        <div className={cn("min-w-0", enhanced && "overflow-hidden")}>
        <ol
          ref={track}
          className={cn(
            "flex gap-4 will-change-transform",
            !enhanced && "snap-x snap-mandatory overflow-x-auto pb-4",
          )}
        >
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className="w-[78vw] max-w-[380px] shrink-0 snap-start lg:w-[340px]">
              {item(i, active)}
            </li>
          ))}
          <li aria-hidden className="w-[10vw] shrink-0" />
        </ol>
        </div>
      </div>
    </section>
  );
}
