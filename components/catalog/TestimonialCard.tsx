import type { Testimonial } from "@/lib/types";
import Card from "../ui/Card";

export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="h-full p-5">
      <div className="text-sm text-muted">“{t.quote}”</div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-text">{t.name}</div>
          <div className="text-xs text-muted">{t.role}</div>
        </div>
        <div className="rounded-full border border-[color:rgba(242,178,74,0.25)] bg-[color:rgba(242,178,74,0.12)] px-3 py-1 text-[11px] font-semibold text-[color:rgba(242,178,74,0.9)]">
          {t.outcome}
        </div>
      </div>
    </Card>
  );
}

