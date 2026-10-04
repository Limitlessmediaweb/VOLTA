import { PageHero } from "@/components/ui/PageHero";
import { Commitments } from "@/components/sections/Commitments";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/motion/Reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Chi siamo | VOLTA",
  description: "Chi c'è dietro VOLTA: il modo in cui lavoriamo, cosa ci sta a cuore e la zona in cui operiamo. Pagina in preparazione.",
  path: "/chi-siamo",
});

const blocks = [
  { title: "La nostra storia", text: "Come e quando è nata l'attività, chi la guida." },
  { title: "Il team", text: "Persone, ruoli e competenze. Nessun nome inventato: da fornire dal cliente." },
  { title: "Formazione e abilitazioni", text: "Qualifiche e abilitazioni reali dell'impresa." },
  { title: "Fornitori e marchi", text: "Marchi con cui si lavora abitualmente per luci e domotica." },
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title="Persone che lavorano con la luce."
        lead={<>Questa pagina è una struttura: i contenuti arriveranno dal cliente reale. <span className="tbd">[DA COMPLETARE]</span></>}
      />
      <section aria-label="Struttura della pagina" className="wrap section grid gap-4 md:grid-cols-2">
        {blocks.map((b) => (
          <Reveal key={b.title} className="grid gap-4 rounded-3xl border border-dashed border-line-strong p-8">
            <h2 className="t-h3">{b.title}</h2>
            <p className="text-muted">{b.text}</p>
            <p>
              <span className="tbd">[DA COMPLETARE]</span>
            </p>
          </Reveal>
        ))}
      </section>
      <Commitments />
      <FinalCta />
    </>
  );
}
