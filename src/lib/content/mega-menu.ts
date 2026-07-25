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
 * Services mega menu — labels/descriptions/grouping match the reference
 * screenshot exactly. The site's content model only has 5 built-out
 * service pages (branding, motion, editing, social, tutorials — see
 * src/lib/content/services.ts), so items map onto the closest existing
 * page rather than 404ing; this is a real routing constraint of a static
 * export, not a content decision. Swap individual hrefs once dedicated
 * pages exist for e.g. Photography or AI Video.
 */
export const servicesMegaMenu: MegaMenuColumn[] = [
  {
    heading: "Design",
    items: [
      {
        label: "Brand Identity",
        description: "Logo, identity & brand systems",
        icon: Palette,
        href: "/services/branding",
      },
      {
        label: "Web UI/UX Design",
        description: "Web & mobile interfaces",
        icon: LayoutGrid,
        href: "/services/branding",
      },
      {
        label: "Graphic Design",
        description: "Print & digital marketing",
        icon: ImageIcon,
        href: "/services/branding",
      },
      {
        label: "White Label",
        description: "Ready-made rebrandable websites",
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
        description: "Motion graphics & effects",
        icon: Sparkles,
        href: "/services/motion",
      },
      {
        label: "2D Animation",
        description: "Explainer & educational",
        icon: Boxes,
        href: "/services/motion",
      },
      {
        label: "3D Animation",
        description: "Architectural & product",
        icon: Box,
        href: "/services/motion",
      },
      {
        label: "AI Video",
        description: "AI-powered video creation",
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
        description: "Content & strategy",
        icon: Share2,
        href: "/services/social",
      },
      {
        label: "Videography",
        description: "Cinematic video production",
        icon: Video,
        href: "/services/editing",
      },
      {
        label: "Photography",
        description: "Professional photo shoots",
        icon: Camera,
        href: "/services/editing",
      },
      {
        label: "Video Editing",
        description: "Post-production & editing",
        icon: Film,
        href: "/services/editing",
      },
      {
        label: "Weekend Tutorials",
        description: "Live creative workshops",
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
 * Portfolio mega menu (the nav item formerly labelled "Solutions").
 * Same items/grouping as the reference screenshot's "Portfolio" dropdown.
 */
export const portfolioMegaMenu: MegaMenuColumn[] = [
  {
    heading: "",
    items: [
      {
        label: "Branding",
        description: "Logo & Identity Design",
        icon: Palette,
        href: "/services/branding",
      },
      {
        label: "3D Animation",
        description: "Architectural & Product",
        icon: Box,
        href: "/services/motion",
      },
      {
        label: "Motion Design",
        description: "Motion Graphics & Effects",
        icon: Sparkles,
        href: "/services/motion",
      },
      {
        label: "Social Media",
        description: "Content & Campaigns",
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
        description: "Web & App Platforms",
        icon: LayoutGrid,
        href: "/services/branding",
      },
      {
        label: "2D Animation",
        description: "Explainer & Educational",
        icon: Boxes,
        href: "/services/motion",
      },
      {
        label: "Videography",
        description: "Cinematic Production",
        icon: Video,
        href: "/services/editing",
      },
      {
        label: "Photography",
        description: "Professional Shoots",
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
