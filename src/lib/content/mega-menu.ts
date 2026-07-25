import {
  Palette,
  LayoutGrid,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Box,
  Boxes,
  Wand2,
  Share2,
  Video,
  Camera,
  Film,
  GraduationCap,
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
 * The site's content model only has 5 built-out service pages (branding,
 * motion, editing, social, tutorials — see src/lib/content/services.ts),
 * so items map onto the closest existing page rather than 404ing; this is
 * a real routing constraint of a static export, not a content decision.
 * Swap individual hrefs once dedicated pages exist for e.g. Photography
 * or AI Video.
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
        href: "/services/branding",
      },
      {
        label: "Graphic Design",
        description: "Campaign creative for digital and print",
        icon: ImageIcon,
        href: "/services/branding",
      },
      {
        label: "White Label",
        description: "Rebrandable websites for agencies to resell",
        icon: Layers,
        href: "/white-label",
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
        href: "/services/motion",
      },
      {
        label: "3D Animation",
        description: "Architectural, product and campaign 3D",
        icon: Box,
        href: "/services/motion",
      },
      {
        label: "AI Video",
        description: "Generative video ads built for paid social",
        icon: Wand2,
        href: "/services/motion",
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
        href: "/services/editing",
      },
      {
        label: "Photography",
        description: "Product, brand and campaign shoots in Dubai",
        icon: Camera,
        href: "/services/editing",
      },
      {
        label: "Video Editing",
        description: "AI-assisted post for ads and long-form",
        icon: Film,
        href: "/services/editing",
      },
      {
        label: "Weekend Tutorials",
        description: "Hands-on AI creative workshops",
        icon: GraduationCap,
        href: "/services/tutorials",
        badge: "NEW",
      },
    ],
  },
];

export const servicesMegaMenuStats = [
  { value: "13", label: "Services" },
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
        href: "/services/motion",
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
        href: "/services/branding",
      },
      {
        label: "2D Animation",
        description: "Explainer film & product storytelling",
        icon: Boxes,
        href: "/services/motion",
      },
      {
        label: "Videography",
        description: "Cinematic brand & campaign shoots",
        icon: Video,
        href: "/services/editing",
      },
      {
        label: "Photography",
        description: "Product, brand & campaign photography",
        icon: Camera,
        href: "/services/editing",
      },
    ],
  },
];

export const portfolioMegaMenuStats = [
  { value: "700+", label: "Projects" },
  { value: "150+", label: "Clients" },
  { value: "12+", label: "Years" },
] as const;

export type ExternalLinkItem = { label: string; url: string };

/**
 * Client work — real external links the client supplied directly (not
 * placeholder). These point off-site, so no internal page/route is
 * needed for them, unlike the rest of the nav.
 */
export const clientPlatformLinks: ExternalLinkItem[] = [
  { label: "Ui Forge", url: "https://www.uiforge.site/" },
  { label: "Vineyard", url: "https://www.vineyardchrist.com/" },
  { label: "Pixela", url: "https://www.pixela-ai.com/" },
  { label: "Forge Suite", url: "https://www.forgesuite.online/" },
  { label: "Media HQ", url: "https://marketing.securevisanow.com/" },
  { label: "AlvinAI", url: "https://www.alvinai-dev.com/" },
  { label: "Build Flow", url: "https://www.buildflow-tech.com" },
  { label: "Global Harvest", url: "https://www.globalharvest.online/" },
  { label: "Forge Crypto", url: "https://forge-crypto-omega.vercel.app/" },
];

export const clientWebsiteLinks: ExternalLinkItem[] = [
  { label: "ITSEC", url: "https://itsecnow.com/" },
  { label: "SecureVisa", url: "https://www.securevisanow.com" },
  { label: "Koll", url: "https://www.koll.ae" },
  { label: "Tina Portfolio", url: "https://www.tinaramos.online/" },
  { label: "Alcon Media", url: "https://www.alcon-online.site/" },
  { label: "Kangen", url: "https://kangenwateralife4u.com/" },
  { label: "Logistic", url: "https://www.ilsmtc.com/" },
  { label: "Malath", url: "https://malathinvestment.com/" },
  { label: "UHUD", url: "https://www.uhud.online/" },
  { label: "VerifiX", url: "https://overview.verifix.itsecnow.com/" },
];
