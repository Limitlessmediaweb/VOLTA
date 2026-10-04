/** Configurazione da variabili d'ambiente (tutte pubbliche, lette a build time). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
export const LIMITLESS_URL = process.env.NEXT_PUBLIC_LIMITLESS_URL || "https://example.com";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;
