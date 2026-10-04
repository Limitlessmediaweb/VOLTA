import { business, TBD } from "@/data/business";

/** Mappa stilizzata della zona servita, in SVG (nessuna mappa esterna). */
export function ZoneMap() {
  const area = business.area ?? TBD;
  return (
    <figure className="grid gap-3">
      <svg viewBox="0 0 400 300" className="h-auto w-full rounded-3xl border border-line bg-surface" role="img" aria-label={`Mappa stilizzata della zona servita: ${area}`}>
        <defs>
          <radialGradient id="zone-glow">
            <stop offset="0" stopColor="var(--light)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--light)" stopOpacity="0" />
          </radialGradient>
          <pattern id="zone-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="var(--line)" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#zone-grid)" />
        <g fill="none" stroke="var(--line-strong)" strokeWidth="1.5">
          <path d="M-10 210 C 80 180, 140 230, 220 190 S 340 120, 410 140" />
          <path d="M60 -10 C 90 80, 150 120, 160 310" />
          <path d="M260 -10 C 250 90, 300 160, 290 310" />
          <path d="M-10 90 H410" strokeDasharray="4 6" />
        </g>
        <path d="M-10 250 C 60 240, 120 280, 200 262 S 330 230, 410 250" stroke="color-mix(in oklab, #7FA8FF 50%, transparent)" strokeWidth="6" fill="none" />
        <circle cx="200" cy="150" r="120" fill="url(#zone-glow)" />
        <circle cx="200" cy="150" r="100" fill="none" stroke="var(--light)" strokeDasharray="3 5" />
        <circle cx="200" cy="150" r="7" fill="var(--light)" />
        <circle cx="200" cy="150" r="16" fill="none" stroke="var(--light)" strokeOpacity="0.6" />
      </svg>
      <figcaption className="t-mono text-muted">
        Zona servita: <span className="tbd">{area}</span>
      </figcaption>
    </figure>
  );
}
