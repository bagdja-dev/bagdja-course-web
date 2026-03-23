import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export default function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(242,178,74,0.35)]";
  const sizes = size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm";
  const variants: Record<Variant, string> = {
    primary: "bg-brand text-[color:var(--bg-0)] hover:brightness-95",
    secondary:
      "border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.6)] text-text hover:bg-[color:rgba(17,24,33,0.9)]",
    ghost: "text-muted hover:text-text hover:bg-[color:rgba(148,163,184,0.08)]"
  };

  return (
    <Link href={href} className={[base, sizes, variants[variant], className].join(" ")}>
      {children}
    </Link>
  );
}

