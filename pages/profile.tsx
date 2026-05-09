import { useEffect, useState } from "react";
import { fetchWithAuth } from "../lib/api";
import Layout from "../components/layout/Layout";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth("/users/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout title="Profile | Bagdja Course">
        <div className="flex min-h-[60vh] items-center justify-center text-muted">Loading profile...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Profile | Bagdja Course">
        <div className="flex min-h-[60vh] items-center justify-center text-red-400">Gagal memuat profil. Silakan login kembali.</div>
      </Layout>
    );
  }

  return (
    <Layout title={`${user.full_name || user.username} | Profile`}>
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="mb-8 flex items-center gap-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] p-8">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-brand bg-brand flex items-center justify-center text-3xl font-bold text-[color:var(--bg-0)]">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              (user.full_name || user.username || "U").substring(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{user.full_name || user.username}</h1>
            <p className="text-muted">{user.email}</p>
            <div className="mt-2 inline-flex rounded-full bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
              {user.role || "Member"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Informasi Akun</h2>
          <div className="grid gap-4 rounded-xl border border-[color:var(--border)] p-6">
            <div className="flex justify-between border-b border-[color:var(--border)] pb-3">
              <span className="text-sm text-muted">Username</span>
              <span className="text-sm font-medium text-text">{user.username}</span>
            </div>
            <div className="flex justify-between border-b border-[color:var(--border)] pb-3">
              <span className="text-sm text-muted">Email</span>
              <span className="text-sm font-medium text-text">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Bergabung Sejak</span>
              <span className="text-sm font-medium text-text">
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
