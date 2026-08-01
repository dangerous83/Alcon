import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ExternalLinkItem } from "@/lib/content/mega-menu";
import { assetPath } from "@/lib/asset-path";

export function ClientLinkGrid({ items }: { items: ExternalLinkItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-border bg-surface-elevated transition duration-300 hover:-translate-y-1 hover:border-cyan-accent/50 hover:shadow-[0_24px_65px_-32px_rgba(22,199,255,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
            >
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-black">
                <Image
                  src={assetPath(item.image)}
                  alt={`${item.label} live project cover`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-75 transition group-hover:opacity-55" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                  Live project
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-accent">
                    <Icon size={18} strokeWidth={1.65} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-base font-medium text-text-primary">
                      {item.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-text-secondary">View the live experience</p>
                  </div>
                </div>
                <ArrowUpRight
                  size={19}
                  strokeWidth={1.65}
                  aria-hidden
                  className="shrink-0 text-text-secondary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-accent"
                />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
