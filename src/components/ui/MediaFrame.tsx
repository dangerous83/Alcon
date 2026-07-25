import { clsx } from "@/lib/clsx";

/**
 * Placeholder visual frame used where a Higgsfield-generated image is not
 * yet available. Renders a labeled gradient panel instead of a broken
 * <img> so layouts are reviewable before final assets land.
 * See docs/higgsfield-image-prompts.md for the prompt tied to each id.
 */
export function MediaFrame({
  label,
  ratio = "16/9",
  className,
}: {
  label: string;
  ratio?: "16/9" | "4/5" | "1/1" | "3/4";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-border bg-surface-elevated",
        className
      )}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, rgba(40,112,255,0.35), transparent 55%), radial-gradient(circle at 25% 80%, rgba(209,45,255,0.25), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-end p-4">
        <span className="text-xs text-text-secondary/70 font-mono">
          {label}
        </span>
      </div>
    </div>
  );
}
