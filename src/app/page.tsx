import { Hero } from "@/components/sections/Hero";
import { Emergency } from "@/components/sections/Emergency";
import { HouseSection } from "@/components/sections/HouseSection";
import { Services } from "@/components/sections/Services";
import { Scenes } from "@/components/sections/Scenes";
import { PanelSection } from "@/components/sections/PanelSection";
import { Commitments, Stats } from "@/components/sections/Commitments";
import { FaqSection } from "@/components/sections/FaqSection";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";
import { Marquee } from "@/components/motion/Marquee";
import { JsonLd } from "@/components/ui/JsonLd";
import { marqueeItems } from "@/data/content";
import { electricianJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "VOLTA | Impianti elettrici e domotica di pregio",
  description: "Impianti elettrici, luci su misura e domotica per case e locali di pregio. Pronto intervento, quadri e sopralluoghi con preventivo scritto.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={electricianJsonLd} />
      <Hero />
      <Emergency />
      <HouseSection />
      <Marquee items={marqueeItems} label="Cosa facciamo" />
      <Services />
      <Scenes />
      <PanelSection />
      <Commitments />
      <Stats />
      <FaqSection limit={5} />
      <Contact />
      <FinalCta />
    </>
  );
}
