import type { ReactNode } from "react";

export default function Badge({
  children,
  tone = "muted"
}: {
  children: ReactNode;
  tone?: "muted" | "brand" | "success" | "warning" | "error";
}) {
  const tones = {
    brand: "border-brand/20 bg-brand/10 text-brand",
    success: "border-green-500/20 bg-green-500/10 text-green-500",
    warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500",
    error: "border-red-500/20 bg-red-500/10 text-red-500",
    muted: "border-slate-500/20 bg-slate-500/10 text-muted",
  }[tone];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide",
        tones
      ].join(" ")}
    >
      {children}
    </span>
  );
}

