"use client";

/** Segnale "intro finita": le animazioni dell'hero aspettano che l'intro si chiuda. */
declare global {
  interface Window {
    __voltaIntroDone?: boolean;
  }
}

const EVENT = "volta:intro-done";

export function markIntroDone() {
  window.__voltaIntroDone = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void): () => void {
  const pending = document.documentElement.dataset.intro === "1" && !window.__voltaIntroDone;
  if (!pending) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
