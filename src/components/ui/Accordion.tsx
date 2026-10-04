"use client";

import { Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

/**
 * Accordion accessibile: <button aria-expanded aria-controls> + pannello.
 * I pannelli chiusi usano hidden="until-found": il testo resta trovabile con "Trova nella pagina"
 * (l'evento beforematch apre la voce). Senza JS una regola <noscript> li mostra tutti.
 */
export function Accordion({ items, headingLevel = "h3" }: { items: Item[]; headingLevel?: "h2" | "h3" }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);
  const listRef = useRef<HTMLUListElement>(null);
  const H = headingLevel;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onMatch = (e: Event) => {
      const i = Number((e.target as HTMLElement).dataset.index);
      if (!Number.isNaN(i)) setOpen(i);
    };
    list.addEventListener("beforematch", onMatch);
    return () => list.removeEventListener("beforematch", onMatch);
  }, []);

  return (
    <>
      <noscript>
        <style>{`[data-faq-panel]{display:block!important;content-visibility:visible!important}`}</style>
      </noscript>
      <ul ref={listRef} className="border-t border-line">
        {items.map((item, i) => {
          const isOpen = open === i;
          const btnId = `${base}-b${i}`;
          const panelId = `${base}-p${i}`;
          return (
            <li key={item.q} className="border-b border-line">
              <H className="m-0">
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold transition-colors hover:text-light-text"
                >
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[transform,border-color,box-shadow] duration-500",
                      isOpen && "rotate-45 border-light shadow-[0_0_24px_-6px_var(--light)]",
                    )}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
              </H>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                data-faq-panel
                data-index={i}
                // hidden="until-found" per i pannelli chiusi
                hidden={isOpen ? undefined : ("until-found" as unknown as boolean)}
                className="pb-6"
              >
                <p className="max-w-[68ch] text-muted">{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
