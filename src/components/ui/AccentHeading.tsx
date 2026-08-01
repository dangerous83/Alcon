import { clsx } from "@/lib/clsx";

type AccentHeadingProps = {
  text: string;
  accent: string;
  as?: "h1" | "h2";
  className?: string;
};

export function AccentHeading({
  text,
  accent,
  as: Tag = "h1",
  className,
}: AccentHeadingProps) {
  const start = text.toLocaleLowerCase().indexOf(accent.toLocaleLowerCase());

  return (
    <Tag
      className={clsx(
        "font-heading text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl",
        className
      )}
    >
      {start < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, start)}
          <em className="heading-accent">{text.slice(start, start + accent.length)}</em>
          {text.slice(start + accent.length)}
        </>
      )}
    </Tag>
  );
}
