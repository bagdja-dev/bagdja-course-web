import type { ReactNode } from "react";

export default function Card({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.65)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}

