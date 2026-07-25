import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained server bundle (.next/standalone)
  // with only the node_modules actually needed at runtime — keeps the
  // Docker image small instead of copying the whole node_modules tree.
  output: "standalone",
  images: {
    // Higgsfield-generated imagery is served from Higgsfield's CDN rather
    // than self-hosted — this sandbox's network policy blocks downloading
    // the files into the repo (see docs/higgsfield-image-prompts.md). A
    // real deployment environment with normal internet access should
    // download + re-encode these to AVIF/WebP under public/images and drop
    // this remote pattern.
    remotePatterns: [
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
    ],
  },
};

export default nextConfig;
