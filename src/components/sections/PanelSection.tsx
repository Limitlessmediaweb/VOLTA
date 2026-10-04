"use client";

import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { panelParts } from "@/data/content";
import { cn } from "@/lib/utils";

const FG = "color-mix(in oklab, var(--fg) 60%, transparent)";

/** Schema del quadro elettrico; il componente attivo si illumina. */
function PanelSvg({ active }: { active: number }) {
  const on = (id: string) => active < 0 || panelParts[active]?.id === id;
  const part = (id: string) => ({
    className: "transition-opacity duration-500",
    style: { opacity: on(id) ? 1 : 0.28 },
  });
  const glow = (id: string) => (active >= 0 && panelParts[active]?.id === id ? "var(--light)" : FG);
  const breaker = (x: number, y: number, w: number, id: string, key?: string) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height="56" rx="3" fill="var(--surface-2)" stroke={glow(id)} strokeWidth="1.4" />
      <rect x={x + w / 2 - 4} y={y + 14} width="8" height="18" rx="1.5" fill={glow(id)} />
    </g>
  );

  return (
    <svg viewBox="0 0 300 390" className="h-auto w-full" role="img" aria-label={active >= 0 ? `Quadro elettrico, in evidenza: ${panelParts[active].name}` : "Schema di un quadro elettrico domestico"}>
      <rect x="6" y="6" width="288" height="378" rx="14" fill="var(--surface)" stroke={FG} strokeWidth="1.5" />
      {[52, 152, 252].map((y) => (
        <path key={y} d={`M22 ${y + 28} H278`} stroke="var(--line-strong)" strokeWidth="6" />
      ))}
      {/* Riga 1: generale, differenziale, SPD */}
      <g {...part("generale")}>{breaker(26, 52, 44, "generale")}</g>
      <g {...part("differenziale")}>
        {breaker(78, 52, 88, "differenziale")}
        <circle cx="152" cy="98" r="4" fill="none" stroke={glow("differenziale")} />
        <text x="90" y="102" fontFamily="var(--font-mono)" fontSize="9" fill={glow("differenziale")}>T</text>
      </g>
      <g {...part("spd")}>
        {breaker(174, 52, 44, "spd")}
        <path d="M226 62 l-6 14 h8 l-6 14" stroke={glow("spd")} fill="none" strokeWidth="1.5" />
      </g>
      {/* Riga 2: linee */}
      <g {...part("linee")}>{[26, 68, 110, 152, 194, 236].map((x) => breaker(x, 152, 36, "linee", String(x)))}</g>
      {/* Riga 3: domotica */}
      <g {...part("domotica")}>
        {[26, 100, 174].map((x) => (
          <g key={x}>
            <rect x={x} y="252" width="66" height="56" rx="3" fill="var(--surface-2)" stroke={glow("domotica")} strokeWidth="1.4" />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={x + 12 + i * 14} cy="266" r="2.5" fill={glow("domotica")} />
            ))}
            <path d={`M${x + 8} 290 H${x + 58}`} stroke={glow("domotica")} />
          </g>
        ))}
      </g>
      {/* Etichette */}
      <g {...part("etichette")}>
        {[118, 218, 318].map((y) => (
          <rect key={y} x="26" y={y} width="248" height="10" rx="2" fill="none" stroke={glow("etichette")} strokeDasharray="3 3" />
        ))}
        <text x="26" y="350" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill={glow("etichette")}>
          LUCI · PRESE · CUCINA · CLIMA · ESTERNO
        </text>
      </g>
    </svg>
  );
}

export function PanelSection() {
  return (
    <HorizontalScroll
      label="Dentro il quadro elettrico"
      count={panelParts.length}
      header={
        <div className="grid gap-3">
          <p className="t-mono text-light-text">Dentro il quadro</p>
          <h2 className="t-h2 max-w-[14ch]">Cosa c&apos;è dietro lo sportello.</h2>
          <p className="t-lead hidden sm:block">Il cuore dell&apos;impianto, spiegato pezzo per pezzo.</p>
        </div>
      }
      aside={(active) => <PanelSvg active={active} />}
      item={(i, active) => {
        const p = panelParts[i];
        const isOn = active < 0 || active === i;
        return (
          <article
            className={cn(
              "flex h-full flex-col gap-3 rounded-2xl border p-6 transition-[border-color,background-color] duration-500",
              isOn && active >= 0 ? "border-light/60 bg-surface" : "border-line bg-surface/60",
            )}
          >
            <p className="t-mono text-light-text">{p.code}</p>
            <h3 className="t-h3">{p.name}</h3>
            <p className="text-sm text-muted">{p.text}</p>
          </article>
        );
      }}
    />
  );
}
