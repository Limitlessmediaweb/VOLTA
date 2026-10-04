import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { faqs } from "@/data/faq";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Domande frequenti | VOLTA",
  description: "Salta la corrente? Differenziale o interruttore? Quando rifare l'impianto? Risposte chiare alle domande più comuni.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PageHero eyebrow="Domande frequenti" title="Risposte chiare, prima di chiamarci." />
      <section aria-label="Elenco delle domande" className="wrap section max-w-4xl">
        <Accordion items={faqs} headingLevel="h2" />
      </section>
      <FinalCta />
    </>
  );
}
