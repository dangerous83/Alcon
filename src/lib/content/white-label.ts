// White-label sample builds supplied by the client (Whitelabel-*.webp,
// uploaded to the repo root and re-encoded into public/images/white-label).
//
// Titles and descriptions are written from what each design actually shows —
// the brand name on the mock, its sector, and the features its own layout
// highlights. Nothing here claims a real client engagement: these are
// demonstration templates, which is exactly what a white-label showcase is
// meant to be.

export type WhiteLabelSample = {
  /** Basename in /public/images/white-label. */
  image: string;
  /** Brand shown on the mock. */
  title: string;
  /** Sector label, used as the card's eyebrow. */
  sector: string;
  description: string;
};

export const whiteLabelSamples: WhiteLabelSample[] = [
  {
    image: "2",
    title: "Vanta Media",
    sector: "Creative Agency",
    description:
      "A dark, neon-lit agency site built to sell creative services, with campaign metrics and a showreel front and centre.",
  },
  {
    image: "8",
    title: "Nexchain",
    sector: "Fintech Platform",
    description:
      "A crypto trading platform layout pairing live chart mockups with trust signals — security badges, uptime, and compliance marks.",
  },
  {
    image: "17",
    title: "Cybernex",
    sector: "Cybersecurity",
    description:
      "An enterprise security site leading with a threat-monitoring dashboard and a clear four-pillar breakdown of the service.",
  },
  {
    image: "11",
    title: "Lunara Jewels",
    sector: "Luxury Retail",
    description:
      "A gold-on-emerald jewellery storefront built for considered browsing, with certification marks and a partner-focused CTA.",
  },
  {
    image: "20",
    title: "Valent Tailors",
    sector: "Menswear",
    description:
      "A tailoring brand's site organised around booking a fitting, with craftsmanship cues carried through the navy-and-gold palette.",
  },
  {
    image: "18",
    title: "Lumière Scent",
    sector: "Fragrance",
    description:
      "A perfume collection page using generous product photography and soft blush tones to carry a premium, gift-led range.",
  },
  {
    image: "10",
    title: "Velora Skin",
    sector: "Clean Beauty",
    description:
      "A skincare storefront with a private-label track built in — a separate partner path sits alongside the consumer shop.",
  },
  {
    image: "9",
    title: "Velvet Cocoa",
    sector: "Confectionery",
    description:
      "A chocolatier's site balancing an appetite-led hero against gifting flows, corporate orders, and seasonal collections.",
  },
  {
    image: "12",
    title: "Burger District",
    sector: "Quick Service Dining",
    description:
      "A fast-casual restaurant layout driving straight to ordering and table booking, with menu categories close to hand.",
  },
  {
    image: "21",
    title: "Bayt Al Zahran",
    sector: "Restaurant — UAE",
    description:
      "An Arabic dining brand with multi-emirate location listings, catering enquiries, and a first-order promotion built into the page.",
  },
  {
    image: "4",
    title: "Moonbrew Café",
    sector: "Coffee Shop",
    description:
      "A warm, seasonal café site pairing menu browsing with a rewards programme and a clear ordering path.",
  },
  {
    image: "14",
    title: "Northbean Coffee",
    sector: "Coffee Roastery",
    description:
      "A multi-location roastery site leaning on sourcing and sustainability, with rewards sign-up and per-city store lists.",
  },
  {
    image: "1",
    title: "CleanMark",
    sector: "Cleaning Services",
    description:
      "A services business built around booking and quoting, with vetting, eco credentials, and guarantees stated up front.",
  },
  {
    image: "6",
    title: "Elevate Realty",
    sector: "Real Estate",
    description:
      "A property site combining listing search with consultation booking, positioning agents as the route to the right home.",
  },
  {
    image: "3",
    title: "Aurelia Stay",
    sector: "Hotels & Apartments",
    description:
      "A hospitality booking layout covering room types, amenities, and direct-booking incentives in one flow.",
  },
  {
    image: "5",
    title: "Mobiliq",
    sector: "Mobile Retail",
    description:
      "A phone-and-accessories store organised by category, with bundle deals and returns policy surfaced early.",
  },
  {
    image: "19",
    title: "Nexcore Tech",
    sector: "Computing Retail",
    description:
      "A laptops and desktops storefront built around comparison, warranty support, and business-tier configurations.",
  },
  {
    image: "15",
    title: "Nexa Kitchen",
    sector: "Home Appliances",
    description:
      "A smart-appliance retailer using bundle pricing and warranty messaging to move higher-value baskets.",
  },
  {
    image: "16",
    title: "Visionora",
    sector: "Eyewear & Optical",
    description:
      "An optical brand pairing frame browsing with eye-test booking, so retail and clinical services sit in one journey.",
  },
  {
    image: "7",
    title: "Stridelab",
    sector: "Streetwear & Footwear",
    description:
      "A high-energy sneaker drop site using bold type and limited-run messaging to drive urgency around releases.",
  },
];
