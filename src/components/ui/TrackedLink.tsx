"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & { event?: AnalyticsEvent; eventLabel?: string };

/** Link con evento analytics (solo etichetta della CTA, mai dati personali). */
export function TrackedLink({ event = "cta_click", eventLabel, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventLabel ? { cta: eventLabel } : undefined);
        onClick?.(e);
      }}
    />
  );
}
