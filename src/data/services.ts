export type ServiceIconName = "wires" | "panel" | "lamp" | "home";

export type Service = {
  slug: string;
  code: string;
  title: string;
  lead: string;
  points: string[];
  icon: ServiceIconName;
};

export const services: Service[] = [
  {
    slug: "impianti",
    code: "S/01",
    title: "Impianti nuovi e rifacimenti",
    lead: "Dal progetto all'ultima presa. Tracce pulite, linee separate, tutto documentato.",
    points: ["Case nuove e ristrutturazioni", "Rifacimento di impianti datati", "Locali, negozi e studi"],
    icon: "wires",
  },
  {
    slug: "quadri",
    code: "S/02",
    title: "Quadri e messa in sicurezza",
    lead: "Un quadro ordinato è una casa tranquilla. Ogni linea al suo posto, ogni protezione etichettata.",
    points: ["Verifica e riordino del quadro", "Differenziali e protezioni", "Adeguamenti [DA VERIFICARE CON IL CLIENTE]"],
    icon: "panel",
  },
  {
    slug: "illuminazione",
    code: "S/03",
    title: "Illuminazione su misura",
    lead: "La luce giusta cambia una stanza più di un mobile. La disegniamo con te.",
    points: ["Progetto luci per ambienti", "Strip LED, binari, sospensioni", "Giardini e facciate"],
    icon: "lamp",
  },
  {
    slug: "domotica",
    code: "S/04",
    title: "Domotica",
    lead: "Luci, tapparelle e clima che rispondono a te. Semplice da usare, anche per chi non ama la tecnologia.",
    points: ["Scenari luce", "Comandi da app e voce", "Controllo consumi"],
    icon: "home",
  },
];
