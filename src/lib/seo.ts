import type { Metadata } from "next";
import { ALLOW_INDEXING, SITE_URL, absoluteUrl } from "./site";
import { business, TBD } from "@/data/business";
import { faqs } from "@/data/faq";

type PageMeta = { title: string; description: string; path: string };

/** Metadati di pagina: title assoluto (<= 60), description (<= 155), canonical, OG e Twitter. */
export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: "VOLTA",
      url,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const orgId = `${SITE_URL}/#organization`;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "VOLTA",
  inLanguage: "it-IT",
  publisher: { "@id": orgId },
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: "VOLTA",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.svg`,
  description: business.description,
};

/** LocalBusiness/Electrician: i campi mancanti restano "[DA COMPLETARE]" finché non arrivano i dati reali. */
export const electricianJsonLd = {
  "@context": "https://schema.org",
  "@type": "Electrician",
  "@id": `${SITE_URL}/#business`,
  name: "VOLTA",
  url: SITE_URL,
  image: `${SITE_URL}/brand/logo.svg`,
  description: business.description,
  parentOrganization: { "@id": orgId },
  telephone: business.phone ?? TBD,
  email: business.email ?? TBD,
  areaServed: business.area ?? TBD,
  priceRange: TBD,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street ?? TBD,
    addressLocality: business.address.city ?? TBD,
    postalCode: business.address.postalCode ?? TBD,
    addressRegion: business.address.region ?? TBD,
    addressCountry: "IT",
  },
  openingHours: TBD,
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
