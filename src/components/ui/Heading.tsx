import { clsx } from "@/lib/clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm";
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const sizes = {
  xl: "text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight",
  lg: "text-3xl sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight",
  md: "text-2xl sm:text-3xl leading-[1.15] tracking-tight",
  sm: "text-xl sm:text-2xl leading-[1.2]",
};

export function Heading({
  as: Tag = "h2",
  size = "lg",
  children,
  className,
  id,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={clsx(
        "font-heading font-medium text-text-primary",
        sizes[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
