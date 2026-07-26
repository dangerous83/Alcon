"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Phone,
  Layers,
  Briefcase,
  Tag,
  Users,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { navigation, topBanner } from "@/lib/content/site";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";
import { SiteSearch } from "@/components/layout/SiteSearch";
import {
  MegaMenuWrapper,
  ServicesStyleMegaMenu,
  ClientsMegaMenu,
} from "@/components/layout/MegaMenu";
import {
  servicesMegaMenu,
  servicesMegaMenuStats,
  servicesMegaMenuPromo,
  portfolioMegaMenu,
  portfolioMegaMenuStats,
  clientPlatformLinks,
  clientWebsiteLinks,
} from "@/lib/content/mega-menu";

const linkBase =
  "relative rounded-[7px] px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent";

const navIcons: Record<string, LucideIcon> = {
  layers: Layers,
  briefcase: Briefcase,
  tag: Tag,
  users: Users,
  "arrow-right": ArrowRight,
};

type NavItem = (typeof navigation)[number];

function iconFor(item: NavItem): LucideIcon | null {
  const key = "icon" in item ? item.icon : undefined;
  return key ? (navIcons[key] ?? null) : null;
}

function hasChildren(
  item: NavItem
): item is Extract<NavItem, { children: readonly unknown[] }> {
  return "children" in item;
}

function hasMega(item: NavItem): item is Extract<NavItem, { mega: string }> {
  return "mega" in item;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close any open dropdown on outside click and on Escape, so it never
  // gets stranded open for keyboard or touch users.
  useEffect(() => {
    if (!openMenu) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  // A small close delay keeps the panel usable while the pointer travels
  // from the trigger down into it.
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  function openNow(key: string) {
    cancelClose();
    setOpenMenu(key);
  }

  const centreLinks = navigation.filter((item) => !item.cta);
  const ctaLink = navigation.find((item) => item.cta);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar: tagline / search / contact number.
          z-20 against the nav row's z-10 below: both are stacking contexts
          at the same level, so without this the nav paints over the search
          dropdown that hangs down into it and swallows its clicks. */}
      <div className="relative z-20 border-b border-white/10 bg-black">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
        />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:px-6 lg:px-8">
          <p className="order-1 text-xs text-text-secondary">
            {topBanner.tagline}
          </p>

          <SiteSearch />

          <a
            href={`tel:${topBanner.phone.number.replace(/\s+/g, "")}`}
            className="order-3 inline-flex items-center gap-1.5 rounded text-xs text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            <Phone size={12} strokeWidth={2} aria-hidden />
            <span className="hidden text-text-secondary/70 md:inline">
              {topBanner.phone.label}:
            </span>
            {topBanner.phone.number}
          </a>
        </div>
      </div>

      <div className="relative z-10 bg-black">
        <div className="absolute inset-0 bg-black pointer-events-none" />
        <nav
          aria-label="Primary"
          className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-[7px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
          >
            {/* Wide wordmark (450x162) kept at native aspect ratio — cropping
                it to a square slices the lettering apart — and left
                black-backed so it sits naturally on the near-black nav. */}
            <Image
              src={assetPath("/images/logo.jpg")}
              alt="Alcon"
              width={450}
              height={162}
              priority
              className="h-11 w-auto object-contain sm:h-12"
            />
            <span className="sr-only">Alcon — Creative Intelligence, home</span>
          </Link>

          {/* Centred independently of the logo/CTA widths so the links sit on
              the true middle of the header. */}
          <ul
            ref={navRef}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          >
            {centreLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              const menuOpen = openMenu === item.href;
              const mega = hasMega(item) ? item.mega : null;

              const Icon = iconFor(item);

              if (!mega && !hasChildren(item)) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        linkBase,
                        "inline-flex items-center gap-1.5",
                        active
                          ? "text-text-primary"
                          : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {Icon && <Icon size={14} strokeWidth={2} aria-hidden />}
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-3.5 -bottom-0.5 h-px bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
                        />
                      )}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => openNow(item.href)}
                  onMouseLeave={scheduleClose}
                >
                  {/* A link, not a toggle button: hover already opens the
                      panel, so a click-to-toggle would immediately close it
                      again. Opens on hover and on focus so it stays
                      keyboard-reachable, while the click navigates. */}
                  <Link
                    href={item.href}
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    aria-current={active ? "page" : undefined}
                    onFocus={() => openNow(item.href)}
                    className={clsx(
                      linkBase,
                      "inline-flex items-center gap-1.5",
                      active
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {Icon && <Icon size={14} strokeWidth={2} aria-hidden />}
                    {item.label}
                    <span
                      aria-hidden
                      className={clsx(
                        "text-[0.6rem] transition-transform duration-200",
                        menuOpen && "rotate-180"
                      )}
                    >
                      ▾
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
                      />
                    )}
                  </Link>

                  {/* Only mounted while open — not just visually hidden.
                      Every item's panel used to render unconditionally
                      (CSS-only open/close), which left off-screen menus'
                      links sitting in the tab order and the a11y tree at
                      all times: a keyboard user tabbing through the nav
                      would land on invisible items, and role-based queries
                      would resolve duplicates across menus. `inert` was
                      tried first to suppress that without unmounting, but
                      isn't honoured for accessibility-tree exclusion by
                      every engine this needs to run on — actually removing
                      the closed panels is the reliable fix. */}
                  {menuOpen && (
                    <MegaMenuWrapper
                      open={menuOpen}
                      onMouseEnter={() => openNow(item.href)}
                      onMouseLeave={scheduleClose}
                    >
                      {mega === "services" && (
                        <ServicesStyleMegaMenu
                          testId="services-mega-menu"
                          columns={servicesMegaMenu}
                          stats={servicesMegaMenuStats}
                          promo={servicesMegaMenuPromo}
                          ctaLabel="All Services"
                          ctaHref="/services"
                          onNavigate={() => setOpenMenu(null)}
                        />
                      )}
                      {mega === "portfolio" && (
                        <ServicesStyleMegaMenu
                          testId="portfolio-mega-menu"
                          columns={portfolioMegaMenu}
                          stats={portfolioMegaMenuStats}
                          ctaLabel="View All Work"
                          ctaHref="/client-projects"
                          onNavigate={() => setOpenMenu(null)}
                        />
                      )}
                      {mega === "clients" && (
                        <ClientsMegaMenu
                          platform={clientPlatformLinks}
                          website={clientWebsiteLinks}
                        />
                      )}
                    </MegaMenuWrapper>
                  )}
                </li>
              );
            })}
          </ul>

          {ctaLink && (
            <Link
              href={ctaLink.href}
              className="hidden shrink-0 items-center gap-1.5 rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-5 py-2.5 text-sm font-heading font-medium text-text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent lg:inline-flex"
            >
              {ctaLink.label}
              <ArrowRight size={14} strokeWidth={2.25} aria-hidden />
            </Link>
          )}

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-[7px] border border-border text-text-primary lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
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
      </div>

      <div
        id="mobile-menu"
        className={clsx(
          "lg:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur transition-[max-height] duration-300",
          open ? "max-h-[36rem] overflow-y-auto" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 pb-4">
          {centreLinks.map((item) => {
            const submenuItems = hasChildren(item)
              ? item.children
              : hasMega(item) && item.mega === "services"
                ? servicesMegaMenu.flatMap((c) => c.items)
                : hasMega(item) && item.mega === "portfolio"
                  ? portfolioMegaMenu.flatMap((c) => c.items)
                  : null;
            const expandable = Boolean(submenuItems);
            const MobileIcon = iconFor(item);

            return (
              <li key={item.href}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="min-h-11 flex-1 inline-flex items-center gap-2 rounded-[7px] px-3 py-3 text-base font-medium text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                  >
                    {MobileIcon && (
                      <MobileIcon size={16} strokeWidth={2} aria-hidden />
                    )}
                    {item.label}
                  </Link>
                  {expandable && (
                    <button
                      type="button"
                      aria-expanded={mobileSubmenu === item.href}
                      aria-label={
                        mobileSubmenu === item.href
                          ? `Collapse ${item.label} list`
                          : `Expand ${item.label} list`
                      }
                      onClick={() =>
                        setMobileSubmenu((current) =>
                          current === item.href ? null : item.href
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-[7px] text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                    >
                      <span
                        aria-hidden
                        className={clsx(
                          "text-xs transition-transform duration-200",
                          mobileSubmenu === item.href && "rotate-180"
                        )}
                      >
                        ▾
                      </span>
                    </button>
                  )}
                </div>
                {expandable && mobileSubmenu === item.href && submenuItems && (
                  <ul className="mb-1 ml-3 border-l border-border pl-3">
                    {submenuItems.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block min-h-11 rounded-[7px] px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
