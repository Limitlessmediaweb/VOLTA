/**
 * Analytics senza cookie (Plausible). Attivo solo se NEXT_PUBLIC_PLAUSIBLE_DOMAIN è impostata.
 * Regola: mai dati personali nelle props (niente nomi, telefoni, testi del form).
 */
export type AnalyticsEvent = "cta_click" | "call_click" | "quote_submit" | "scene_change";
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return;
  window.plausible?.(event, props ? { props } : undefined);
}
