// PLACEHOLDER CONTENT — see src/lib/content/site.ts header.
// No publication dates or authors are fabricated for real people; dates use
// a clearly-placeholder ISO value and the author is attributed to the team.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // TODO(content-swap): replace with real publish dates
  author: string;
  readingTimeMinutes: number;
  content: { heading?: string; body: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-brand-systems-that-scale",
    title: "Building Brand Systems That Scale",
    excerpt:
      "Why a brand identity should be treated as a system of rules, not a one-time set of assets.",
    category: "Branding",
    publishedAt: "2026-01-01",
    author: "Alcon Team",
    readingTimeMinutes: 4,
    content: [
      {
        body: "A logo is not a brand system. The teams that keep a brand consistent for years — across ads, product, and social — are working from a defined set of rules: how color is used, how type pairs, how motion should feel.",
      },
      {
        heading: "Start with rules, not assets",
        body: "Instead of delivering a folder of files, an identity system should ship with the logic behind it: when to use which lock-up, how much negative space a mark needs, what motion easing feels 'on-brand'.",
      },
      {
        heading: "Design for the team that inherits it",
        body: "The best brand systems assume the original designer won't be in the room for every future execution. Guidelines should let someone else make an on-brand decision without asking.",
      },
    ],
  },
  {
    slug: "motion-as-a-brand-asset",
    title: "Motion as a Brand Asset",
    excerpt:
      "Treating animation timing and easing as part of the identity system, not an afterthought.",
    category: "Motion",
    publishedAt: "2026-01-01",
    author: "Alcon Team",
    readingTimeMinutes: 3,
    content: [
      {
        body: "Most brand guidelines stop at color and type. Increasingly, how something moves is just as recognizable as how it looks — think of the easing curve on a familiar app's transitions.",
      },
      {
        heading: "Define timing, not just visuals",
        body: "A motion system should specify duration ranges, easing curves, and the emotional register they're meant to produce — calm and slow, or sharp and energetic.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
