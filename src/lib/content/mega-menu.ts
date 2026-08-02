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
  Shirt,
  Coffee,
  Sticker,
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
        href: "/portfolio/branding",
      },
      {
        label: "3D Animation",
        description: "Architectural, product & campaign 3D",
        icon: Box,
        href: "/portfolio/3d-animation",
      },
      {
        label: "Motion Design",
        description: "Ad-ready motion & brand stings",
        icon: Sparkles,
        href: "/portfolio/motion-design",
      },
      {
        label: "Social Media",
        description: "Paid social & content campaigns",
        icon: Share2,
        href: "/portfolio/social-media",
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
        href: "/portfolio/ui-ux-design",
      },
      {
        label: "2D Animation",
        description: "Explainer film & product storytelling",
        icon: Boxes,
        href: "/portfolio/2d-animation",
      },
      {
        label: "Videography",
        description: "Cinematic brand & campaign shoots",
        icon: Video,
        href: "/portfolio/videography",
      },
      {
        label: "Photography",
        description: "Product, brand & campaign photography",
        icon: Camera,
        href: "/portfolio/photography",
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

export const printMegaMenu: MegaMenuColumn[] = [
  {
    heading: "Apparel",
    items: [
      {
        label: "Custom T-shirt",
        description: "Premium branded tees for teams, events, and launches",
        icon: Shirt,
        href: "/print/custom-t-shirts",
      },
      {
        label: "Hoodies",
        description: "High-impact apparel with durable custom finishing",
        icon: Shirt,
        href: "/print/hoodies",
      },
    ],
  },
  {
    heading: "Everyday Brand",
    items: [
      {
        label: "Mugs & Tumblers",
        description: "Branded drinkware made for daily visibility",
        icon: Coffee,
        href: "/print/mugs-tumblers",
      },
      {
        label: "Stickers",
        description: "Die-cut brand details for packaging and promotion",
        icon: Sticker,
        href: "/print/stickers",
      },
    ],
  },
];

export const printMegaMenuStats = [
  { value: "04", label: "Print categories" },
  { value: "Premium", label: "Materials & finish" },
  { value: "Dubai", label: "Creative production" },
] as const;

export const printMegaMenuPromo: MegaMenuPromo = {
  image: "/images/print/print-overview-hero.webp",
  eyebrow: "Print & Merchandise",
  heading: "Make the brand tangible",
  description:
    "Custom apparel, drinkware, and stickers designed as one polished brand system—not generic merchandise.",
  href: "/print",
};

export type ExternalLinkItem = {
  label: string;
  description: string;
  url: string;
  image: string;
  icon: LucideIcon;
};

/**
 * Client work — real external links the client supplied directly (not
 * placeholder). These point off-site, so no internal page/route is
 * needed for them, unlike the rest of the nav. Each carries a leading
 * icon so the Clients dropdown reads as a proper mega menu.
 */
export const clientPlatformLinks: ExternalLinkItem[] = [
  { label: "Ui Forge", description: "AI-assisted UI/UX workspace for faster product design.", url: "https://www.uiforge.site/", image: "/images/clients/platform-ui-forge-v2.webp", icon: LayoutGrid },
  { label: "Vineyard", description: "Faith-centred community platform connecting people and purpose.", url: "https://www.vineyardchrist.com/", image: "/images/clients/platform-vineyard.webp", icon: Grape },
  { label: "Pixela", description: "Generative AI product for visual creation and smart workflows.", url: "https://www.pixela-ai.com/", image: "/images/clients/platform-pixela.webp", icon: Sparkles },
  { label: "Forge Suite", description: "Connected business tools organised in one scalable workspace.", url: "https://www.forgesuite.online/", image: "/images/clients/platform-forge-suite-v2.webp", icon: Boxes },
  { label: "Media HQ", description: "Campaign and content hub built for modern media operations.", url: "https://marketing.securevisanow.com/", image: "/images/clients/platform-media-hq.webp", icon: Newspaper },
  { label: "AlvinAI", description: "AI productivity platform turning complex tasks into clear actions.", url: "https://www.alvinai-dev.com/", image: "/images/clients/platform-alvin-ai-v2.webp", icon: Bot },
  { label: "Build Flow", description: "Project workflow platform for planning, teams, and delivery.", url: "https://www.buildflow-tech.com", image: "/images/clients/platform-build-flow-v2.webp", icon: Workflow },
  { label: "Global Harvest", description: "Digital agriculture platform connecting growth and opportunity.", url: "https://www.globalharvest.online/", image: "/images/clients/platform-global-harvest-v2.webp", icon: Wheat },
  { label: "Forge Crypto", description: "Crypto intelligence experience for clearer market decisions.", url: "https://forge-crypto-omega.vercel.app/", image: "/images/clients/platform-forge-crypto-v2.webp", icon: Bitcoin },
];

export const clientWebsiteLinks: ExternalLinkItem[] = [
  { label: "ITSEC", description: "Cybersecurity expertise presented with authority and clarity.", url: "https://itsecnow.com/", image: "/images/clients/website-itsec-v2.webp", icon: ShieldCheck },
  { label: "SecureVisa", description: "Conversion-led visa journey designed to build trust quickly.", url: "https://www.securevisanow.com", image: "/images/clients/website-securevisa-v2.webp", icon: Plane },
  { label: "Koll", description: "Premium UAE business presence with a confident digital identity.", url: "https://www.koll.ae", image: "/images/clients/website-koll-v2.webp", icon: Globe },
  { label: "Tina Portfolio", description: "Personal portfolio shaping experience into a clear creative story.", url: "https://www.tinaramos.online/", image: "/images/clients/website-tina-portfolio.webp", icon: UserRound },
  { label: "Alcon Media", description: "Media production showcase built to make the work feel cinematic.", url: "https://www.alcon-online.site/", image: "/images/clients/website-alcon-media-v2.webp", icon: Clapperboard },
  { label: "Kangen", description: "Wellness-focused product website designed around education and action.", url: "https://kangenwateralife4u.com/", image: "/images/clients/website-kangen.webp", icon: Droplets },
  { label: "Logistic", description: "Logistics capability presented through a direct commercial journey.", url: "https://www.ilsmtc.com/", image: "/images/clients/website-logistic.webp", icon: Truck },
  { label: "Malath", description: "Investment brand experience balancing confidence and accessibility.", url: "https://malathinvestment.com/", image: "/images/clients/website-malath.webp", icon: TrendingUp },
  { label: "UHUD", description: "Corporate digital presence designed for credibility and growth.", url: "https://www.uhud.online/", image: "/images/clients/website-uhud-v2.webp", icon: Building2 },
  { label: "VerifiX", description: "Product overview translating verification technology into clarity.", url: "https://overview.verifix.itsecnow.com/", image: "/images/clients/website-verifix.webp", icon: BadgeCheck },
];

export const clientsMegaMenuPromo: MegaMenuPromo = {
  image: "/images/client-thumbnail.webp",
  eyebrow: "Trusted Worldwide",
  heading: "Brands that build with Alcon",
  description:
    "Platforms and websites shipped for clients across the globe — live products in the wild, not mockups.",
  href: "/client-projects",
};

