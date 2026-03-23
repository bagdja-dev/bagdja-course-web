import type { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      {...props}
      className={[
        "h-10 w-full appearance-none rounded-lg border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.55)] px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-[color:rgba(92,127,166,0.35)]",
        className
      ].join(" ")}
    />
  );
}

