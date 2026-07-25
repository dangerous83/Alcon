import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  Briefcase,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/content/site";
import { portfolioMegaMenu } from "@/lib/content/mega-menu";
import { assetPath } from "@/lib/asset-path";

type FooterSection = {
  heading: string;
  href: string;
  icon: LucideIcon;
  items: { label: string; href: string }[];
};

// Every heading here maps to a nav-bar destination and carries the same icon
// as the header link, so the footer reads as a mirror of the primary nav
// rather than a second, drifting information architecture.
const sections: FooterSection[] = [
  {
    heading: "Services",
    href: "/services",
    icon: Layers,
    items: [...footerLinks.services],
  },
  {
    heading: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
    // Flattened from the header's portfolio mega-menu so the footer follows
    // whatever the nav is showing without a hand-maintained duplicate.
    items: portfolioMegaMenu
      .flatMap((column) => column.items)
      .map((item) => ({ label: item.label, href: item.href })),
  },
  {
    heading: "White Label",
    href: "/white-label",
    icon: Tag,
    items: [
      { label: "Programme Overview", href: "/white-label" },
      { label: "Start a Project", href: "/get-quote" },
    ],
  },
  {
    heading: "Clients",
    href: "/client-projects",
    icon: Users,
    items: [
      { label: "All Client Work", href: "/client-projects" },
      { label: "Platform Projects", href: "/client-projects/platform" },
      { label: "Website Projects", href: "/client-projects/website" },
    ],
  },
];

// Brand-icon SVGs. This lucide build ships without the social brand set, so
// each is inlined in a 24×24 viewBox and driven by currentColor to match the
// rest of the footer's icon language.
type SvgProps = { className?: string };

const InstagramIcon = (p: SvgProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = (p: SvgProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
    <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H7.8V14h2.7v8h3z" />
  </svg>
);

const TikTokIcon = (p: SvgProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.06a8.16 8.16 0 0 0 4.77 1.52V7.15a4.85 4.85 0 0 1-1.84-.46z" />
  </svg>
);

const XIcon = (p: SvgProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
    <path d="M17.53 3H20.5l-6.5 7.43L21.75 21H15.9l-4.58-6-5.24 6H3.11l6.95-7.94L2.5 3h6l4.14 5.48L17.53 3zm-1.04 16.2h1.65L7.6 4.72H5.83l10.66 14.48z" />
  </svg>
);

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "Twitter / X", href: siteConfig.social.twitter, Icon: XIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              {/* Native aspect ratio — see the note in SiteHeader. The
                  wordmark already reads "Alcon", so no text label beside it. */}
              <Image
                src={assetPath("/images/logo.jpg")}
                alt="Alcon"
                width={450}
                height={162}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-text-secondary">
              {siteConfig.description}
            </p>
            <p className="mt-6 text-sm text-text-secondary">
              {siteConfig.location.city}, {siteConfig.location.country}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <a
                  className="text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                  href={`mailto:${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  className="text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                  href={`tel:${siteConfig.contact.phone}`}
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>

            {/* Icon-only per client request — labels are announced via
                aria-label so screen readers still get the destination. */}
            <ul className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition hover:border-cyan-accent hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {sections.map(({ heading, href, icon: Icon, items }) => (
            <nav key={heading} aria-label={heading}>
              <h2 className="flex items-center gap-2 font-heading text-sm font-medium text-text-primary">
                <Icon size={14} strokeWidth={2} aria-hidden />
                <Link
                  href={href}
                  className="rounded hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
                >
                  {heading}
                </Link>
              </h2>
              <ul className="mt-4 space-y-2">
                {items.map((link) => (
                  <li key={`${heading}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/blog"
              className="hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              Journal
            </Link>
            <Link
              href="/get-quote"
              className="hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
            >
              Get a Quote
            </Link>
            <p>Dubai, United Arab Emirates</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
