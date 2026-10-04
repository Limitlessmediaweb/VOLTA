import { Fragment } from "react";

/** Nastro scorrevole in CSS puro (solo transform). Fermo con prefers-reduced-motion. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t) => (
        <Fragment key={t}>
          <li className="t-h3 whitespace-nowrap text-fg/85">{t}</li>
          <li aria-hidden className="size-1.5 rounded-full bg-light shadow-[0_0_10px_var(--light)]" />
        </Fragment>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-line py-6" role="region" aria-label={label}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
