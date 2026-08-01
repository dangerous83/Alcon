import {
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Sparkles,
  Box,
  Boxes,
  Wand2,
  Share2,
  Video,
  Camera,
  Film,
  GraduationCap,
  Grape,
  Newspaper,
  Bot,
  Workflow,
  Wheat,
  Bitcoin,
  ShieldCheck,
  Plane,
  Globe,
  UserRound,
  Clapperboard,
  Droplets,
  Truck,
  TrendingUp,
  Building2,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

export type MegaMenuItem = {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
};

export type MegaMenuColumn = {
  heading: string;
  items: MegaMenuItem[];
};

/**
 * Services mega menu — labels and grouping are locked (tests assert them),
 * but every description is written from Alcon's advertising / marketing /
 * AI-specialist positioning. Descriptions read as a short benefit line for
 * the buyer scanning the menu, not as an internal taxonomy note.
 *
 * Every item maps to a dedicated static service page. Keep these hrefs in
 * sync with src/lib/content/services.ts so every menu promise has a real,
 * search-ready destination.
 */
export const servicesMegaMenu: MegaMenuColumn[] = [
  {
    heading: "Design",
    items: [
      {
        label: "Brand Identity",
        description: "AI-accelerated identity systems for advertising",
        icon: Palette,
        href: "/services/branding",
      },
      {
        label: "Web UI/UX Design",
        description: "Conversion-led web and product interfaces",
        icon: LayoutGrid,
        href: "/services/web-ui-ux",
      },
      {
        label: "Graphic Design",
        description: "Campaign creative for digital and print",
        icon: ImageIcon,
        href: "/services/graphic-design",
      },
      {
        label: "Tutorials",
        description: "Hands-on AI creative workshops",
        icon: GraduationCap,
        href: "/services/tutorials",
        badge: "NEW",
      },
    ],
  },
  {
    heading: "Video & Animation",
    items: [
      {
        label: "Motion Design",
        description: "Ad-ready motion identities and stings",
        icon: Sparkles,
        href: "/services/motion",
      },
      {
        label: "2D Animation",
        description: "Explainer film and product storytelling",
        icon: Boxes,
        href: "/services/2d-animation",
      },
      {
        label: "3D Animation",
        description: "Architectural, product and campaign 3D",
        icon: Box,
        href: "/services/3d-animation",
      },
      {
        label: "AI Video",
        description: "Generative video ads built for paid social",
        icon: Wand2,
        href: "/services/ai-video",
      },
    ],
  },
  {
    heading: "Media & Production",
    items: [
      {
        label: "Social Media",
        description: "AI-powered content and paid social marketing",
        icon: Share2,
        href: "/services/social",
      },
      {
        label: "Videography",
        description: "Cinematic production for brand and campaign",
        icon: Video,
        href: "/services/videography",
      },
      {
        label: "Photography",
        description: "Product, brand and campaign shoots in Dubai",
        icon: Camera,
        href: "/services/photography",
      },
      {
        label: "Video Editing",
        description: "AI-assisted post for ads and long-form",
        icon: Film,
        href: "/services/editing",
      },
    ],
  },
];

/**
 * Right-hand promo panel for the Services mega menu — an image thumbnail
 * with a short headline and blurb so the panel reads as a full mega menu
 * rather than a bare link list.
 */
export type MegaMenuPromo = {
  image: string;
  eyebrow: string;
  heading: string;
  description: string;
  href: string;
};

export const servicesMegaMenuPromo: MegaMenuPromo = {
  image: "/images/services-thumbnail.webp",
  eyebrow: "Creative Intelligence",
  heading: "AI-accelerated, human-finished",
  description:
    "Every service runs on an AI-accelerated workflow — faster concepts and sharper craft, always reviewed and finished by our creative team.",
  href: "/services",
};

export const servicesMegaMenuStats = [
  { value: "12", label: "Services" },
  { value: "700+", label: "Projects" },
  { value: "12+", label: "Years Experience" },
] as const;

/**
 * Portfolio mega menu — filters into the portfolio by discipline. Labels
 * are locked by tests; descriptions read as short work categories a
 * visitor can pick between, not as service explanations (those live in
 * the Services mega menu).
 */
export const portfolioMegaMenu: MegaMenuColumn[] = [
  {
    heading: "",
    items: [
      {
        label: "Branding",
        description: "Identity systems & brand launches",
        icon: Palette,
        href: "/services/branding",
      },
      {
        label: "3D Animation",
        description: "Architectural, product & campaign 3D",
        icon: Box,
        href: "/services/3d-animation",
      },
      {
        label: "Motion Design",
        description: "Ad-ready motion & brand stings",
        icon: Sparkles,
        href: "/services/motion",
      },
      {
        label: "Social Media",
        description: "Paid social & content campaigns",
        icon: Share2,
        href: "/services/social",
      },
    ],
  },
  {
    heading: "",
    items: [
      {
        label: "UI/UX Design",
        description: "Web platforms & product interfaces",
        icon: LayoutGrid,
        href: "/services/web-ui-ux",
      },
      {
        label: "2D Animation",
        description: "Explainer film & product storytelling",
        icon: Boxes,
        href: "/services/2d-animation",
      },
      {
        label: "Videography",
        description: "Cinematic brand & campaign shoots",
        icon: Video,
        href: "/services/videography",
      },
      {
        label: "Photography",
        description: "Product, brand & campaign photography",
        icon: Camera,
        href: "/services/photography",
      },
    ],
  },
];

export const portfolioMegaMenuStats = [
  { value: "700+", label: "Projects" },
  { value: "150+", label: "Clients" },
  { value: "12+", label: "Years" },
] as const;

export const portfolioMegaMenuPromo: MegaMenuPromo = {
  image: "/images/solution-thumbnail.webp",
  eyebrow: "Selected Work",
  heading: "A living book of work",
  description:
    "700+ real campaigns delivered for 150+ brands across every discipline — finished work, not case-study mockups.",
  href: "/client-projects",
};

export type ExternalLinkItem = { label: string; url: string; icon: LucideIcon };

/**
 * Client work — real external links the client supplied directly (not
 * placeholder). These point off-site, so no internal page/route is
 * needed for them, unlike the rest of the nav. Each carries a leading
 * icon so the Clients dropdown reads as a proper mega menu.
 */
export const clientPlatformLinks: ExternalLinkItem[] = [
  { label: "Ui Forge", url: "https://www.uiforge.site/", icon: LayoutGrid },
  { label: "Vineyard", url: "https://www.vineyardchrist.com/", icon: Grape },
  { label: "Pixela", url: "https://www.pixela-ai.com/", icon: Sparkles },
  { label: "Forge Suite", url: "https://www.forgesuite.online/", icon: Boxes },
  { label: "Media HQ", url: "https://marketing.securevisanow.com/", icon: Newspaper },
  { label: "AlvinAI", url: "https://www.alvinai-dev.com/", icon: Bot },
  { label: "Build Flow", url: "https://www.buildflow-tech.com", icon: Workflow },
  { label: "Global Harvest", url: "https://www.globalharvest.online/", icon: Wheat },
  { label: "Forge Crypto", url: "https://forge-crypto-omega.vercel.app/", icon: Bitcoin },
];

export const clientWebsiteLinks: ExternalLinkItem[] = [
  { label: "ITSEC", url: "https://itsecnow.com/", icon: ShieldCheck },
  { label: "SecureVisa", url: "https://www.securevisanow.com", icon: Plane },
  { label: "Koll", url: "https://www.koll.ae", icon: Globe },
  { label: "Tina Portfolio", url: "https://www.tinaramos.online/", icon: UserRound },
  { label: "Alcon Media", url: "https://www.alcon-online.site/", icon: Clapperboard },
  { label: "Kangen", url: "https://kangenwateralife4u.com/", icon: Droplets },
  { label: "Logistic", url: "https://www.ilsmtc.com/", icon: Truck },
  { label: "Malath", url: "https://malathinvestment.com/", icon: TrendingUp },
  { label: "UHUD", url: "https://www.uhud.online/", icon: Building2 },
  { label: "VerifiX", url: "https://overview.verifix.itsecnow.com/", icon: BadgeCheck },
];

export const clientsMegaMenuPromo: MegaMenuPromo = {
  image: "/images/client-thumbnail.webp",
  eyebrow: "Trusted Worldwide",
  heading: "Brands that build with Alcon",
  description:
    "Platforms and websites shipped for clients across the globe — live products in the wild, not mockups.",
  href: "/client-projects",
};
