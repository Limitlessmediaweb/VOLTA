import type { Metadata } from "next";
import Link from "next/link";
import { DyingBulb } from "@/components/motion/DyingBulb";
import { mainNav } from "@/data/nav";

export const metadata: Metadata = {
  title: { absolute: "Pagina non trovata | VOLTA" },
  description: "La pagina che cerchi non esiste o è stata spostata.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[100svh] content-center justify-items-center gap-8 pt-32 pb-28 text-center">
      <DyingBulb />
      <p className="t-mono text-muted">Errore 404</p>
      <h1 className="t-h1 max-w-[14ch]">Qui è saltata la corrente.</h1>
      <p className="t-lead text-center">La pagina che cerchi non esiste o è stata spostata. Riaccendiamo da un&apos;altra parte.</p>
      <Link href="/" className="btn btn-primary">
        Torna alla home
      </Link>
      <nav aria-label="Sezioni principali">
        <ul className="flex flex-wrap justify-center gap-2">
          {mainNav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-light">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
