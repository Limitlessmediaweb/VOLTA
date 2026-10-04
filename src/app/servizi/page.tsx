import { Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";
import { Emergency } from "@/components/sections/Emergency";
import { Scenes } from "@/components/sections/Scenes";
import { FinalCta } from "@/components/sections/FinalCta";
import { services } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { callHref } from "@/data/business";

export const metadata = pageMetadata({
  title: "Servizi elettrici e domotica | VOLTA",
  description: "Impianti nuovi e rifacimenti, quadri e messa in sicurezza, illuminazione su misura e domotica. Pronto intervento per guasti elettrici.",
  path: "/servizi",
});

const details: Record<string, string[]> = {
  impianti: ["Sopralluogo e rilievo", "Progetto delle linee e dei punti luce", "Posa con tracce pulite", "Collaudo e documentazione [DA VERIFICARE CON IL CLIENTE]"],
  quadri: ["Diagnosi di un quadro che scatta", "Sostituzione di protezioni datate", "Riordino ed etichettatura delle linee", "Protezione da sovratensioni"],
  illuminazione: ["Studio della luce stanza per stanza", "Scelta di temperatura colore e ottiche", "Strip LED, binari e incassi", "Luci da esterno e giardino"],
  domotica: ["Scenari luce e tapparelle", "Comando da app, voce e pulsanti", "Videocitofono e sicurezza", "Monitoraggio dei consumi"],
};

export default function ServiziPage() {
  return (
    <>
      <PageHero
        eyebrow="Servizi"
        title="Tutto ciò che porta la luce in casa."
        lead="Dal guasto improvviso al progetto completo. Un solo interlocutore, dal quadro all'ultimo punto luce."
      >
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <TrackedLink href="/contatti#sopralluogo" eventLabel="servizi_hero" className="btn btn-primary">
            Richiedi un sopralluogo
          </TrackedLink>
          <TrackedLink href={callHref} event="call_click" eventLabel="servizi_hero_chiama" className="btn btn-alarm">
            <Phone aria-hidden className="size-4" /> Guasto? Chiama ora
          </TrackedLink>
        </div>
      </PageHero>
      <Emergency />

      <div className="wrap section grid gap-6">
        {services.map((s) => (
          <Reveal as="section" key={s.slug} id={s.slug} className="grid gap-8 rounded-3xl border border-line bg-surface p-7 md:grid-cols-[auto_1fr_1fr] md:gap-12 lg:p-12">
            <ServiceIcon name={s.icon} className="size-16 text-fg" />
            <div className="grid content-start gap-4">
              <p className="t-mono text-muted">{s.code}</p>
              <h2 className="t-h3 !text-[clamp(1.4rem,2.6vw,2.2rem)]">{s.title}</h2>
              <p className="text-muted">{s.lead}</p>
            </div>
            <ul className="grid content-start gap-3 border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-10">
              {details[s.slug].map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-light" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Scenes />
      <FinalCta />
    </>
  );
}
