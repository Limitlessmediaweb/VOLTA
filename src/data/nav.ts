export const mainNav = [
  { href: "/servizi", label: "Servizi" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/termini", label: "Termini d'uso" },
] as const;

/** Rotte pubbliche per la sitemap. */
export const publicRoutes = ["/", "/servizi", "/chi-siamo", "/contatti", "/faq", "/privacy", "/termini"] as const;
