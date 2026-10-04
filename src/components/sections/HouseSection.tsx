"use client";

import { PinnedSteps } from "@/components/motion/PinnedSteps";
import { HouseLights } from "@/components/motion/HouseLights";
import { rooms } from "@/data/rooms";

export function HouseSection() {
  return (
    <PinnedSteps
      label="La casa che si accende"
      count={rooms.length}
      header={
        <div className="grid gap-3">
          <p className="t-mono text-light-text">La casa che si accende</p>
          <h2 className="t-h2 max-w-[14ch]">Una stanza alla volta.</h2>
        </div>
      }
      visual={(active) => {
        const lit = active < 0 ? "all" : rooms.slice(0, active + 1).map((r) => r.id);
        return (
          <div className="relative mx-auto w-full max-w-[min(100%,58svh)] lg:max-w-none">
            <HouseLights lit={lit} highlight={active >= 0 ? rooms[active].id : undefined} />
            <p className="sr-only" aria-live="polite">
              {active >= 0 ? `Stanza accesa: ${rooms[active].name}, ${rooms[active].service}` : ""}
            </p>
          </div>
        );
      }}
      step={(i) => {
        const r = rooms[i];
        return (
          <article className="grid gap-3 border-l border-line-strong pl-5">
            <p className="t-mono text-muted">
              <span className="text-light-text">{r.index}</span> / 05 · {r.name}
            </p>
            <h3 className="t-h3 text-fg">{r.service}</h3>
            <p className="max-w-[42ch] text-muted">{r.text}</p>
          </article>
        );
      }}
    />
  );
}
