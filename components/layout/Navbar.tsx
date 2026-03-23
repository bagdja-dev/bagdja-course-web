import Link from "next/link";
import Button from "../ui/Button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:rgba(11,15,20,0.7)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-[12px] font-extrabold text-[color:var(--bg-0)]">
            B
          </span>
          <span className="text-sm font-semibold tracking-tight text-text">Bagdja</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/courses" className="hidden md:block">
            <Button size="sm" variant="primary">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
