export type PrintProduct = {
  slug: string;
  navLabel: string;
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
  capabilities: { title: string; description: string; image: string }[];
  deliverables: string[];
  ctaHeading: string;
  ctaBody: string;
  related: string[];
};

export const printProducts: PrintProduct[] = [
  {
    slug: "custom-t-shirts",
    navLabel: "Custom T-shirt",
    name: "Custom T-Shirts",
    eyebrow: "Print · Apparel · Custom T-Shirts Dubai",
    headline: "Turn every T-shirt into a brand people want to wear.",
    accent: "want to wear",
    summary:
      "Premium custom T-shirt printing in Dubai for teams, campaigns, events, retail drops, and branded merchandise that deserves to be kept.",
    heroImage: "/images/print/print-tshirts-hero.webp",
    heroAlt: "Premium black custom T-shirt with blue and violet print detail in a dark studio",
    stats: [
      { value: "Brand-led", label: "Design before decoration" },
      { value: "Print-ready", label: "Artwork prepared correctly" },
      { value: "Dubai", label: "Local creative direction" },
    ],
    introHeading: "Custom tees should feel like a clothing line, not a giveaway.",
    paragraphs: [
      "We connect apparel selection, artwork, placement, colour, and finish into one considered system. The result is a custom T-shirt that carries the brand clearly without looking promotional.",
      "From staff uniforms and event merchandise to launch drops and client gifts, every design is prepared for production and evaluated on the garment—not only on screen.",
    ],
    capabilities: [
      { title: "Garment & fit direction", description: "Choose silhouettes, weights, and colours that fit the audience and the way the T-shirt will be used.", image: "/images/print/print-tshirts-hero.webp" },
      { title: "Print artwork systems", description: "Create front, back, sleeve, and detail placements that feel balanced across sizes.", image: "/images/print/print-overview-hero.webp" },
      { title: "Launch-ready presentation", description: "Build polished mockups and production files for approvals, sales, and campaign use.", image: "/images/print/print-stickers-hero.webp" },
    ],
    deliverables: ["Custom artwork", "Placement specifications", "Colour separation", "Size-ready layouts", "Production mockups", "Campaign visuals"],
    ctaHeading: "Ready to create custom T-shirts people actually want?",
    ctaBody: "Tell us the audience, quantity, occasion, and brand direction. We will shape a production-ready apparel concept around it.",
    related: ["hoodies", "stickers", "mugs-tumblers"],
  },
  {
    slug: "hoodies",
    navLabel: "Hoodies",
    name: "Custom Hoodies",
    eyebrow: "Print · Apparel · Custom Hoodies Dubai",
    headline: "Build a hoodie that carries the brand with confidence.",
    accent: "with confidence",
    summary:
      "Custom hoodie design and printing in Dubai with premium garments, considered placements, and durable finishes for teams, launches, and merchandise collections.",
    heroImage: "/images/print/print-hoodies-hero.webp",
    heroAlt: "Premium black custom hoodie with electric blue and violet accents in a dark studio",
    stats: [
      { value: "Premium", label: "Weight, fit, and finish" },
      { value: "Flexible", label: "Print or embroidery" },
      { value: "Complete", label: "Concept through artwork" },
    ],
    introHeading: "The right hoodie turns branded merchandise into something desirable.",
    paragraphs: [
      "We treat the garment as a complete canvas. Fabric weight, fit, embroidery scale, print placement, and finishing details work together to create a piece that feels intentional.",
      "Whether the brief is staff apparel, premium client gifting, an event release, or a retail-ready drop, the design is built to look strong in person and on camera.",
    ],
    capabilities: [
      { title: "Premium garment direction", description: "Select the weight, colour, cut, and construction that support the brand position.", image: "/images/print/print-hoodies-hero.webp" },
      { title: "Print & embroidery planning", description: "Balance bold artwork, subtle brand details, and finishes that hold up over time.", image: "/images/print/print-tshirts-hero.webp" },
      { title: "Merchandise presentation", description: "Create campaign-ready mockups and rollout visuals that help the collection sell.", image: "/images/print/print-overview-hero.webp" },
    ],
    deliverables: ["Garment direction", "Print artwork", "Embroidery layouts", "Placement guide", "Production mockups", "Launch assets"],
    ctaHeading: "Ready to make a hoodie worth keeping?",
    ctaBody: "Share the purpose, quantity, and look you want to own. We will turn it into a polished, production-ready hoodie system.",
    related: ["custom-t-shirts", "mugs-tumblers", "stickers"],
  },
  {
    slug: "mugs-tumblers",
    navLabel: "Mugs & Tumblers",
    name: "Mugs & Tumblers",
    eyebrow: "Print · Drinkware · Mugs & Tumblers Dubai",
    headline: "Put the brand into the rituals people repeat every day.",
    accent: "every day",
    summary:
      "Custom mugs and tumblers in Dubai designed for everyday visibility, memorable gifting, team culture, events, and premium branded merchandise.",
    heroImage: "/images/print/print-mugs-tumblers-hero.webp",
    heroAlt: "Premium custom mug and tumbler with blue and violet graphics in a dark studio",
    stats: [
      { value: "Daily", label: "Useful brand visibility" },
      { value: "Gift-ready", label: "Considered presentation" },
      { value: "Durable", label: "Artwork made to last" },
    ],
    introHeading: "Useful merchandise keeps the brand present without trying too hard.",
    paragraphs: [
      "We design drinkware as part of the brand experience: the right object, the right finish, and artwork that wraps naturally around its form.",
      "From office mugs and event tumblers to executive gifts and launch kits, each direction is designed for repeated use and a polished unboxing moment.",
    ],
    capabilities: [
      { title: "Product & finish selection", description: "Choose forms, colours, materials, and finishes that match the audience and occasion.", image: "/images/print/print-mugs-tumblers-hero.webp" },
      { title: "Wraparound artwork", description: "Design clear, correctly scaled graphics that work from every viewing angle.", image: "/images/print/print-overview-hero.webp" },
      { title: "Gifting systems", description: "Connect drinkware with packaging, messages, and companion items for a complete experience.", image: "/images/print/print-stickers-hero.webp" },
    ],
    deliverables: ["Product direction", "Custom artwork", "Wrap specifications", "Colour matching", "Production mockups", "Gift-set concepts"],
    ctaHeading: "Ready to create drinkware people use every day?",
    ctaBody: "Tell us who it is for and what the moment should feel like. We will shape the product, artwork, and presentation around it.",
    related: ["stickers", "custom-t-shirts", "hoodies"],
  },
  {
    slug: "stickers",
    navLabel: "Stickers",
    name: "Custom Stickers",
    eyebrow: "Print · Brand Details · Custom Stickers Dubai",
    headline: "Make every surface carry a sharper piece of the brand.",
    accent: "sharper",
    summary:
      "Custom die-cut sticker design in Dubai for packaging, products, events, promotions, and merchandise—made to feel intentional at every scale.",
    heroImage: "/images/print/print-stickers-hero.webp",
    heroAlt: "Collection of premium holographic die-cut stickers under blue and violet studio light",
    stats: [
      { value: "Die-cut", label: "Shapes with personality" },
      { value: "Versatile", label: "Product to campaign" },
      { value: "Brand-owned", label: "A coherent visual set" },
    ],
    introHeading: "Small brand details can create surprisingly large recognition.",
    paragraphs: [
      "We build sticker collections around a clear visual idea, then shape each design for packaging, products, event moments, or merchandise without losing consistency.",
      "Material, finish, cut line, scale, and production setup are considered early so the final sticker looks as good in the hand as it did in the concept.",
    ],
    capabilities: [
      { title: "Sticker collection design", description: "Create a family of shapes, graphics, and messages that feel recognisably connected.", image: "/images/print/print-stickers-hero.webp" },
      { title: "Material & finish direction", description: "Plan matte, gloss, transparent, metallic, or holographic effects around the design.", image: "/images/print/print-overview-hero.webp" },
      { title: "Production-ready setup", description: "Prepare cut paths, bleed, colour, and scale so the artwork is ready to manufacture.", image: "/images/print/print-tshirts-hero.webp" },
    ],
    deliverables: ["Sticker concepts", "Die-cut artwork", "Material direction", "Print-ready files", "Production mockups", "Packaging applications"],
    ctaHeading: "Ready to turn the brand into a sticker collection?",
    ctaBody: "Share the product, campaign, or event. We will build a sharp, production-ready set designed for where it needs to live.",
    related: ["mugs-tumblers", "custom-t-shirts", "hoodies"],
  },
];

export function getPrintProduct(slug: string) {
  return printProducts.find((product) => product.slug === slug);
}
