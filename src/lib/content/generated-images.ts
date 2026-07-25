/**
 * The 4 images actually generated via Higgsfield for this build (model:
 * cinematic_studio_2_5, 16:9, 2K). Served from Higgsfield's CDN rather than
 * self-hosted — this sandbox's network policy blocked downloading the files
 * into public/images (see docs/higgsfield-image-prompts.md for the full
 * prompt list, including the images still outstanding). A deployment
 * environment with normal internet access should download + re-encode
 * these to local AVIF/WebP and update the paths below.
 */
export const generatedImages = {
  collaboration: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234246_de766ee3-bcda-49d9-9a24-00758c483ec9.png",
    alt: "Abstract network of glowing blue and violet light threads representing direct, real-time creative collaboration",
  },
  brandingService: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234252_75de148e-ff68-4ea8-8eb0-a41476e9db8f.png",
    alt: "Abstract crystalline emblem lit with electric blue and violet light, representing brand identity work",
  },
  motionService: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234254_4f3c681d-9f38-41a0-ac4b-fa110e3d0b19.png",
    alt: "Flowing ribbons of blue-to-magenta light trails representing motion graphics and animation",
  },
  homepageFeatured: {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_34SGn9O1DyKx5raXvDSnlxgbueE/hf_20260724_234256_3683d97a-bb3e-4554-b01d-bf72d77197a4.png",
    alt: "Sleek metallic and glass sculptural object under dramatic electric blue and violet studio lighting",
  },
} as const;
