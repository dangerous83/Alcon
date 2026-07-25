import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { clsx } from "@/lib/clsx";

type CommonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & { href: string };

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className">;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-heading font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent disabled:opacity-50 disabled:pointer-events-none";

const sizes = {
  md: "px-6 py-3 text-sm min-h-11",
  lg: "px-8 py-4 text-base min-h-12",
};

const variants = {
  primary:
    "text-text-primary bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_-6px_rgba(113,56,255,0.65)] hover:brightness-110 active:brightness-95",
  secondary:
    "text-text-primary bg-surface-elevated border border-border hover:border-white/25 hover:bg-white/[0.06]",
  ghost: "text-text-secondary hover:text-text-primary",
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = clsx(base, sizes[size], variants[variant], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkProps } = rest as Omit<
      ButtonAsLink,
      "variant" | "size" | "className" | "children"
    >;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
