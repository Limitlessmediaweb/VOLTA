import { Mail, Phone } from "lucide-react";
import { business, callHref } from "@/data/business";
import { QuoteForm } from "@/components/ui/QuoteForm";
import { ZoneMap } from "@/components/ui/ZoneMap";
import { Tbd } from "@/components/ui/Tbd";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function Contact({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Sub = headingLevel === "h1" ? "h2" : "h3";
  return (
    <section id="sopralluogo" aria-labelledby="contatti-title" className="section">
      <div className="wrap grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div className="grid content-start gap-8">
          <div className="grid gap-4">
            <p className="t-mono text-light-text">Sopralluogo</p>
            <SplitReveal as={headingLevel} id="contatti-title" className="t-h2 max-w-[14ch]">
              Raccontaci il tuo progetto.
            </SplitReveal>
            <p className="t-lead">Ti richiamiamo per fissare un sopralluogo. Per un guasto, chiama subito.</p>
          </div>
          <QuoteForm />
        </div>

        <aside className="grid content-start gap-10" aria-label="Recapiti e orari">
          <div id="telefono" className="grid gap-4 rounded-3xl border border-line p-7">
            <p className="t-mono text-muted">Telefono</p>
            <p className="t-h3">
              <Tbd value={business.phone} />
            </p>
            <TrackedLink href={callHref} event="call_click" eventLabel="contatti" className="btn btn-alarm justify-self-start">
              <Phone aria-hidden className="size-4" /> Chiama ora
            </TrackedLink>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Mail aria-hidden className="size-4" /> <Tbd value={business.email} />
            </p>
          </div>

          <div className="grid gap-3">
            <Sub className="t-mono text-muted">Orari</Sub>
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
              {business.hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="font-semibold">{h.days}</dt>
                  <dd>
                    <Tbd value={h.time} />
                  </dd>
                </div>
              ))}
              <dt className="font-semibold">Pronto intervento</dt>
              <dd>
                <Tbd value={business.emergencyHours} />
              </dd>
            </dl>
          </div>

          <ZoneMap />
        </aside>
      </div>
    </section>
  );
}
