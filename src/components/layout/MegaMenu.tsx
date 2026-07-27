import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";
import { clsx } from "@/lib/clsx";
import { assetPath } from "@/lib/asset-path";
import type {
  MegaMenuColumn,
  MegaMenuPromo,
  ExternalLinkItem,
} from "@/lib/content/mega-menu";

/**
 * Decorative "analysis" loop that fills the empty space at the bottom of a
 * mega menu — a grid of small digital squares pulsing in a diagonal wave, so
 * the panel reads as a live, high-tech / AI surface rather than dead space.
 * Purely ornamental (aria-hidden) and desktop-only; respects
 * prefers-reduced-motion via the CSS in globals.css.
 */
function MegaMenuScan() {
  const cols = 24;
  const rows = 3;
  const cells = Array.from({ length: cols * rows });
  return (
    <div aria-hidden className="mt-auto hidden select-none pt-8 lg:block">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-accent" />
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-text-secondary/50">
          Analyzing creative signals
        </span>
      </div>
      <div
        className="grid w-full gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          return (
            <span
              key={i}
              className="mega-scan-cell aspect-square rounded-[2px]"
              style={{ animationDelay: `${(x + y * 2) * 65}ms` }}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Right-hand promo panel shared by every mega menu (services, portfolio,
 * clients): a thumbnail image with an eyebrow, heading, and short blurb, so
 * each dropdown reads as a full mega menu rather than a bare link list.
 */
function PromoPanel({
  promo,
  onNavigate,
}: {
  promo: MegaMenuPromo;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={promo.href}
      onClick={onNavigate}
      className="group block shrink-0 border-t border-border p-6 sm:p-8 lg:w-64 lg:border-l lg:border-t-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-[9px] border border-border">
        <Image
          src={assetPath(promo.image)}
          alt=""
          fill
          sizes="256px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-accent">
        {promo.eyebrow}
      </span>
      <span className="mt-1.5 flex items-center gap-1.5 font-heading text-sm font-semibold text-text-primary">
        {promo.heading}
        <ArrowRight
          size={14}
          strokeWidth={2}
          aria-hidden
          className="shrink-0 -translate-x-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      </span>
      <span className="mt-2 block text-xs leading-relaxed text-text-secondary">
        {promo.description}
      </span>
    </Link>
  );
}

export function ServicesStyleMegaMenu({
  columns,
  stats,
  ctaLabel,
  ctaHref,
  onNavigate,
  testId,
  promo,
}: {
  columns: MegaMenuColumn[];
  stats: readonly { value: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
  onNavigate: () => void;
  testId: string;
  promo?: MegaMenuPromo;
}) {
  return (
    <div
      data-testid={testId}
      className="w-[min(64rem,calc(100vw-2rem))] overflow-hidden rounded-[7px] border border-border bg-surface-elevated/98 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] backdrop-blur"
    >
      {/* Link list on the left, promo panel (when supplied) on the right so
          the menu reads as a full mega menu rather than a bare column list. */}
      <div className="flex flex-col lg:flex-row">
      <div className="flex flex-1 flex-col p-6 sm:p-8">
      <div
        className={clsx(
          "grid gap-8 sm:gap-6",
          columns.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        )}
      >
        {columns.map((column) => (
          <div key={column.heading}>
            {column.heading && (
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#D12DFF_100%)]"
                />
                {column.heading}
              </p>
            )}
            <ul className="space-y-1">
              {column.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group flex items-start gap-3 rounded-[7px] px-2 py-2.5 transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-border bg-surface text-text-secondary transition-colors group-hover:border-cyan-accent/40 group-hover:text-cyan-accent"
                      >
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#D12DFF_100%)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-text-primary">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-text-secondary">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
        {/* AI-style "analysis" loop fills the empty space below the columns. */}
        {promo && <MegaMenuScan />}
      </div>

        {promo && <PromoPanel promo={promo} onNavigate={onNavigate} />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-surface/60 px-6 py-4 sm:px-8">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {stats.map((stat) => (
            <li key={stat.label} className="text-xs text-text-secondary">
              <span className="font-heading font-semibold text-text-primary">
                {stat.value}
              </span>{" "}
              {stat.label}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/get-quote"
            onClick={onNavigate}
            className="hidden items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
          >
            <FileText size={14} strokeWidth={1.75} aria-hidden />
            Proposals
          </Link>
          <Link
            href={ctaHref}
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] px-4 py-2 text-xs font-semibold text-text-primary transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          >
            {ctaLabel}
            <ArrowRight size={14} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ClientsMegaMenu({
  platform,
  website,
  promo,
  onNavigate,
}: {
  platform: ExternalLinkItem[];
  website: ExternalLinkItem[];
  promo?: MegaMenuPromo;
  onNavigate?: () => void;
}) {
  const columns: { heading: string; href: string; items: ExternalLinkItem[] }[] = [
    { heading: "Platform", href: "/client-projects/platform", items: platform },
    { heading: "Website", href: "/client-projects/website", items: website },
  ];

  return (
    <div
      data-testid="clients-mega-menu"
      className={clsx(
        "overflow-hidden rounded-[7px] border border-border bg-surface-elevated/98 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] backdrop-blur",
        promo
          ? "w-[min(68rem,calc(100vw-2rem))]"
          : "w-[min(52rem,calc(100vw-2rem))]"
      )}
    >
      {/* Link columns on the left, promo panel (when supplied) on the right. */}
      <div className="flex flex-col lg:flex-row">
      <div className="grid flex-1 gap-8 p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
        {columns.map((column) => (
          <div key={column.heading}>
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#D12DFF_100%)]"
                />
                {column.heading}
              </p>
              <Link
                href={column.href}
                className="text-[11px] font-medium text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
              >
                View all
              </Link>
            </div>
            {/* Two sub-columns so every link is visible at once — no
                internal scroll — even at 9-10 items per section. Each item
                carries a leading boxed icon so the Clients panel matches the
                Services / Portfolio mega-menu language. */}
            <ul className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {column.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 rounded-[7px] px-2 py-2 text-sm text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                    >
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-border bg-surface text-text-secondary transition-colors group-hover:border-cyan-accent/40 group-hover:text-cyan-accent"
                      >
                        <Icon size={15} strokeWidth={1.75} />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

        {promo && <PromoPanel promo={promo} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

export function MegaMenuWrapper({
  open,
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      // `inert` (not just opacity/pointer-events) while closed: without it,
      // the panel's links stay in the tab order and in the a11y tree even
      // though they're invisible — a keyboard user tabbing through the nav
      // would land on hidden menu items. `inert` removes them from focus
      // and from assistive tech while still letting the close transition
      // animate.
      inert={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={clsx(
        // No top padding: the panel sits flush against the nav, with no gap
        // between the navbar and the dropdown.
        "absolute left-1/2 top-full -translate-x-1/2 transition-all duration-200",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0"
      )}
    >
      {children}
    </div>
  );
}
