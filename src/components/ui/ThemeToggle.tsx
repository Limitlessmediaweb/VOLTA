"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/** Osserva data-theme su <html>: più pulsanti restano sincronizzati. */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Tema scuro di default; la scelta è salvata in localStorage (preferenza per-visitatore). */
export function ThemeToggle({ className }: { className?: string }) {
  const light = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "light", () => false);

  const toggle = () => {
    const next = !light;
    const root = document.documentElement;
    if (next) root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("volta-theme", next ? "light" : "dark");
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#FAF6EE" : "#0A0908");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={light}
      aria-label={light ? "Passa al tema scuro" : "Passa al tema chiaro"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-light",
        className,
      )}
    >
      {light ? <Moon aria-hidden className="size-4" /> : <Sun aria-hidden className="size-4" />}
    </button>
  );
}
