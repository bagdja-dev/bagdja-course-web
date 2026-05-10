import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { getAccessToken, fetchWithAuth } from "../../lib/api";

const nav = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/books", label: "Books" },
  { href: "/events", label: "Events" }
];

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchWithAuth("/users/me")
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [router.asPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    const loginUrl = new URL(process.env.NEXT_PUBLIC_LOGIN_URL || "https://login.bagdja.com");
    const appId = process.env.NEXT_PUBLIC_CLIENT_APP_ID || "course-app";

    // Tentukan callback URL
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    // Masukkan path saat ini sebagai parameter redirect agar kembali ke halaman yang sama
    callbackUrl.searchParams.set("redirect", router.asPath);

    loginUrl.searchParams.set("app_id", appId);
    loginUrl.searchParams.set("redirect_url", callbackUrl.toString());

    window.location.href = loginUrl.toString();
  };

  const handleLogout = () => {
    localStorage.removeItem("bagdja:access_token");
    setUser(null);
    setShowDropdown(false);
    router.push("/");
  };

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

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-[color:var(--bg-1)]"
              >
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs font-medium text-text">{user.full_name || user.username}</span>
                  <span className="text-[10px] text-muted capitalize">{user.role || "Member"}</span>
                </div>
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.username}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full object-cover border border-[color:var(--border)]"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-[color:var(--bg-0)] font-bold text-xs">
                    {(user.full_name || user.username || "U").substring(0, 1).toUpperCase()}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-0)] p-1 shadow-xl">
                  <div className="px-3 py-2 border-b border-[color:var(--border)] mb-1">
                    <p className="text-xs font-semibold text-text truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex w-full items-center px-3 py-2 text-sm text-muted hover:bg-[color:var(--bg-1)] hover:text-text rounded-md transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" variant="primary" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
