import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth, apiGetOrder, getAccessToken } from "../../lib/api";
import { formatMoney } from "../../lib/money";
import Layout from "../../components/layout/Layout";
import Badge from "../../components/ui/Badge";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);

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
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (id && typeof id === "string" && token) {
      setOrderLoading(true);
      apiGetOrder({ id, accessToken: token })
        .then((data) => {
          setOrder(data);
          setOrderLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
          setOrderLoading(false);
        });
    }
  }, [id]);

  if (loading || (orderLoading && !order)) {
    return (
      <Layout title="Detail Pesanan | Bagdja Course">
        <div className="flex min-h-[60vh] items-center justify-center text-muted">Memuat detail pesanan...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Detail Pesanan | Bagdja Course">
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

  if (!order && !orderLoading) {
    return (
      <Layout title="Detail Pesanan | Bagdja Course">
        <div className="flex min-h-[60vh] items-center justify-center flex-col gap-4">
          <div className="text-red-400">Pesanan tidak ditemukan.</div>
          <button
            onClick={() => router.push("/profile")}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Kembali ke Profil
          </button>
        </div>
      </Layout>
    );
  }

  const invoice = order?.order?.platformRefNumber;

  return (
    <Layout title={`Pesanan ${id} | Bagdja Course`}>
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-brand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Riwayat Pesanan
          </button>
        </div>

        {order && (
          <div className={`mb-12 overflow-hidden rounded-3xl border-2 ${invoice ? "border-brand shadow-[0_20px_50px_rgba(242,178,74,0.15)]" : "border-[color:var(--border)]"} bg-[color:var(--bg-1)]`}>
            {/* Header Section with Paper-like feel */}
            <div className={`relative border-b border-[color:var(--border)] ${invoice ? "bg-gradient-to-br from-brand/10 to-transparent" : "bg-[color:var(--bg-2)]"} px-8 py-10`}>
              {invoice && (
                <div className="absolute right-8 top-8 opacity-10 select-none pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-brand">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.5h7c-.47 4.19-2.85 7.89-7 9.11-4.15-1.22-6.53-4.92-7-9.11h7V4.22l5.5 2.44V11.5z" />
                  </svg>
                </div>
              )}

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black tracking-tight text-text">{invoice ? "INVOICE" : "PESANAN"}</h2>
                    {invoice && <Badge tone="brand">RESMI</Badge>}
                  </div>
                  {invoice && (
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="font-mono text-lg font-bold text-brand">{invoice}</p>
                      <p className="text-xs text-muted uppercase tracking-widest">Platform Transaction ID</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <Badge tone={order.order.status === "paid" ? "success" : order.order.status === "pending" ? "warning" : "error"}>
                      <span className="px-2 py-1 text-sm font-bold">
                        {order.order.status === "paid" ? "LUNAS" : order.order.status === "pending" ? "MENUNGGU" : "BATAL"}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted">Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {/* Billing Info Grid */}
              <div className="mb-12 grid gap-10 md:grid-cols-2">
                <div className="relative">
                  <div className="absolute -left-4 top-0 h-full w-1 bg-brand/30"></div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Ditagihkan Kepada</h3>
                  <div className="space-y-2">
                    <p className="text-xl font-extrabold text-text">{user.full_name || user.username}</p>
                    <p className="flex items-center gap-2 text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="md:text-right">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted">Rincian Transaksi</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between md:justify-end md:gap-8">
                      <span className="text-muted">ID Pesanan:</span>
                      <span className="font-mono font-bold text-text">{order.order.id}</span>
                    </div>
                    <div className="flex justify-between md:justify-end md:gap-8">
                      <span className="text-muted">Tanggal Transaksi:</span>
                      <span className="font-bold text-text">
                        {new Date(order.order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between md:justify-end md:gap-8">
                      <span className="text-muted">Metode Pembayaran:</span>
                      <span className="font-bold text-text">Midtrans Payment Gateway</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table - Detailed */}
              <div className="mb-10 overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[color:var(--bg-2)] text-xs uppercase tracking-widest text-muted">
                    <tr>
                      <th className="px-8 py-5 font-bold">Deskripsi Produk</th>
                      <th className="px-8 py-5 text-center font-bold">Jumlah</th>
                      <th className="px-8 py-5 text-right font-bold">Harga Satuan</th>
                      <th className="px-8 py-5 text-right font-bold">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)] bg-[color:var(--bg-1)]">
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-[color:var(--bg-2)]/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-black text-text">{item.title}</div>
                          <div className="mt-1 text-xs text-muted uppercase tracking-tighter">{item.productType} • {item.productSlug}</div>
                        </td>
                        <td className="px-8 py-6 text-center font-medium text-text">{item.quantity}</td>
                        <td className="px-8 py-6 text-right font-medium text-text">{formatMoney(item.unitPrice)}</td>
                        <td className="px-8 py-6 text-right font-black text-text">{formatMoney(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex flex-col items-end gap-4 border-t-2 border-[color:var(--border)] pt-10">
                <div className="flex w-full max-w-[320px] justify-between text-sm">
                  <span className="font-bold text-muted">Subtotal</span>
                  <span className="font-bold text-text">{formatMoney(order.order.subtotal || order.order.total)}</span>
                </div>
                <div className="flex w-full max-w-[320px] justify-between text-sm">
                  <span className="font-bold text-muted">Biaya Layanan</span>
                  <span className="font-bold text-text">{formatMoney(0)}</span>
                </div>
                <div className="mt-2 flex w-full max-w-[320px] items-center justify-between rounded-xl bg-brand/5 px-6 py-4">
                  <span className="text-lg font-black text-text">TOTAL</span>
                  <span className="text-2xl font-black text-brand">{formatMoney(order.order.total)}</span>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="mt-16 flex flex-col gap-8 border-t border-[color:var(--border)] pt-10 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-text">Terima kasih atas kepercayaan Anda!</p>
                  <p className="mt-1 text-xs text-muted italic">Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-3 rounded-xl bg-text px-6 py-3 text-sm font-black text-[color:var(--bg-0)] transition-transform hover:scale-105 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    CETAK INVOICE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
