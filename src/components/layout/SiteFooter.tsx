import Link from "next/link";
import Image from "next/image";
import { siteConfig, footerLinks, navigation } from "@/lib/content/site";
import { assetPath } from "@/lib/asset-path";

// Built from `navigation` rather than a hand-duplicated list, so the footer
// can't quietly fall out of sync with the header again — every label/href
// pair here is exactly what's in the nav bar, in the same order.
const companyLinks = [
  ...navigation
    .filter((item) => !item.cta)
    .map((item) => ({ label: item.label, href: item.href })),
  ...footerLinks.companyExtra,
  ...navigation
    .filter((item) => item.cta)
    .map((item) => ({ label: item.label, href: item.href })),
];

const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "TikTok", href: siteConfig.social.tiktok },
  { label: "Twitter / X", href: siteConfig.social.twitter },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
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
          </div>

          <nav aria-label="Services">
            <h2 className="font-heading text-sm font-medium text-text-primary">
              Services
            </h2>
            <ul className="mt-4 space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
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

          <nav aria-label="Company">
            <h2 className="font-heading text-sm font-medium text-text-primary">
              Company
            </h2>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p>Dubai, United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
