import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { fetchWithAuth, apiGetOrder, getAccessToken } from "../lib/api";
import { formatMoney } from "../lib/money";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";

export default function ProfilePage() {
  const router = useRouter();
  const { status, orderId } = router.query;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allOrdersLoading, setAllOrdersLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

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

    setAllOrdersLoading(true);
    fetchWithAuth("/orders")
      .then((res) => res.json())
      .then((res) => {
        setAllOrders(res.data || []);
        setAllOrdersLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setAllOrdersLoading(false);
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
        <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
          <div className="text-red-400">Gagal memuat profil. Silakan login kembali.</div>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Kembali ke Beranda
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${user.full_name || user.username} | Profile`}>
      <div className="mx-auto max-w-2xl px-5 py-12">
        {/* Success Payment Notification */}
        {status === "success" && (
          <div className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-green-500">Pembayaran Berhasil!</h2>
            <p className="text-sm text-muted">Terima kasih atas pesanan Anda. Detail pesanan Anda dapat dilihat di riwayat pesanan.</p>
            {orderId && (
              <button
                onClick={() => {
                  const targetOrder = allOrders.find(o => o.id === orderId);
                  router.push(`/orders/${targetOrder?.platformRefNumber || orderId}`);
                }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 underline underline-offset-4"
              >
                Lihat Detail Pesanan
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="mb-8 flex items-center gap-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-1)] p-8">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-brand bg-brand flex items-center justify-center text-3xl font-bold text-[color:var(--bg-0)]">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.username}
                width={96}
                height={96}
                unoptimized
                className="h-full w-full object-cover"
              />
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

        <div className="space-y-8">
          {/* Account Information */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-text">Informasi Akun</h2>
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
          </section>

          {/* Order History */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-text">Riwayat Pesanan</h2>
            {allOrdersLoading ? (
              <div className="rounded-xl border border-[color:var(--border)] p-8 text-center text-muted">
                Memuat riwayat pesanan...
              </div>
            ) : allOrders.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-[color:var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[color:var(--bg-2)] text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-6 py-3 font-semibold">No. Invoice</th>
                      <th className="px-6 py-3 font-semibold">Tanggal</th>
                      <th className="px-6 py-3 font-semibold">Total</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)] bg-[color:var(--bg-1)]">
                    {allOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[color:var(--bg-2)] transition-colors cursor-pointer" onClick={() => router.push(`/orders/${o.platformRefNumber || o.id}`)}>
                        <td className="px-6 py-4 font-mono text-xs text-brand font-bold">{o.platformRefNumber || o.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4">
                          {new Date(o.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 font-bold">{formatMoney(o.total)}</td>
                        <td className="px-6 py-4">
                          <Badge tone={o.status === "paid" ? "success" : o.status === "pending" ? "warning" : "error"}>
                            {o.status === "paid" ? "Paid" : o.status === "pending" ? "Pending" : "Cancelled"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-[color:var(--border)] p-8 text-center text-muted">
                Belum ada riwayat pesanan.
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
