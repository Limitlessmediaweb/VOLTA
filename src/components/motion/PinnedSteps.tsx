"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  /** active = -1 quando la sezione non è "potenziata" (senza JS o reduced-motion): mostrare tutto. */
  visual: (active: number) => ReactNode;
  step: (index: number, active: number) => ReactNode;
  header?: ReactNode;
  className?: string;
  label: string;
};

/**
 * Sezione fissata a passi. Con lo scroll avanza un indice attivo; ogni passo occupa ~80% di viewport.
 * Senza JS o con reduced-motion i passi diventano una lista normale e la visual mostra lo stato finale.
 */
export function PinnedSteps({ count, visual, step, header, className, label }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [enhanced, setEnhanced] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      setEnhanced(true);
      setActive(0);
      let last = 0;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${count * window.innerHeight * 0.8}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(count - 1, Math.floor(self.progress * count));
          if (i !== last) {
            last = i;
            setActive(i);
          }
        },
      });
      return () => {
        st.kill();
        setEnhanced(false);
        setActive(-1);
      };
    });
    return () => mm.revert();
  });

  return (
    <section
      ref={root}
      aria-label={label}
      className={cn("relative", enhanced && "is-enhanced h-svh overflow-hidden", className)}
    >
      <div className={cn("wrap grid h-full gap-8 lg:grid-cols-[1fr_1.45fr] lg:items-center lg:gap-16", enhanced ? "grid-rows-[auto_1fr] pt-28 pb-24 lg:grid-rows-1 lg:py-0" : "py-24")}>
        <div className="relative lg:order-2">{visual(active)}</div>
        <div className="flex min-h-0 flex-col justify-center gap-8 lg:order-1">
          {header}
          <ol className="steps-stack">
            {Array.from({ length: count }, (_, i) => (
              <li
                key={i}
                aria-current={enhanced && active === i ? "step" : undefined}
                className={cn(
                  "transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                  enhanced && (active === i ? "translate-y-0 opacity-100" : active > i ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"),
                )}
              >
                {step(i, active)}
              </li>
            ))}
          </ol>
          {enhanced && (
            <div aria-hidden className="flex gap-2">
              {Array.from({ length: count }, (_, i) => (
                <span key={i} className="relative h-[2px] flex-1 overflow-hidden rounded bg-line-strong">
                  <span
                    className="absolute inset-0 origin-left bg-light shadow-[0_0_8px_var(--light)] transition-transform duration-700"
                    style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
