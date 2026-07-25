# Design System

## Palette

```css
--background: #020204;
--surface: #08090D;
--surface-elevated: #0D0F16;
--text-primary: #F6F7FC;
--text-secondary: #A7ACBA;
--electric-blue: #2870FF;
--violet: #7138FF;
--magenta: #D12DFF;
--cyan-accent: #16C7FF;
--border: rgba(255, 255, 255, 0.10);
```

Primary gradient: `linear-gradient(110deg, #2870FF 0%, #7138FF 52%, #D12DFF 100%)`.

Defined in `src/app/globals.css` as CSS custom properties, and exposed to
Tailwind v4 via `@theme inline` so utilities like `bg-surface`,
`text-cyan-accent`, `border-border` work directly.

### Gradient usage rules (enforced by convention, not lint)

The gradient is reserved for: the active nav underline, primary button
background + hover glow, section-label text, CTA sections' ambient glow,
and thin decorative rules (process timeline, capability bullets). It is
never used as a full-section background fill or applied to more than one
large surface per viewport.

## Typography

- Headings: Space Grotesk (`--font-space-grotesk`, loaded via
  `next/font/google` in `src/app/layout.tsx`)
- Body: Inter (`--font-inter`)
- `Heading` component (`src/components/ui/Heading.tsx`) defines 4 sizes
  (`xl`/`lg`/`md`/`sm`) with fluid `sm:`/`lg:` scaling and tightened
  tracking, so every heading in the app stays consistent.

## Primitives (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `Button` | Primary (gradient), secondary (outlined), ghost variants; renders as `<Link>` or `<button>` depending on props |
| `SectionLabel` | Small uppercase gradient-text eyebrow used above section headings |
| `Heading` | Sized, semantic heading wrapper (`as="h1"..."h4"`) |
| `Card` | Rounded surface panel with a gradient border that appears on hover/focus |
| `MediaFrame` | Placeholder visual panel for imagery not yet generated (labeled, accessible) — swap for `next/image` once Higgsfield assets land |

## Layout

- `SiteHeader` — fixed, transparent-to-background gradient nav with an
  active-route gradient underline and a slide-down mobile menu
- `SiteFooter` — sitemap-style link columns + contact/social
- Root layout adds a skip-to-content link and mounts `ProfessionalService`
  JSON-LD once globally

## Motion principles

- Section-level reveals use CSS transitions (`duration-500`–`700`,
  `ease-[cubic-bezier(0.16,1,0.3,1)]`) — no letter-by-letter or
  scroll-jacked text animation outside the hero.
  the hero's own chapter cross-fade is the one exception, and it's capped
  at opacity/translate/blur, matching the brief's "restrained text reveal"
  requirement.
- The hero's scroll-video sync is isolated in
  `src/components/hero/ScrollVideoHero.tsx` — see
  `docs/performance-report.md` for the implementation write-up.
- `prefers-reduced-motion: reduce` is respected globally
  (`globals.css` disables non-essential transitions/animations) and
  specifically by the hero, which swaps to a fully static `StaticHero`
  variant rather than degrading the pinned version in place.

## Accessibility conventions

- One semantic `<h1>` per page. On the homepage, the hero's true `<h1>` is
  visually hidden (`.sr-only`) and holds a stable summary sentence; the
  three animated chapter headlines render as `aria-hidden` presentational
  text so screen readers don't re-announce every scroll-driven change.
- All interactive elements get a visible `focus-visible` outline in
  `--cyan-accent`.
- Every form control has a real `<label htmlFor>`; errors are linked via
  `aria-describedby` and `aria-invalid`.
- Decorative gradients/particles use `aria-hidden="true"`.
- Touch targets are `min-h-11` (44px) minimum.
