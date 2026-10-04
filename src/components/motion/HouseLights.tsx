import type { RoomId } from "@/data/rooms";
import { cn } from "@/lib/utils";

/**
 * Casa in sezione (SVG) con 4 stanze + esterno. Ogni stanza si "accende" con data-lit,
 * animando solo l'opacità di aloni (radialGradient, niente blur) e lampade.
 */
type Props = { lit: RoomId[] | "all"; highlight?: RoomId; className?: string; title?: string };

const LINE = "var(--line-strong)";
const FG = "color-mix(in oklab, var(--fg) 55%, transparent)";

export function HouseLights({ lit, highlight, className, title = "Casa disegnata in sezione con ingresso, cucina, soggiorno, camera e giardino" }: Props) {
  const isLit = (id: RoomId) => (lit === "all" ? true : lit.includes(id));
  const room = (id: RoomId) => ({
    "data-room": id,
    "data-lit": String(isLit(id)),
    "data-active": highlight === id ? "true" : undefined,
  });

  return (
    <svg viewBox="0 0 900 600" className={cn("h-auto w-full", className)} role="img" aria-label={title}>
      <defs>
        {(["ingresso", "cucina", "soggiorno", "camera"] as const).map((id) => (
          <radialGradient key={id} id={`glow-${id}`} cx="0.5" cy="0.05" r="1">
            <stop offset="0" stopColor="var(--light)" stopOpacity="0.75" />
            <stop offset="0.45" stopColor="var(--light)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--light)" stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient id="glow-esterno" cx="0.5" cy="1" r="0.9">
          <stop offset="0" stopColor="var(--light)" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="var(--light)" stopOpacity="0.12" />
          <stop offset="1" stopColor="var(--light)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-dot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--light)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--light)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Terreno */}
      <path d="M0 520 H900" stroke={LINE} strokeWidth="1.5" />

      {/* ESTERNO / GIARDINO */}
      <g {...room("esterno")}>
        <rect className="room-glow" x="630" y="300" width="270" height="220" fill="url(#glow-esterno)" />
        <path d="M760 520 V430 M760 470 L735 445 M760 455 L788 432" stroke={FG} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="760" cy="385" r="58" stroke={FG} strokeWidth="1.5" fill="none" />
        <circle cx="742" cy="372" r="30" stroke={LINE} strokeWidth="1" fill="none" />
        <path d="M650 520 C 700 505, 800 505, 890 520" stroke={LINE} fill="none" />
        {[680, 845].map((x) => (
          <g key={x}>
            <path d={`M${x} 520 V488`} stroke={FG} strokeWidth="4" strokeLinecap="round" />
            <circle className="room-lamp" cx={x} cy="484" r="5" fill="var(--light)" />
            <circle className="room-glow" cx={x} cy="484" r="30" fill="url(#glow-dot)" />
          </g>
        ))}
        {/* luce d'accento sull'albero */}
        <path className="room-glow" d="M760 520 L700 330 H820 Z" fill="url(#glow-esterno)" opacity="0.8" />
      </g>

      {/* CAMERA (piano superiore) */}
      <g {...room("camera")}>
        <rect x="230" y="220" width="380" height="140" fill="var(--room-off)" />
        <rect className="room-glow" x="230" y="220" width="380" height="140" fill="url(#glow-camera)" />
        <rect x="270" y="250" width="58" height="58" stroke={FG} fill="var(--sky)" />
        <path d="M299 250 V308 M270 279 H328" stroke={LINE} />
        <circle cx="312" cy="266" r="7" fill="none" stroke={FG} />
        <path d="M398 360 V328 H540 V360 M398 336 H540 M540 300 V360" stroke={FG} strokeWidth="1.6" fill="none" />
        <rect x="408" y="318" width="34" height="12" rx="5" stroke={FG} fill="none" />
        <rect x="556" y="336" width="26" height="24" stroke={FG} fill="none" />
        <path d="M563 336 V320 M558 320 H575 L571 308 H562 Z" stroke={FG} fill="none" />
        <circle className="room-lamp" cx="566.5" cy="316" r="6" fill="var(--light)" />
        <circle className="room-glow" cx="566.5" cy="316" r="44" fill="url(#glow-dot)" />
      </g>

      {/* Scala (spenta) */}
      <rect x="90" y="220" width="140" height="140" fill="var(--room-off)" />
      <path d="M100 360 H125 V340 H150 V320 H175 V300 H200 V280 H225" stroke={LINE} fill="none" />

      {/* INGRESSO */}
      <g {...room("ingresso")}>
        <rect x="90" y="360" width="140" height="160" fill="var(--room-off)" />
        <rect className="room-glow" x="90" y="360" width="140" height="160" fill="url(#glow-ingresso)" />
        <rect x="104" y="404" width="52" height="116" stroke={FG} strokeWidth="1.6" fill="none" />
        <circle cx="146" cy="464" r="2.5" fill={FG} />
        <rect x="180" y="430" width="18" height="28" rx="3" stroke={FG} fill="none" />
        <rect className="room-lamp" x="184" y="435" width="10" height="9" rx="1.5" fill="var(--light)" />
        <path d="M160 360 V372" stroke={FG} />
        <path className="room-lamp" d="M150 372 H170 L166 380 H154 Z" fill="var(--light)" />
      </g>

      {/* CUCINA */}
      <g {...room("cucina")}>
        <rect x="230" y="360" width="180" height="160" fill="var(--room-off)" />
        <rect className="room-glow" x="230" y="360" width="180" height="160" fill="url(#glow-cucina)" />
        <rect x="244" y="470" width="152" height="50" stroke={FG} strokeWidth="1.6" fill="none" />
        <path d="M244 482 H396 M320 482 V520" stroke={LINE} />
        <path d="M278 468 H306 M318 468 H346" stroke="var(--light)" strokeWidth="3" strokeLinecap="round" className="room-lamp" />
        <path d="M292 380 H332 L342 408 H282 Z" stroke={FG} fill="none" />
        <path d="M312 360 V380" stroke={FG} />
        <path d="M372 360 V404" stroke={FG} />
        <path className="room-lamp" d="M360 404 H384 L380 414 H364 Z" fill="var(--light)" />
      </g>

      {/* SOGGIORNO */}
      <g {...room("soggiorno")}>
        <rect x="410" y="360" width="200" height="160" fill="var(--room-off)" />
        <rect className="room-glow" x="410" y="360" width="200" height="160" fill="url(#glow-soggiorno)" />
        <rect x="430" y="392" width="78" height="44" rx="3" stroke={FG} fill="none" />
        <path d="M469 436 V448 M455 448 H483" stroke={FG} />
        <path d="M428 520 V486 H560 V520 M428 486 V470 H560 V486" stroke={FG} strokeWidth="1.6" fill="none" />
        <path d="M588 520 V430" stroke={FG} strokeWidth="1.6" />
        <path className="room-lamp" d="M574 430 H602 L596 410 H580 Z" fill="var(--light)" />
        <circle className="room-glow" cx="588" cy="428" r="54" fill="url(#glow-dot)" />
        <path className="room-lamp" d="M440 366 H498" stroke="var(--light)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Struttura */}
      <g stroke={FG} strokeWidth="2" fill="none" strokeLinejoin="round">
        <path d="M60 222 L350 70 L640 222" />
        <path d="M90 220 V520 M610 220 V520 M90 220 H610 M90 360 H610" />
        <path d="M230 220 V520 M410 360 V520" strokeWidth="1.2" />
      </g>
      <circle cx="350" cy="160" r="20" stroke={LINE} fill="var(--room-off)" />

      {/* Evidenzia la stanza attiva */}
      {highlight && highlight !== "esterno" && (
        <path
          d={
            {
              ingresso: "M90 360 H230 V520 H90 Z",
              cucina: "M230 360 H410 V520 H230 Z",
              soggiorno: "M410 360 H610 V520 H410 Z",
              camera: "M230 220 H610 V360 H230 Z",
            }[highlight]
          }
          fill="none"
          stroke="var(--light)"
          strokeWidth="2.5"
        />
      )}
    </svg>
  );
}
