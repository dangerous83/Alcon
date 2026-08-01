import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteBuilder } from "@/components/forms/QuoteBuilder";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Build Your Custom Quote",
  description:
    "Select the creative services your project needs, build a focused brief, and request a tailored proposal from Alcon.",
  alternates: { canonical: `${siteConfig.url}/get-quote` },
};

const contactRoutes = [
  { label: "Email the studio", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}`, icon: Mail },
  { label: "Message on WhatsApp", value: "Fast project questions", href: siteConfig.contact.whatsapp, icon: MessageCircle, external: true },
  { label: "Studio", value: `${siteConfig.location.city}, ${siteConfig.location.country}`, icon: MapPin },
];

export default function GetQuotePage() {
  return (
    <main>
      <PageHero
        eyebrow="Custom quote · Clear scope · Right-sized team"
        headline="Build the right project, not the biggest package."
        accent="right"
        description="Choose the capabilities your idea needs, then add the context. We will turn that project stack into a focused scope and a tailored proposal."
        image="/images/pages/get-quote-hero.webp"
        imageAlt="Luminous modular creative services converging into one tailored project plan"
        primaryLabel="Choose your services"
        primaryHref="#quote-builder"
        secondaryLabel="Message on WhatsApp"
        secondaryHref={siteConfig.contact.whatsapp}
        animated
        stats={[
          { value: "No fixed bundles", label: "Select only what adds value" },
          { value: "Clear next steps", label: "Scope before pricing" },
          { value: "1 business day", label: "Typical first response" },
        ]}
      />

      <section className="border-b border-border bg-surface/60">
        <ul className="mx-auto grid max-w-7xl gap-px bg-border px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {contactRoutes.map((route) => {
            const Icon = route.icon;
            const content = (
              <>
                <Icon size={18} className="text-cyan-accent" aria-hidden />
                <span>
                  <span className="block text-xs text-text-secondary">{route.label}</span>
                  <span className="mt-1 block text-sm text-text-primary">{route.value}</span>
                </span>
              </>
            );

            return (
              <li key={route.label} className="bg-background">
                {route.href ? (
                  <a href={route.href} target={route.external ? "_blank" : undefined} rel={route.external ? "noopener noreferrer" : undefined} className="flex min-h-24 items-center gap-4 px-6 transition hover:bg-white/[0.03]">
                    {content}
                  </a>
                ) : (
                  <div className="flex min-h-24 items-center gap-4 px-6">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div id="quote-builder" className="scroll-mt-24">
        <QuoteBuilder />
      </div>
    </main>
  );
}
