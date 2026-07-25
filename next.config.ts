import type { NextConfig } from "next";

// GitHub Pages serves this repo's site from a subpath
// (https://<user>.github.io/Alcon), so every asset and link needs an
// "/Alcon" prefix. The deploy workflow sets NEXT_PUBLIC_BASE_PATH; local
// dev and custom-domain builds leave it empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export — required for GitHub Pages, which can only serve
  // static files (no Node server). See README "Deployment".
  output: "export",

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Emits each route as a directory with index.html (/services/ ->
  // /services/index.html), which is what static hosts expect.
  trailingSlash: true,

  images: {
    // next/image's optimizer needs a running server; static export has
    // none, so images are served as-authored.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
    ],
  },
};

export default nextConfig;
