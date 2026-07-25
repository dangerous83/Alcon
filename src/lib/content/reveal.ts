// Content for the interactive reveal panel that appears once the hero's
// second scroll-scrubbed video (the "brain" close-up) finishes playing.
// Card copy mirrors the site's existing Services / Portfolio / White Label
// sections rather than inventing new claims — see mega-menu.ts and
// nav-pages.ts for the source figures (13 services, 700+ projects, etc).

import { Sparkles, Briefcase, Layers, type LucideIcon } from "lucide-react";

export type RevealCard = {
  id: "services" | "portfolio" | "white-label";
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  heading: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
};

export const revealCards: RevealCard[] = [
  {
    id: "services",
    label: "Services",
    icon: Sparkles,
    eyebrow: "13 services across 3 disciplines",
    heading: "Design, motion, and production under one roof",
    description:
      "Brand identity, UI/UX, motion design, and video production — Alcon runs the full creative stack as one connected system instead of handing you between vendors.",
    bullets: [
      "Brand identity & design systems",
      "Motion, 2D/3D animation & AI video",
      "Social content, videography & photography",
    ],
    cta: { label: "Explore Services", href: "/services" },
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: Briefcase,
    eyebrow: "700+ projects, 150+ clients",
    heading: "Work built for platforms and brands across the region",
    description:
      "From SaaS platforms to consumer brands, see the range of work Alcon has shipped for clients across Dubai and beyond.",
    bullets: [
      "9 platform builds, 10 brand websites shipped",
      "12+ years of creative & production experience",
      "Case studies spanning branding to full digital builds",
    ],
    cta: { label: "View Portfolio", href: "/portfolio" },
  },
  {
    id: "white-label",
    label: "White Label",
    icon: Layers,
    eyebrow: "Resell Alcon's production capacity",
    heading: "Production capacity other agencies resell under their own brand",
    description:
      "Partner studios and agencies use Alcon's design and production bandwidth to deliver client work under their own name, with briefs and revisions flowing through a dedicated partner workflow.",
    bullets: [
      "White-labelled design & motion delivery",
      "Dedicated partner briefing & revision flow",
      "Flexible resale pricing for studios & agencies",
    ],
    cta: { label: "Partner With Us", href: "/white-label" },
  },
];
