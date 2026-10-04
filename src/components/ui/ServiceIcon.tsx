import type { ServiceIconName } from "@/data/services";

/** Icone a tratto disegnate per i servizi (decorative: il titolo della scheda descrive il servizio). */
export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "wires":
      return (
        <svg {...common}>
          <path d="M6 18 H26 C34 18 34 46 42 46 H58" />
          <path d="M6 32 H58" stroke="var(--light)" />
          <path d="M6 46 H22 C30 46 30 18 38 18 H58" />
          <circle cx="58" cy="32" r="2.5" fill="var(--light)" stroke="none" />
        </svg>
      );
    case "panel":
      return (
        <svg {...common}>
          <rect x="10" y="8" width="44" height="48" rx="4" />
          <path d="M10 22 H54 M10 42 H54" />
          {[18, 26, 34, 42].map((x) => (
            <rect key={x} x={x - 2.5} y="27" width="5" height="10" rx="1" />
          ))}
          <path d="M18 27 V31" stroke="var(--light)" strokeWidth="2.4" />
          <circle cx="46" cy="15" r="2" fill="var(--light)" stroke="none" />
        </svg>
      );
    case "lamp":
      return (
        <svg {...common}>
          <path d="M32 4 V20" />
          <path d="M18 34 C18 24 46 24 46 34 Z" />
          <path d="M22 40 L16 56 M32 40 V58 M42 40 L48 56" stroke="var(--light)" strokeDasharray="2 4" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M8 30 L32 10 L56 30 V56 H8 Z" />
          <circle cx="32" cy="38" r="8" />
          <path d="M32 30 V34" stroke="var(--light)" />
          <path d="M24 20 C28 16 36 16 40 20" stroke="var(--light)" />
        </svg>
      );
  }
}
