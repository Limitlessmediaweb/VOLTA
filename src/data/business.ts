/**
 * Dati dell'attività. VOLTA è un brand inventato (progetto concept LIMITLESS).
 * Tutti i campi `null` sono mostrati come "[DA COMPLETARE]" nel sito.
 */
export const TBD = "[DA COMPLETARE]";

export const business = {
  name: "VOLTA",
  tagline: "Accendi la casa che hai in mente.",
  description:
    "Impianti elettrici, illuminazione su misura e domotica per case e locali di pregio. Pronto intervento, quadri e messa in sicurezza.",
  // TODO: telefono reale in formato internazionale, es. "+39 000 000 0000"
  phone: null as string | null,
  // TODO: email reale
  email: null as string | null,
  // TODO: indirizzo e zona reali
  address: { street: null as string | null, city: null as string | null, postalCode: null as string | null, region: null as string | null },
  area: null as string | null, // es. "Milano e provincia"
  vat: null as string | null, // P.IVA
  // TODO: orari reali
  hours: [
    { days: "Lun – Ven", time: null as string | null },
    { days: "Sabato", time: null as string | null },
  ],
  emergencyHours: null as string | null, // es. "Tutti i giorni, 7–22"
};

export const show = (v: string | null | undefined) => v ?? TBD;

/** href per il pulsante "Chiama": se il numero manca porta alla striscia di pronto intervento. */
export const callHref = business.phone ? `tel:${business.phone.replace(/\s+/g, "")}` : "/contatti#telefono";
