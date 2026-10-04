import { Phone, Zap } from "lucide-react";
import { business, callHref } from "@/data/business";
import { Tbd } from "@/components/ui/Tbd";
import { TrackedLink } from "@/components/ui/TrackedLink";

/** Striscia di pronto intervento. */
export function Emergency() {
  return (
    <section id="pronto-intervento" aria-labelledby="pi-title" className="relative border-y border-line bg-surface">
      <div className="wrap grid gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
        <div className="flex items-center gap-4">
          <span aria-hidden className="relative inline-flex size-11 items-center justify-center rounded-full border border-alarm/60 text-alarm-text">
            <Zap className="size-5" />
            <span className="absolute inset-0 animate-ping rounded-full border border-alarm/40 [animation-duration:2.4s]" />
          </span>
          <h2 id="pi-title" className="t-h3">Pronto intervento</h2>
        </div>
        <p className="text-muted">
          Salta la corrente, quadro in blocco, scintille. <span className="text-fg">Chiama</span>: <Tbd value={business.phone} />{" "}
          <span className="whitespace-nowrap">· Orari: <Tbd value={business.emergencyHours} /></span>
        </p>
        <TrackedLink href={callHref} event="call_click" eventLabel="striscia_pronto_intervento" className="btn btn-alarm">
          <Phone aria-hidden className="size-4" />
          Chiama ora
        </TrackedLink>
      </div>
    </section>
  );
}
