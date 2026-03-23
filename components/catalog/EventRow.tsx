import type { Event } from "@/lib/types";
import Badge from "../ui/Badge";
import { formatDate } from "@/lib/date";

export default function EventRow({ event }: { event: Event }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{event.type.toUpperCase()}</Badge>
          <span className="text-xs text-muted">{formatDate(event.date)}</span>
        </div>
        <div className="mt-1 truncate text-sm font-semibold text-text">{event.title}</div>
        <div className="mt-1 text-xs text-muted">{event.location}</div>
      </div>
      <button
        type="button"
        onClick={() => alert("Coming soon")}
        className="shrink-0 rounded-lg border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.6)] px-3 py-2 text-xs font-semibold text-text hover:bg-[color:rgba(17,24,33,0.9)]"
      >
        Register
      </button>
    </div>
  );
}

