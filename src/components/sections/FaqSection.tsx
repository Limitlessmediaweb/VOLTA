import { ArrowUpRight } from "lucide-react";
import { faqs } from "@/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section aria-labelledby="faq-title" className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="grid content-start gap-5 lg:sticky lg:top-32">
          <p className="t-mono text-light-text">Domande frequenti</p>
          <SplitReveal id="faq-title" className="t-h2 max-w-[12ch]">
            Risposte chiare.
          </SplitReveal>
          <p className="t-lead">Le domande che ci fanno più spesso, prima di chiamarci.</p>
          {limit && (
            <TrackedLink href="/faq" eventLabel="faq_tutte" className="btn btn-ghost justify-self-start">
              Tutte le domande <ArrowUpRight aria-hidden className="size-4" />
            </TrackedLink>
          )}
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
