import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={[
        "h-10 w-full rounded-lg border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.55)] px-3 text-sm text-text placeholder:text-[color:rgba(148,163,184,0.7)] focus:outline-none focus:ring-2 focus:ring-[color:rgba(92,127,166,0.35)]",
        className
      ].join(" ")}
    />
  );
}

