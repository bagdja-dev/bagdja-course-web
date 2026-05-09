import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../lib/api";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const syncUser = async (token: string, redirectPath: string) => {
      try {
        // 1. Simpan token ke localStorage
        localStorage.setItem("bagdja:access_token", token);

        // 2. Panggil API backend Course untuk melakukan sinkronisasi profil (Secure B2B)
        const syncRes = await fetchWithAuth("/users/sync", {
          method: "POST"
        });

        if (!syncRes.ok) {
          const errorData = await syncRes.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to sync user via API");
        }

        // 3. Berhasil, arahkan ke halaman asal atau ke Home
        router.push(redirectPath || "/");
      } catch (err) {
        console.error("SSO Sync Error:", err);
        localStorage.removeItem("bagdja:access_token");
        router.push(`/?error=sync_failed&message=${encodeURIComponent(err instanceof Error ? err.message : "Unknown error")}`);
      }
    };

    const { token, redirect, error, message } = router.query;

    if (error) {
      console.error("SSO Error:", error, message);
      router.push("/");
      return;
    }

    if (token && typeof token === "string") {
      syncUser(token, typeof redirect === "string" ? redirect : "/");
    } else {
      router.push("/");
    }
  }, [router.isReady, router.query]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bg-0)] text-text">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
        <p className="text-sm text-muted">Synchronizing profile via API...</p>
      </div>
    </div>
  );
}
