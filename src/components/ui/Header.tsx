"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { mainNav } from "@/data/nav";
import { callHref } from "@/data/business";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { TrackedLink } from "./TrackedLink";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Chiude il menu a ogni cambio pagina (aggiornamento durante il render, senza effetto).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Badge versione demo */}
      <div className="flex h-7 items-center justify-center gap-3 border-b border-line bg-bg/90 backdrop-blur-sm">
        <span className="demo-badge">Versione demo</span>
        <span aria-hidden className="h-3 w-px bg-line-strong" />
        <span className="demo-badge !text-muted">Progetto concept</span>
      </div>

      <div
        className={cn(
          "transition-[background-color,border-color] duration-500",
          scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" className="relative z-10 -m-2 p-2 text-fg" aria-label="VOLTA, torna alla home">
            <Logo className="w-[104px] lg:w-[120px]" idPrefix="hdr" title="VOLTA" />
          </Link>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-11 items-center px-4 text-sm font-semibold transition-colors hover:text-light-text",
                        active ? "text-light-text" : "text-fg/80",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <TrackedLink
              href={callHref}
              event="call_click"
              eventLabel="header"
              className="btn btn-alarm !min-h-11 !px-4 text-sm"
            >
              <Phone aria-hidden className="size-4" />
              Chiama
            </TrackedLink>
            <TrackedLink href="/contatti#sopralluogo" eventLabel="header_sopralluogo" className="btn btn-primary !min-h-11 hidden !px-5 text-sm lg:inline-flex">
              Richiedi un sopralluogo
            </TrackedLink>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Chiudi il menu" : "Apri il menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>

        <div id="menu-mobile" hidden={!open} className="border-t border-line lg:hidden">
          <nav aria-label="Menu mobile" className="wrap py-6">
            <ul className="grid gap-1">
              {[{ href: "/", label: "Home" }, ...mainNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="t-h3 flex min-h-12 items-center border-b border-line py-3 aria-[current=page]:text-light-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <span className="t-mono text-muted">Tema</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
