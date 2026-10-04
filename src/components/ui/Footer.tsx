import Link from "next/link";
import { legalNav, mainNav } from "@/data/nav";
import { business } from "@/data/business";
import { LIMITLESS_URL } from "@/lib/site";
import { Logo } from "./Logo";
import { Tbd } from "./Tbd";

export function Footer() {
  return (
    <footer className="relative border-t border-line pb-28 lg:pb-10">
      <div className="wrap grid gap-12 pt-16 md:grid-cols-[1.4fr_1fr_1fr] lg:pt-24">
        <div className="grid content-start gap-5">
          <Logo className="w-36 text-fg" idPrefix="ftr" />
          <p className="max-w-sm text-sm text-muted">{business.description}</p>
          <p className="text-sm text-muted">
            P.IVA <Tbd value={business.vat} />
          </p>
        </div>

        <nav aria-label="Navigazione nel footer">
          <p className="t-mono mb-4 text-muted">Sito</p>
          <ul className="grid gap-1">
            {[{ href: "/", label: "Home" }, ...mainNav].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-fg/85 hover:text-light-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="t-mono mb-4 text-muted">Legale</p>
          <ul className="grid gap-1">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-fg/85 hover:text-light-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap mt-16">
        <div className="hairline" />
        <div className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Progetto concept — VOLTA è un brand inventato.</p>
          <p>
            Realizzato e gestito da{" "}
            <a href={LIMITLESS_URL} className="font-semibold text-fg underline decoration-line-strong hover:text-light-text" rel="noopener">
              LIMITLESS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
