// Content for the HUD reveal panel that overlays the hero once the second
// scroll-scrubbed clip finishes on the front-view brain. Card copy mirrors
// the site's existing Services / Portfolio / White Label sections rather
// than inventing new claims — see mega-menu.ts and nav-pages.ts for the
// source figures (13 services, 700+ projects, 12+ years, etc).

import { Sparkles, Briefcase, Layers, type LucideIcon } from "lucide-react";

export type RevealCard = {
  id: "services" | "portfolio" | "white-label";
  /** Terminal-style node ID shown on the card and in the readout header. */
  code: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  heading: string;
  description: string;
  /** Key/value rows rendered as the HUD readout's data table. */
  metrics: { label: string; value: string }[];
  bullets: string[];
  cta: { label: string; href: string };
};

export const revealCards: RevealCard[] = [
  {
    id: "services",
    code: "NODE-01",
    label: "Services",
    icon: Sparkles,
    eyebrow: "13 services across 3 disciplines",
    heading: "Design, motion, and production under one roof",
    description:
      "Brand identity, UI/UX, motion design, and video production — Alcon runs the full creative stack as one connected system instead of handing you between vendors.",
    metrics: [
      { label: "Disciplines", value: "03" },
      { label: "Services", value: "13" },
      { label: "Delivery", value: "IN-HOUSE" },
    ],
    bullets: [
      "Brand identity & design systems",
      "Motion, 2D/3D animation & AI video",
      "Social content, videography & photography",
    ],
    cta: { label: "Explore Services", href: "/services" },
  },
  {
    id: "portfolio",
    code: "NODE-02",
    label: "Portfolio",
    icon: Briefcase,
    eyebrow: "700+ projects, 150+ clients",
    heading: "Work built for platforms and brands across the region",
    description:
      "From SaaS platforms to consumer brands, see the range of work Alcon has shipped for clients across Dubai and beyond.",
    metrics: [
      { label: "Projects", value: "700+" },
      { label: "Clients", value: "150+" },
      { label: "Experience", value: "12+ YRS" },
    ],
    bullets: [
      "9 platform builds, 10 brand websites shipped",
      "12+ years of creative & production experience",
      "Case studies spanning branding to full digital builds",
    ],
    cta: { label: "View Portfolio", href: "/portfolio" },
  },
  {
    id: "white-label",
    code: "NODE-03",
    label: "White Label",
    icon: Layers,
    eyebrow: "Resell Alcon's production capacity",
    heading: "Production capacity other agencies resell under their own brand",
    description:
      "Partner studios and agencies use Alcon's design and production bandwidth to deliver client work under their own name, with briefs and revisions flowing through a dedicated partner workflow.",
    metrics: [
      { label: "Model", value: "PARTNER" },
      { label: "Branding", value: "YOURS" },
      { label: "Pricing", value: "RESALE" },
    ],
    bullets: [
      "White-labelled design & motion delivery",
      "Dedicated partner briefing & revision flow",
      "Flexible resale pricing for studios & agencies",
    ],
    cta: { label: "Partner With Us", href: "/white-label" },
  },
];
