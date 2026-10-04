import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { TiltCard } from "@/components/motion/TiltCard";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function Services({ headingLevel = "h2" }: { headingLevel?: "h2" | "h1" }) {
  return (
    <section aria-labelledby="servizi-title" className="section">
      <div className="wrap">
        <div className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4">
            <p className="t-mono text-light-text">Servizi</p>
            <SplitReveal as={headingLevel} id="servizi-title" className="t-h2 max-w-[16ch]">
              Quattro mestieri, una sola mano.
            </SplitReveal>
          </div>
          <TrackedLink href="/servizi" eventLabel="servizi_tutti" className="btn btn-ghost justify-self-start">
            Scopri tutti i servizi <ArrowUpRight aria-hidden className="size-4" />
          </TrackedLink>
        </div>

        <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <TiltCard className="h-full rounded-3xl border border-line bg-surface">
                <article className="relative flex h-full flex-col gap-6 p-7 lg:p-10">
                  <div className="flex items-start justify-between">
                    <ServiceIcon name={s.icon} className="size-14 text-fg" />
                    <ScrambleText text={s.code} className="t-mono text-muted" />
                  </div>
                  <h3 className="t-h3">{s.title}</h3>
                  <p className="text-muted">{s.lead}</p>
                  <ul className="mt-auto grid gap-2 border-t border-line pt-5 text-sm">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-light" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </TiltCard>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
