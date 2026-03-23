import Link from "next/link";
import type { Book } from "@/lib/types";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { formatMoney } from "@/lib/money";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Card className="group flex h-full flex-col p-5">
      <div className="flex gap-4">
        <div className="w-24 shrink-0">
          <div className="aspect-[3/4] overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={book.title}
              src={
                book.coverUrl ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='320'%3E%3Crect width='240' height='320' fill='%23111821'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394A3B8' font-family='Arial' font-size='14'%3ENo cover%3C/text%3E%3C/svg%3E"
              }
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {book.topics.slice(0, 2).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h3 className="clamp-2 mt-3 text-base font-extrabold tracking-tight text-text md:text-lg">
            <Link href={`/books/${book.slug}`} className="hover:underline">
              {book.title}
            </Link>
          </h3>
          <p className="clamp-2 mt-1 text-sm text-muted">{book.subtitle}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-muted">
              By <span className="text-text">{book.author}</span>
              <span className="mx-2 text-muted">•</span>
              {book.pages} pages • PDF
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-text">{formatMoney(book.price)}</div>
              <div className="mt-1 text-xs text-muted">{book.rating.toFixed(1)} ★</div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href={`/books/${book.slug}`}
              className="inline-flex items-center text-sm font-semibold text-[color:rgba(242,178,74,0.95)] hover:underline"
            >
              View details →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
