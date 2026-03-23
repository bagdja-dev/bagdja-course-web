import Layout from "@/components/layout/Layout";
import BookCard from "@/components/catalog/BookCard";
import Input from "@/components/ui/Input";
import SectionHeading from "@/components/ui/SectionHeading";
import { apiListBooks } from "@/lib/api";
import type { Book } from "@/lib/types";
import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";

export default function BooksPage(props: { books: Book[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return props.books;
    return props.books.filter((b) => {
      const hay = [b.title, b.subtitle, b.author, ...b.topics].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [props.books, query]);

  return (
    <Layout title="Books — Bagdja Course" description="Browse eBooks: UI, frontend, backend, and product engineering.">
      <SectionHeading title="Books" subtitle="Listing eBook (PDF). Cari berdasarkan judul/topik/author." />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books…" />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] px-4 py-2 text-sm text-muted">
          Showing <span className="font-semibold text-text">{filtered.length}</span> books
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((b) => (
          <BookCard key={b.slug} book={b} />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const books = await apiListBooks();
    return { props: { books } };
  } catch {
    return { props: { books: [] } };
  }
};
