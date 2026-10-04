/** Scenari luce (sezione interattiva). Valori indicativi, a scopo dimostrativo. */
export type SceneId = "mattina" | "cena" | "film" | "notte";
export const scenes: {
  id: SceneId;
  label: string;
  kelvin: string;
  intensity: number; // 0–100 di default
  color: string; // colore della luce
  sky: string; // colore della finestra
  ceiling: number; // 0–1
  lamp: number;
  tv: number;
  description: string;
}[] = [
  { id: "mattina", label: "Mattina", kelvin: "4000 K", intensity: 85, color: "#FFF1D6", sky: "#9CC3E6", ceiling: 1, lamp: 0.2, tv: 0, description: "Luce neutra e piena, per svegliarsi e lavorare." },
  { id: "cena", label: "Cena", kelvin: "2700 K", intensity: 60, color: "#FFC857", sky: "#3B2A3F", ceiling: 0.35, lamp: 1, tv: 0, description: "Calda e raccolta sopra il tavolo, il resto in penombra." },
  { id: "film", label: "Film", kelvin: "2200 K", intensity: 25, color: "#FF9F43", sky: "#14131F", ceiling: 0, lamp: 0.35, tv: 1, description: "Solo una luce bassa dietro lo schermo. Niente riflessi." },
  { id: "notte", label: "Notte", kelvin: "1800 K", intensity: 8, color: "#FF8A3D", sky: "#0B0D18", ceiling: 0, lamp: 0.12, tv: 0, description: "Un filo di luce a terra per muoversi senza svegliare nessuno." },
];

/** Componenti del quadro elettrico (sezione a scorrimento orizzontale). Descrizioni generali. */
export const panelParts: { id: string; code: string; name: string; text: string }[] = [
  { id: "generale", code: "Q.01", name: "Interruttore generale", text: "Toglie corrente a tutta la casa. È la prima cosa da cercare in caso di emergenza." },
  { id: "differenziale", code: "Q.02", name: "Differenziale", text: "Il \"salvavita\". Interviene quando rileva una dispersione verso terra e protegge le persone." },
  { id: "linee", code: "Q.03", name: "Magnetotermici di linea", text: "Uno per ogni zona: luci, prese, cucina, clima. Se una linea ha un problema, il resto resta acceso." },
  { id: "spd", code: "Q.04", name: "Protezione da sovratensioni", text: "Limita i picchi dovuti a fulmini o alla rete. Utile per elettrodomestici ed elettronica." },
  { id: "domotica", code: "Q.05", name: "Moduli domotici", text: "Attuatori e alimentatori che comandano luci, tapparelle e scenari." },
  { id: "etichette", code: "Q.06", name: "Etichette e schema", text: "Ogni interruttore dice cosa comanda. Lo schema resta a te, insieme ai documenti dell'impianto." },
];

/** Come lavoriamo: impegni da confermare con il cliente reale. */
export const commitments: { step: string; title: string; text: string }[] = [
  { step: "01", title: "Sopralluogo", text: "Veniamo a vedere, ascoltiamo cosa ti serve, misuriamo. Tempi di uscita [DA CONFERMARE CON IL CLIENTE]." },
  { step: "02", title: "Preventivo scritto", text: "Voce per voce, con materiali e tempi. Nessuna sorpresa a fine lavoro. [DA CONFERMARE CON IL CLIENTE]" },
  { step: "03", title: "Lavori puliti", text: "Teli, aspirazione, cantiere in ordine ogni sera. Lasciamo la casa come l'abbiamo trovata. [DA CONFERMARE CON IL CLIENTE]" },
  { step: "04", title: "Collaudo e documenti", text: "Prove finali con te presente e consegna della documentazione prevista [DA VERIFICARE CON IL CLIENTE]." },
];

/** Numeri dimostrativi: da sostituire con dati reali o rimuovere. */
export const demoStats: { value: number; suffix: string; label: string }[] = [
  { value: 48, suffix: "h", label: "per ricevere il preventivo scritto" },
  { value: 4, suffix: "", label: "fasi, dal sopralluogo al collaudo" },
  { value: 100, suffix: "%", label: "delle linee etichettate nel quadro" },
];

export const marqueeItems = ["Pronto intervento", "Quadri elettrici", "Luce su misura", "Domotica", "Giardini", "Locali e negozi"];
