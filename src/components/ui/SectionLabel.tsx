import { clsx } from "@/lib/clsx";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "font-heading text-xs font-medium uppercase tracking-[0.2em] text-transparent bg-clip-text bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]",
        className
      )}
    >
      {children}
    </p>
  );
}
