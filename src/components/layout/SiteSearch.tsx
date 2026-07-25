"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchIndex } from "@/lib/content/search-index";
import { clsx } from "@/lib/clsx";

const MAX_RESULTS = 8;

function matches(entry: (typeof searchIndex)[number], query: string) {
  const haystack = `${entry.label} ${entry.keywords ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

/**
 * Site-wide search for the announcement bar. There's no backend for this
 * static export, so results come from a hand-built index of real routes
 * (search-index.ts) rather than a hosted search service — every result is
 * a page that actually exists, not a fabrication of "search" that goes
 * nowhere.
 */
export function SiteSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((entry) => matches(entry, q)).slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) go(target.href);
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative order-2 w-full max-w-xs sm:order-2 sm:mx-auto">
      <div className="relative">
        <Search
          size={14}
          strokeWidth={2}
          aria-hidden
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="search"
          role="combobox"
          aria-label="Search the site"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          placeholder="Search the site…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-[7px] border border-border bg-surface py-1 pl-8 pr-2.5 text-xs text-text-primary placeholder:text-text-secondary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
        />
      </div>

      {showPanel && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-[7px] border border-border bg-surface-elevated/98 py-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-xs text-text-secondary">
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((entry, index) => (
              <li key={`${entry.group}-${entry.href}-${entry.label}`} role="option" aria-selected={index === activeIndex}>
                <Link
                  href={entry.href}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(entry.href)}
                  className={clsx(
                    "flex items-center justify-between gap-3 px-3 py-2 text-xs transition-colors",
                    index === activeIndex
                      ? "bg-white/[0.06] text-text-primary"
                      : "text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                  )}
                >
                  <span className="truncate">{entry.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-text-secondary/60">
                    {entry.group}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
