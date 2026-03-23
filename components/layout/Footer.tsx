import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:rgba(11,15,20,0.5)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted">
          <span className="text-text">Bagdja Course</span> — Portal kursus online/offline & eBook.
        </div>
        <div className="flex gap-4 text-sm">
          <Link className="text-muted hover:text-text" href="/courses">
            Courses
          </Link>
          <Link className="text-muted hover:text-text" href="/books">
            Books
          </Link>
          <a className="text-muted hover:text-text" href="#" onClick={(e) => e.preventDefault()}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

