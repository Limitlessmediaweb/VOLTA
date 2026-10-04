import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";

/** Testata delle pagine interne: una sola h1, alone fisso tenue. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "radial-gradient(50% 70% at 80% 0%, color-mix(in oklab, var(--light) 14%, transparent), transparent 70%)" }} />
      <div className="wrap grid gap-6 pt-40 pb-16 lg:pt-52 lg:pb-24">
        <p className="t-mono text-light-text">{eyebrow}</p>
        <SplitReveal as="h1" trigger="load" className="t-h1 max-w-[16ch]">
          {title}
        </SplitReveal>
        {lead && <div className="t-lead">{lead}</div>}
        {children}
      </div>
    </section>
  );
}
