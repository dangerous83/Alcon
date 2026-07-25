"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content/site";
import { clsx } from "@/lib/clsx";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
        >
          <Image
            src="/images/logo.jpg"
            alt="Alcon"
            width={40}
            height={40}
            priority
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="sr-only">Alcon — Creative Intelligence, home</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                {item.cta ? (
                  <Link
                    href={item.href}
                    className="ml-2 inline-flex items-center rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-5 py-2.5 text-sm font-heading font-medium text-text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "relative px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded-full",
                      active
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-4 -bottom-0.5 h-px bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
                      />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-primary md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={clsx(
                "absolute left-0 top-0 h-px w-4 bg-current transition-transform",
                open && "translate-y-1.5 rotate-45"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 bottom-0 h-px w-4 bg-current transition-transform",
                open && "-translate-y-1.5 -rotate-45"
              )}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={clsx(
          "md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur transition-[max-height]",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 pb-4">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block min-h-11 rounded-lg px-3 py-3 text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent",
                  item.cta
                    ? "bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] text-text-primary text-center mt-2"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
