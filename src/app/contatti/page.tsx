import { Contact } from "@/components/sections/Contact";
import { Emergency } from "@/components/sections/Emergency";
import { JsonLd } from "@/components/ui/JsonLd";
import { electricianJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contatti e sopralluogo | VOLTA",
  description: "Richiedi un sopralluogo o chiama per un guasto elettrico. Orari, zona servita e modulo di contatto VOLTA.",
  path: "/contatti",
});

export default function ContattiPage() {
  return (
    <>
      <JsonLd data={electricianJsonLd} />
      <div className="pt-24 lg:pt-32">
        <Contact headingLevel="h1" />
      </div>
      <Emergency />
      <p className="wrap py-10 text-sm text-muted">Progetto concept — VOLTA è un brand inventato.</p>
    </>
  );
}
