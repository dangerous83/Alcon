import { clsx } from "@/lib/clsx";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={clsx(
        "gradient-border relative rounded-2xl bg-surface p-6 sm:p-8",
        className
      )}
    >
      {children}
    </Tag>
  );
}
