import type { ReactNode } from "react";

export default function Badge({
  children,
  tone = "muted"
}: {
  children: ReactNode;
  tone?: "muted" | "brand";
}) {
  const tones =
    tone === "brand"
      ? "border-[color:rgba(242,178,74,0.25)] bg-[color:rgba(242,178,74,0.12)] text-[color:rgba(242,178,74,0.92)]"
      : "border-[color:rgba(148,163,184,0.18)] bg-[color:rgba(148,163,184,0.08)] text-muted";

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

