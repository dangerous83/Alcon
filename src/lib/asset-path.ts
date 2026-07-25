/**
 * Prefixes a path in /public with the deployment's base path.
 *
 * next/link and next/image apply `basePath` automatically, but raw
 * attributes — <video src>, <source src>, poster, CSS url() — do not. Any
 * of those must go through this helper or they 404 on GitHub Pages, where
 * the site is served from /Alcon rather than the domain root.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
