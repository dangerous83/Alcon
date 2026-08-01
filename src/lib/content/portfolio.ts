export type PortfolioDiscipline = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  summary: string;
  heroImage: string;
  heroAlt: string;
  stats: { value: string; label: string }[];
  introHeading: string;
  paragraphs: string[];
  lenses: { title: string; description: string; image: string }[];
  evidence: string[];
  serviceHref: string;
  ctaHeading: string;
  ctaBody: string;
  related: string[];
};

export const portfolioDisciplines: PortfolioDiscipline[] = [
  {
    slug: "branding",
    name: "Branding",
    eyebrow: "Selected work · Strategy · Identity · Launch",
    headline: "Identity that earns recognition before the logo is read.",
    accent: "recognition",
    summary: "A curated view of Alcon brand systems: strategic foundations, expressive identities, and practical tools designed to stay coherent in the real world.",
    heroImage: "/images/portfolio/branding-portfolio-hero.webp",
    heroAlt: "Premium brand identity system arranged as luminous glass and metallic objects",
    stats: [{ value: "Strategy-first", label: "Every mark has a reason" }, { value: "Multi-channel", label: "Built beyond the logo" }, { value: "Launch-ready", label: "Tools teams can use" }],
    introHeading: "Brands become valuable when every detail tells the same story.",
    paragraphs: ["Our branding portfolio is organised around the decisions that make identity useful: positioning, recognition, consistency, and the ability to flex across campaigns.", "Each direction is tested in motion, digital interfaces, social content, and physical applications so the final system is expressive without becoming fragile."],
    lenses: [
      { title: "Strategic foundations", description: "Positioning, audience truth, naming, and a story distinctive enough to own.", image: "/images/portfolio/branding-portfolio-hero.webp" },
      { title: "Identity systems", description: "Logos, typography, colour, image language, and rules designed to work together.", image: "/images/services/graphic-design-hero.webp" },
      { title: "Brand in motion", description: "Launch expressions and campaign moments that turn identity into recognition.", image: "/images/portfolio/motion-design-portfolio-hero.webp" },
    ],
    evidence: ["Brand positioning", "Visual identity", "Verbal identity", "Launch creative", "Brand guidelines", "Campaign toolkit"],
    serviceHref: "/services/branding",
    ctaHeading: "Ready to build a brand people recognise on instinct?",
    ctaBody: "Share the ambition, the audience, and where the brand needs to go. We will shape the strategy and identity system to take it there.",
    related: ["ui-ux-design", "motion-design", "photography"],
  },
  {
    slug: "3d-animation",
    name: "3D Animation",
    eyebrow: "Selected work · Product · Space · Impossible worlds",
    headline: "Ideas become tangible before they become possible.",
    accent: "tangible",
    summary: "Product worlds, architectural visualisation, and campaign films that use dimensional craft to make complex ideas feel immediate.",
    heroImage: "/images/portfolio/3d-animation-portfolio-hero.webp",
    heroAlt: "Futuristic metallic product forms being modelled in a premium 3D studio",
    stats: [{ value: "Photoreal", label: "Materials with presence" }, { value: "Camera-free", label: "No physical limits" }, { value: "Campaign-ready", label: "Still and motion outputs" }],
    introHeading: "When the idea cannot be filmed, we build the world around it.",
    paragraphs: ["Our 3D portfolio focuses on the moments dimensional design does best: revealing unseen product value, making future spaces believable, and creating visual theatre around a launch.", "From material studies to final compositing, every decision supports the message—not just the spectacle."],
    lenses: [
      { title: "Product visualisation", description: "Controlled light, refined materials, and precise camera language for premium launches.", image: "/images/portfolio/3d-animation-portfolio-hero.webp" },
      { title: "Spatial storytelling", description: "Architecture and environments made understandable before they physically exist.", image: "/images/services/3d-animation-hero.webp" },
      { title: "Campaign worlds", description: "Surreal, ownable visual territories built for films, key visuals, and social cuts.", image: "/images/portfolio/2d-animation-portfolio-hero.webp" },
    ],
    evidence: ["Product films", "Architectural scenes", "Material studies", "CG environments", "Motion toolkits", "Campaign key visuals"],
    serviceHref: "/services/3d-animation",
    ctaHeading: "Have an idea reality cannot quite hold?",
    ctaBody: "Bring us the product, the plan, or the impossible brief. We will turn it into a world your audience can see and feel.",
    related: ["motion-design", "2d-animation", "videography"],
  },
  {
    slug: "motion-design",
    name: "Motion Design",
    eyebrow: "Selected work · Rhythm · Systems · Brand motion",
    headline: "Every frame should move the story forward.",
    accent: "move",
    summary: "Motion identities, campaign films, and animated systems engineered to make brands clearer, more distinctive, and harder to forget.",
    heroImage: "/images/portfolio/motion-design-portfolio-hero.webp",
    heroAlt: "Luminous timeline ribbons and motion frames flowing through a dark editing studio",
    stats: [{ value: "Frame-perfect", label: "Purpose in every beat" }, { value: "System-led", label: "Motion that stays consistent" }, { value: "All formats", label: "From sting to campaign" }],
    introHeading: "Movement is not decoration. It is how the message arrives.",
    paragraphs: ["This portfolio brings together work where timing, hierarchy, and sound turn static ideas into experiences with momentum.", "We design repeatable motion languages so campaigns can grow across screens without losing their distinctive character."],
    lenses: [
      { title: "Motion identity", description: "Signature transitions, logo behaviour, type motion, and repeatable brand rules.", image: "/images/portfolio/motion-design-portfolio-hero.webp" },
      { title: "Campaign films", description: "High-impact visual narratives shaped for launches, paid media, and events.", image: "/images/services/motion-hero.webp" },
      { title: "Social motion systems", description: "Modular formats that keep every short-form asset recognisably yours.", image: "/images/portfolio/social-media-portfolio-hero.webp" },
    ],
    evidence: ["Motion identity", "Logo animation", "Launch films", "Kinetic typography", "Broadcast packages", "Social templates"],
    serviceHref: "/services/motion",
    ctaHeading: "Ready to give the brand a signature way to move?",
    ctaBody: "Tell us where the story will live. We will build a motion language that gives every frame purpose and presence.",
    related: ["3d-animation", "2d-animation", "social-media"],
  },
  {
    slug: "social-media",
    name: "Social Media",
    eyebrow: "Selected work · Content · Campaigns · Performance",
    headline: "Content becomes valuable when attention compounds.",
    accent: "compounds",
    summary: "Content systems and paid social creative built to earn the first pause, sustain recognition, and turn audience attention into commercial momentum.",
    heroImage: "/images/portfolio/social-media-portfolio-hero.webp",
    heroAlt: "Premium social content frames and analytics cards floating in a creative studio",
    stats: [{ value: "Always-on", label: "A system, not random posts" }, { value: "Platform-native", label: "Built for the feed" }, { value: "Performance-led", label: "Creative that learns" }],
    introHeading: "A stronger feed starts with a stronger reason to follow.",
    paragraphs: ["Our social portfolio is less about isolated posts and more about connected creative systems: a recognisable point of view, repeatable formats, and campaigns built to improve.", "Strategy, design, motion, copy, and performance insight work together so attention accumulates instead of resetting every week."],
    lenses: [
      { title: "Content systems", description: "Ownable pillars and repeatable formats that create consistency without repetition.", image: "/images/portfolio/social-media-portfolio-hero.webp" },
      { title: "Paid creative", description: "Fast, focused campaign concepts designed around audience and objective.", image: "/images/services/social-hero.webp" },
      { title: "Motion-first stories", description: "Platform-native animation and video that earns attention in the opening seconds.", image: "/images/portfolio/motion-design-portfolio-hero.webp" },
    ],
    evidence: ["Content strategy", "Campaign concepts", "Paid social assets", "Reels and stories", "Creator toolkits", "Performance iteration"],
    serviceHref: "/services/social",
    ctaHeading: "Ready to turn posting into brand momentum?",
    ctaBody: "Bring us the commercial goal. We will build the content system and campaign creative that keeps attention working harder.",
    related: ["motion-design", "videography", "photography"],
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    eyebrow: "Selected work · Research · Interface · Conversion",
    headline: "Digital experiences should feel obvious — and unforgettable.",
    accent: "obvious",
    summary: "Web platforms and product interfaces that make complex journeys feel natural while giving the brand a distinctive digital presence.",
    heroImage: "/images/portfolio/ui-ux-design-portfolio-hero.webp",
    heroAlt: "Layered responsive interface screens connected by a luminous user journey",
    stats: [{ value: "User-led", label: "Clarity before decoration" }, { value: "Responsive", label: "Designed for every screen" }, { value: "Dev-ready", label: "Systems built to ship" }],
    introHeading: "The best interface removes doubt without removing personality.",
    paragraphs: ["Our digital portfolio looks at the whole experience: what people need, how information should unfold, and where brand expression can make the journey more memorable.", "From structure and prototypes to polished design systems, every screen is designed to communicate, convert, and scale."],
    lenses: [
      { title: "Journey design", description: "Research and information architecture that turn complex choices into clear paths.", image: "/images/portfolio/ui-ux-design-portfolio-hero.webp" },
      { title: "Interface systems", description: "Responsive components and interaction patterns with a distinctive brand voice.", image: "/images/services/web-ui-ux-hero.webp" },
      { title: "Conversion moments", description: "Landing pages and product flows that keep momentum focused on action.", image: "/images/portfolio/branding-portfolio-hero.webp" },
    ],
    evidence: ["UX research", "Information architecture", "Wireframes", "UI design", "Design systems", "Developer handoff"],
    serviceHref: "/services/web-ui-ux",
    ctaHeading: "Ready to make every digital interaction feel effortless?",
    ctaBody: "Show us the journey, the friction, and the business goal. We will turn them into a clear and distinctive experience.",
    related: ["branding", "social-media", "motion-design"],
  },
  {
    slug: "2d-animation",
    name: "2D Animation",
    eyebrow: "Selected work · Illustration · Explanation · Story",
    headline: "Complex stories become clear when every line has purpose.",
    accent: "clear",
    summary: "Illustrated explainers, character-led stories, and graphic animation that make unfamiliar ideas easy to understand and enjoyable to watch.",
    heroImage: "/images/portfolio/2d-animation-portfolio-hero.webp",
    heroAlt: "Layered illustrated characters and storyboard frames in a premium animation studio",
    stats: [{ value: "Story-first", label: "Clarity shapes the style" }, { value: "Ownable", label: "Illustration made for the brand" }, { value: "Modular", label: "Built for long and short cuts" }],
    introHeading: "Animation works hardest when the audience understands and remembers.",
    paragraphs: ["This portfolio explores how illustration, character, typography, and pace can turn information into a story people want to finish.", "Every visual style is shaped around the brand and the idea, then built as a reusable world for films, campaigns, and social content."],
    lenses: [
      { title: "Explainer stories", description: "Structured narratives that simplify products, services, and unfamiliar processes.", image: "/images/portfolio/2d-animation-portfolio-hero.webp" },
      { title: "Character worlds", description: "Expressive, brand-owned illustration systems that bring warmth to the message.", image: "/images/services/2d-animation-hero.webp" },
      { title: "Graphic animation", description: "Typography, shape, and rhythm built for fast, memorable communication.", image: "/images/portfolio/motion-design-portfolio-hero.webp" },
    ],
    evidence: ["Explainer films", "Storyboards", "Character design", "Illustration systems", "Kinetic type", "Social cutdowns"],
    serviceHref: "/services/2d-animation",
    ctaHeading: "Have a complex story that needs to land simply?",
    ctaBody: "Give us the idea and the audience. We will find the visual language that makes every second clearer and more memorable.",
    related: ["motion-design", "3d-animation", "social-media"],
  },
  {
    slug: "videography",
    name: "Videography",
    eyebrow: "Selected work · Direction · Production · Film",
    headline: "The strongest films make strategy feel human.",
    accent: "human",
    summary: "Cinematic brand, campaign, and product films that translate strategy into authentic moments with emotional and commercial weight.",
    heroImage: "/images/portfolio/videography-portfolio-hero.webp",
    heroAlt: "Cinema camera filming a dramatic product scene in a premium dark studio",
    stats: [{ value: "End-to-end", label: "Concept through final cut" }, { value: "Cinematic", label: "Craft with commercial intent" }, { value: "Multi-format", label: "One shoot, every screen" }],
    introHeading: "A camera captures the scene. Direction captures what it means.",
    paragraphs: ["Our film portfolio is shaped around a simple standard: every production choice must strengthen the idea, the emotion, or the action we want the audience to take.", "We plan for the complete campaign from the start, creating a hero film and adaptable footage that performs across channels."],
    lenses: [
      { title: "Brand films", description: "Human stories and cinematic worlds that make positioning emotionally believable.", image: "/images/portfolio/videography-portfolio-hero.webp" },
      { title: "Campaign production", description: "Concept-led shoots designed around the core message and every planned format.", image: "/images/services/videography-hero.webp" },
      { title: "Post-production", description: "Editing, colour, sound, and motion that shape raw footage into a complete experience.", image: "/images/portfolio/photography-portfolio-hero.webp" },
    ],
    evidence: ["Creative direction", "Pre-production", "On-location shoots", "Studio production", "Post-production", "Campaign cutdowns"],
    serviceHref: "/services/videography",
    ctaHeading: "Ready to make the strategy feel like a story?",
    ctaBody: "Tell us what the audience should feel and do. We will shape the concept, production, and final film around that outcome.",
    related: ["photography", "motion-design", "social-media"],
  },
  {
    slug: "photography",
    name: "Photography",
    eyebrow: "Selected work · Product · People · Campaign",
    headline: "One frame can make the whole brand feel valuable.",
    accent: "valuable",
    summary: "Product, people, and campaign photography composed to create desire, sharpen recognition, and give brands a richer visual language.",
    heroImage: "/images/portfolio/photography-portfolio-hero.webp",
    heroAlt: "Professional camera capturing a sculptural luxury product under blue and magenta studio light",
    stats: [{ value: "Art-directed", label: "Every detail is intentional" }, { value: "Brand-owned", label: "A look only you can use" }, { value: "Channel-ready", label: "Composed for every crop" }],
    introHeading: "A distinctive image does more than show the product. It shapes its value.",
    paragraphs: ["Our photography portfolio focuses on visual systems, not disconnected hero shots. Light, composition, texture, and human presence work together to express a clear brand position.", "Every shoot is planned for practical range, giving teams a coherent library for campaigns, websites, social feeds, and sales."],
    lenses: [
      { title: "Product worlds", description: "Material, light, and composition designed to make every feature feel desirable.", image: "/images/portfolio/photography-portfolio-hero.webp" },
      { title: "People and place", description: "Natural direction and considered environments that make the brand feel human.", image: "/images/services/photography-hero.webp" },
      { title: "Campaign libraries", description: "Connected visual sets planned across layouts, crops, channels, and seasons.", image: "/images/portfolio/branding-portfolio-hero.webp" },
    ],
    evidence: ["Product photography", "Lifestyle shoots", "Portraits", "Campaign art direction", "Location production", "Image libraries"],
    serviceHref: "/services/photography",
    ctaHeading: "Ready to give the brand a more valuable visual world?",
    ctaBody: "Share the product, the audience, and every place the imagery must work. We will create a shoot built for all of it.",
    related: ["videography", "branding", "social-media"],
  },
];

export function getPortfolioDiscipline(slug: string) {
  return portfolioDisciplines.find((discipline) => discipline.slug === slug);
}
