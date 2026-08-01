import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ExternalLinkItem } from "@/lib/content/mega-menu";
import { assetPath } from "@/lib/asset-path";

type ClientLinkGridProps = {
  items: ExternalLinkItem[];
  kind: "Platform" | "Website";
};

export function ClientLinkGrid({ items, kind }: ClientLinkGridProps) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const domain = new URL(item.url).hostname.replace(/^www\./, "");

        return (
          <li key={item.url} className="min-w-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${item.label} live ${kind.toLowerCase()} project`}
              className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#090b12] transition duration-500 ease-out hover:-translate-y-1.5 hover:border-cyan-accent/45 hover:shadow-[0_30px_80px_-38px_rgba(22,199,255,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-accent"
            >
              <div className="flex h-9 items-center gap-1.5 border-b border-white/10 bg-black/80 px-4" aria-hidden>
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400/80" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-accent/80" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
                  {domain}
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-[#05060a]">
                <Image
                  src={assetPath(item.image)}
                  alt={`${item.label} ${kind.toLowerCase()} project thumbnail`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.045]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-black/10 opacity-80 transition duration-500 group-hover:opacity-45" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                  Live {kind}
                </span>
              </div>

              <div className="relative flex flex-1 gap-4 p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-cyan-accent transition duration-500 group-hover:border-cyan-accent/30 group-hover:bg-cyan-accent/10 group-hover:shadow-[0_0_28px_-10px_rgba(22,199,255,0.9)]">
                  <Icon size={18} strokeWidth={1.65} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-accent/80">
                    Selected {kind}
                  </p>
                  <h3 className="mt-1.5 font-heading text-lg font-medium text-text-primary">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.65}
                  aria-hidden
                  className="absolute right-5 top-6 shrink-0 text-text-secondary transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-accent sm:right-6 sm:top-7"
                />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

