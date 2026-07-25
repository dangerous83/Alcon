import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Heading } from "@/components/ui/Heading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { siteConfig } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Tell Alcon about your project and get a response within one business day.",
  alternates: { canonical: `${siteConfig.url}/get-quote` },
};

export default function GetQuotePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionLabel>Start a project</SectionLabel>
          <Heading as="h1" size="lg" className="mt-4">
            Tell us what you're building.
          </Heading>
          <p className="mt-4 text-text-secondary">
            Share a few details about the project and we'll get back to you
            with next steps — usually within one business day.
          </p>

          <div className="mt-10 space-y-4 border-t border-border pt-8 text-sm">
            <div>
              <p className="text-text-secondary">Email</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-text-primary hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
              >
                {siteConfig.contact.email}
              </a>
            </div>
            <div>
              <p className="text-text-secondary">Phone</p>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-text-primary hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
              >
                {siteConfig.contact.phone}
              </a>
            </div>
            <div>
              <p className="text-text-secondary">WhatsApp</p>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-cyan-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent rounded"
              >
                Message on WhatsApp
              </a>
            </div>
            <div>
              <p className="text-text-secondary">Studio</p>
              <p className="text-text-primary">
                {siteConfig.location.city}, {siteConfig.location.country}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
