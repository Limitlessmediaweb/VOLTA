import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono, Manrope, Syne } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { MobileCallBar } from "@/components/ui/MobileCallBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { Intro } from "@/components/motion/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { PageTransition } from "@/components/motion/PageTransition";
import { ALLOW_INDEXING, PLAUSIBLE_DOMAIN, SITE_URL } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const syne = Syne({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-syne", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "VOLTA | Impianti elettrici e domotica di pregio", template: "%s | VOLTA" },
  description: "Impianti elettrici, illuminazione su misura e domotica per case e locali di pregio. Pronto intervento e sopralluoghi.",
  applicationName: "VOLTA",
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: { type: "website", locale: "it_IT", siteName: "VOLTA" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0908",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

/** Prima del paint: tema salvato, classe "motion", flag intro (una volta per sessione). */
const bootScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem('volta-theme')==='light'){d.dataset.theme='light';}}catch(e){}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');}
try{if(!sessionStorage.getItem('volta-intro')){d.dataset.intro='1';}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={[websiteJsonLd, organizationJsonLd]} />
      </head>
      <body>
        <a href="#contenuto" className="sr-only z-[200] rounded-full bg-fg px-5 py-3 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-10 focus:left-4">
          Vai al contenuto
        </a>
        <Intro />
        <ScrollProgress />
        <Header />
        <PageTransition>
          <main id="contenuto">{children}</main>
        </PageTransition>
        <Footer />
        <MobileCallBar />
        <SmoothScroll />
        <CursorFollower />
        {PLAUSIBLE_DOMAIN && <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
