export type RoomId = "ingresso" | "cucina" | "soggiorno" | "camera" | "esterno";

export const rooms: { id: RoomId; index: string; name: string; service: string; text: string }[] = [
  {
    id: "ingresso",
    index: "01",
    name: "Ingresso",
    service: "Sicurezza e videocitofono",
    text: "Chi suona lo vedi dal telefono. Luce di cortesia al passaggio, porta che si apre in sicurezza.",
  },
  {
    id: "cucina",
    index: "02",
    name: "Cucina",
    service: "Impianto e piani a induzione",
    text: "Linee dedicate per forno e induzione, dimensionate per non far saltare nulla quando cucini.",
  },
  {
    id: "soggiorno",
    index: "03",
    name: "Soggiorno",
    service: "Scenari luce e domotica",
    text: "Un tocco e la stanza cambia: lettura, cena, film. Ogni scenario lo regoli tu.",
  },
  {
    id: "camera",
    index: "04",
    name: "Camera",
    service: "Luce che segue l'ora",
    text: "Bianca e decisa al mattino, calda e bassa la sera. La luce accompagna il ritmo della giornata.",
  },
  {
    id: "esterno",
    index: "05",
    name: "Esterno",
    service: "Illuminazione di giardino",
    text: "Percorsi, alberi e facciata disegnati dalla luce. Accensione al tramonto, senza pensarci.",
  },
];
