# Higgsfield Image Prompts

Higgsfield MCP tools were available in this session. 4 images were
generated successfully (model: `cinematic_studio_2_5`, 16:9, ~2K) and are
wired into the live site via `src/lib/content/generated-images.ts` and
`next.config.ts` (`images.remotePatterns` allows the Higgsfield CDN host).

**They are not self-hosted.** This sandbox's network egress policy blocks
`d8j0ntlcm91z4.cloudfront.net` (same `403 host_not_allowed` restriction
documented in `docs/site-audit.md`), so the generated PNGs could not be
downloaded into `public/images/` and re-encoded to AVIF/WebP as the brief
requires. The images are served directly from Higgsfield's CDN through
`next/image`, which works correctly in a deployment environment with normal
internet access, but could not be verified end-to-end here (see
`docs/performance-report.md` → "Testing limitations").

## Generated (done)

| Placement | Prompt | Model | URL |
|---|---|---|---|
| Homepage → "Direct collaboration" section | Premium 3D abstract tech render, dark near-black background (#020204). Interconnected glowing nodes and threads of light forming a network, suggesting real-time collaboration and instant connection between points. Electric blue (#2870FF) core lighting with small accents of violet (#7138FF) and magenta (#D12DFF), cyan highlights (#16C7FF). Metallic/glass optical materials, elegant scientific/creative-production environment, realistic depth, cinematic lighting. No text, no logos, no interface elements, no people, no malformed hands/faces, no generic robots, no crowded sci-fi control rooms. Dark negative space on the left, subject weighted right. 16:9. | `cinematic_studio_2_5` | `https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234246_de766ee3-bcda-49d9-9a24-00758c483ec9.png` |
| `/services/branding` hero visual | Premium 3D abstract representation of brand identity, dark near-black background. Glowing geometric emblem or crystalline abstract form (not a real logo, no text) with electric blue core light, violet/magenta rim light, cyan highlights. Glass and brushed metal materials, cinematic lighting, no text, no logos, no people. 16:9. | `cinematic_studio_2_5` | `https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234252_75de148e-ff68-4ea8-8eb0-a41476e9db8f.png` |
| `/services/motion` hero visual | Premium 3D abstract representation of motion graphics and animation. Flowing ribbons of light and particle trails suggesting movement and rhythm, dark background, blue-to-magenta gradient light trails, cyan accent sparkle, cinematic shallow depth of field, metallic/glass optical surfaces. No text, no people. 16:9. | `cinematic_studio_2_5` | `https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234254_4f3c681d-9f38-41a0-ac4b-fa110e3d0b19.png` |
| Homepage → "Capabilities" section | Premium abstract 3D hero-support visual, dark studio environment, near-black background. Sleek metallic and glass sculptural object with smooth curved optical surfaces, under dramatic electric blue rim lighting with violet/magenta accent glow, cyan highlight. High-end product-photography feel, cinematic depth. No text, no people, no logos. 16:9. | `cinematic_studio_2_5` | `https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234256_3683d97a-bb3e-4554-b01d-bf72d77197a4.png` |

All 4 prompts also enforced (as instructed by the brief): no words/text in
the image, no fake Alcon logo, no interface text, no malformed hands/faces,
no generic robots, no crowded sci-fi control rooms.

## Still needed (placeholders in place, `MediaFrame` component)

These layouts currently render a labeled `MediaFrame` panel
(`src/components/ui/MediaFrame.tsx`) instead of a generated image. Each
placeholder's `label` prop states exactly what content is missing, so it's
visible directly in the UI. Recommended prompts, following the same
direction as the 4 generated above:

| Placement | Suggested prompt direction |
|---|---|
| `/services/editing` hero | Abstract representation of video editing/post-production: overlapping translucent film-strip-like planes of light, blue-to-cyan color grading gradient, dark studio background, cinematic depth of field. 16:9, no text. |
| `/services/social` hero | Abstract representation of social content: a cluster of small glowing glass/metal panels arranged like a content grid, electric blue and magenta accent lighting, dark background. 16:9, no text, no real UI. |
| `/services/tutorials` hero | Abstract representation of hands-on learning: a single glowing tool-like object (abstract, not a real object) under warm-cool mixed blue/violet studio light, dark background, approachable rather than cold. 16:9, no text, no people. |
| Homepage → featured projects (×4) | 4 distinct abstract 3D compositions, one per placeholder project, following the same dark/blue/violet/magenta palette, each visually distinct enough to tell the 4 cards apart at a glance. 4:5, no text. |
| `/client-projects` cards | Same direction as featured projects; can reuse once real project categories exist. |
| `/get-quote` supporting visual (optional) | A calmer, more inviting abstract composition — softer blue glow, less contrast — since this page's job is to lower friction, not impress. 4:5 or 1:1, no text. |

## How to finish this

1. From an environment with normal internet access, call
   `mcp__Higgsfield__generate_image` with the prompts above (or generate the
   4 done ones too, to self-host).
2. Download each result, re-encode to AVIF and WebP, and add
   desktop/mobile crops as needed.
3. Save under `public/images/`, add real `alt` text (a short factual
   description, not the prompt itself).
4. Replace the corresponding `MediaFrame` usage with `next/image`, or add a
   new entry to `src/lib/content/generated-images.ts` and swap the 4
   CDN-hosted images for local self-hosted ones (also removes the
   `images.remotePatterns` dependency in `next.config.ts`).
5. Update `docs/asset-inventory.json`.
