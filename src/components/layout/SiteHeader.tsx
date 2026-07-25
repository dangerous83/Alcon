"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content/site";
import { services } from "@/lib/content/services";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";

const linkBase =
  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const servicesRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the dropdown on outside click and on Escape, so it never gets
  // stranded open for keyboard or touch users.
  useEffect(() => {
    if (!servicesOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setServicesOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // A small close delay keeps the menu usable while the pointer travels
  // from the trigger down into the panel.
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const centreLinks = navigation.filter((item) => !item.cta);
  const ctaLink = navigation.find((item) => item.cta);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
      <nav
        aria-label="Primary"
        className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
        >
          {/* The supplied logo is a wide wordmark (450x162) on solid black.
              Kept at its native aspect ratio — cropping it to a square/circle
              slices the lettering apart — and left black-backed so it sits
              naturally on the near-black nav. */}
          <Image
            src={assetPath("/images/logo.jpg")}
            alt="Alcon"
            width={450}
            height={162}
            priority
            className="h-8 w-auto object-contain"
          />
          <span className="sr-only">Alcon — Creative Intelligence, home</span>
        </Link>

        {/* Centred independently of the logo/CTA widths so the links sit on
            the true middle of the header. */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {centreLinks.map((item) => {
            const active = pathname.startsWith(item.href);
            const isServices = item.href === "/services";

            if (isServices) {
              return (
                <li
                  key={item.href}
                  ref={servicesRef}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setServicesOpen(true);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {/* A link, not a button: clicking "Services" should go to
                      the services index. Making it a toggle fought the hover
                      behaviour — the pointer opens the panel, so a click
                      would immediately close it again. The panel opens on
                      hover and on focus instead, which keeps it reachable
                      by keyboard without a second control. */}
                  <Link
                    href={item.href}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-current={active ? "page" : undefined}
                    onFocus={() => {
                      cancelClose();
                      setServicesOpen(true);
                    }}
                    className={clsx(
                      linkBase,
                      "inline-flex items-center gap-1.5",
                      active
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={clsx(
                        "text-[0.6rem] transition-transform duration-200",
                        servicesOpen && "rotate-180"
                      )}
                    >
                      ▾
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-4 -bottom-0.5 h-px bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
                      />
                    )}
                  </Link>

                  <div
                    className={clsx(
                      "absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all duration-200",
                      servicesOpen
                        ? "pointer-events-auto opacity-100 translate-y-0"
                        : "pointer-events-none opacity-0 -translate-y-1"
                    )}
                  >
                    <ul className="overflow-hidden rounded-2xl border border-border bg-surface-elevated/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
                      <li>
                        <Link
                          href="/services"
                          onClick={() => setServicesOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-text-primary hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                        >
                          All services
                        </Link>
                      </li>
                      <li aria-hidden className="my-1 h-px bg-border" />
                      {services.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            onClick={() => setServicesOpen(false)}
                            className="block rounded-xl px-3 py-2 text-sm text-text-secondary hover:bg-white/[0.06] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                          >
                            {service.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    linkBase,
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
              </li>
            );
          })}
        </ul>

        {ctaLink && (
          <Link
            href={ctaLink.href}
            className="hidden shrink-0 items-center rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-5 py-2.5 text-sm font-heading font-medium text-text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent md:inline-flex"
          >
            {ctaLink.label}
          </Link>
        )}

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
          "md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur transition-[max-height] duration-300",
          open ? "max-h-[32rem]" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 pb-4">
          {centreLinks.map((item) =>
            item.href === "/services" ? (
              <li key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="min-h-11 flex-1 rounded-lg px-3 py-3 text-base font-medium text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={mobileServicesOpen}
                    aria-label={
                      mobileServicesOpen
                        ? "Collapse services list"
                        : "Expand services list"
                    }
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                  >
                    <span
                      aria-hidden
                      className={clsx(
                        "text-xs transition-transform duration-200",
                        mobileServicesOpen && "rotate-180"
                      )}
                    >
                      ▾
                    </span>
                  </button>
                </div>
                {mobileServicesOpen && (
                  <ul className="mb-1 ml-3 border-l border-border pl-3">
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={() => setOpen(false)}
                          className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block min-h-11 rounded-lg px-3 py-3 text-base font-medium text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
          {ctaLink && (
            <li>
              <Link
                href={ctaLink.href}
                onClick={() => setOpen(false)}
                className="mt-2 block min-h-11 rounded-lg bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-3 py-3 text-center text-base font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
              >
                {ctaLink.label}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
