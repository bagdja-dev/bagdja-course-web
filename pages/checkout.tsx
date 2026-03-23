import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { apiGetOrder, getAccessToken } from "@/lib/api";
import { clearCheckoutDraft, getCheckoutDraft, setCheckoutDraft } from "@/lib/checkoutDraft";
import { formatMoney } from "@/lib/money";
import type { CheckoutDraft } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [remoteOrder, setRemoteOrder] = useState<any | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!router.isReady) return;
      const orderId = typeof router.query.orderId === "string" ? router.query.orderId : null;
      const accessToken = getAccessToken();
      if (orderId && accessToken) {
        try {
          const data = await apiGetOrder({ accessToken, id: orderId });
          setRemoteOrder(data);
          setLoaded(true);
          return;
        } catch {
          // fallback to draft
        }
      }

      setDraft(getCheckoutDraft());
      setLoaded(true);
    };
    void run();
  }, [router.isReady, router.query.orderId]);

  const total = useMemo(() => {
    if (remoteOrder?.order?.total != null) return Number(remoteOrder.order.total) || 0;
    if (!draft) return 0;
    return draft.unitPrice * draft.quantity;
  }, [draft, remoteOrder]);

  return (
    <Layout title="Checkout — Bagdja Course" description="Order summary (payment integration coming soon).">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">Checkout</h1>
          <p className="mt-2 text-sm text-muted">
            Halaman ini hanya menampilkan detail order. Pembayaran akan di-handle oleh project{" "}
            <span className="text-text">bagdja-payment</span>.
          </p>

          <div className="mt-6">
            {!loaded ? (
              <Card className="p-5">
                <div className="text-sm text-muted">Loading…</div>
              </Card>
            ) : remoteOrder ? (
              <Card className="p-5">
                <div className="text-sm font-semibold text-text">Customer details</div>
                <div className="mt-1 text-sm text-muted">Loaded from backend order.</div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="block text-xs font-semibold text-muted md:col-span-2">
                    Order ID
                    <Input className="mt-2" value={remoteOrder.order.id} readOnly />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Status
                    <Input className="mt-2" value={remoteOrder.order.status} readOnly />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    Kind
                    <Input className="mt-2" value={remoteOrder.order.kind} readOnly />
                  </label>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      clearCheckoutDraft();
                      setDraft(null);
                      setRemoteOrder(null);
                      router.replace("/checkout");
                    }}
                  >
                    Clear view
                  </Button>
                  <Button variant="secondary" onClick={() => alert("Integrate bagdja-payment here")}>
                    Proceed to payment
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted">
                  Tombol payment masih placeholder (akan diarahkan ke flow `bagdja-payment`).
                </div>
              </Card>
            ) : !draft ? (
              <Card className="p-5">
                <div className="text-sm font-semibold text-text">No active order</div>
                <div className="mt-1 text-sm text-muted">Pilih course atau book dulu untuk membuat checkout draft.</div>
                <div className="mt-4 flex gap-3">
                  <ButtonLink href="/courses" variant="primary">
                    Browse Courses
                  </ButtonLink>
                  <ButtonLink href="/books" variant="secondary">
                    Browse Books
                  </ButtonLink>
                </div>
              </Card>
            ) : (
              <Card className="p-5">
                <div className="text-sm font-semibold text-text">Customer details</div>

                {draft.kind === "course" ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-semibold text-muted">
                      Name
                      <Input className="mt-2" value={draft.attendeeName} readOnly />
                    </label>
                    <label className="block text-xs font-semibold text-muted">
                      Email
                      <Input className="mt-2" value={draft.attendeeEmail} readOnly />
                    </label>
                    <label className="block text-xs font-semibold text-muted md:col-span-2">
                      Phone
                      <Input className="mt-2" value={draft.attendeePhone} readOnly />
                    </label>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-xs font-semibold text-muted md:col-span-2">
                      Email for delivery
                      <Input
                        className="mt-2"
                        value={draft.buyerEmail}
                        onChange={(e) => {
                          const updated: CheckoutDraft = { ...draft, buyerEmail: e.target.value };
                          setDraft(updated);
                          setCheckoutDraft(updated);
                        }}
                        placeholder="you@email.com"
                        inputMode="email"
                      />
                    </label>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      clearCheckoutDraft();
                      setDraft(null);
                    }}
                  >
                    Clear order
                  </Button>
                  <Button variant="secondary" onClick={() => alert("Integrate bagdja-payment here")}>
                    Proceed to payment
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted">
                  Tombol payment masih placeholder (akan diarahkan ke flow `bagdja-payment`).
                </div>
              </Card>
            )}
          </div>
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold text-text">Order summary</div>
          {remoteOrder ? (
            <>
              <div className="mt-4 space-y-3">
                {(remoteOrder.items ?? []).map((it: any) => (
                  <div key={it.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-text">{it.title}</div>
                      <div className="mt-1 text-xs text-muted">
                        {String(it.productType).toUpperCase()} • Qty: {it.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-text">{formatMoney(Number(it.unitPrice) || 0)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-[color:var(--border)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-text">{formatMoney(Number(remoteOrder.order.subtotal) || 0)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted">Fees</span>
                  <span className="font-semibold text-text">{formatMoney(0)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted">Total</span>
                  <span className="text-lg font-extrabold text-text">{formatMoney(total)}</span>
                </div>
              </div>
            </>
          ) : !draft ? (
            <div className="mt-4 text-sm text-muted">No items</div>
          ) : (
            <>
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text">
                      {draft.kind === "course" ? draft.courseTitle : draft.bookTitle}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {draft.kind === "course"
                        ? `${draft.mode.toUpperCase()} • schedule ${draft.scheduleId}`
                        : "eBook • PDF"}
                      {draft.kind === "course" && draft.locationId ? ` • ${draft.locationId}` : ""}
                    </div>
                    <div className="mt-1 text-xs text-muted">Qty: {draft.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-text">{formatMoney(draft.unitPrice)}</div>
                </div>
              </div>

              <div className="mt-5 border-t border-[color:var(--border)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold text-text">{formatMoney(total)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted">Fees</span>
                  <span className="font-semibold text-text">{formatMoney(0)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted">Total</span>
                  <span className="text-lg font-extrabold text-text">{formatMoney(total)}</span>
                </div>
              </div>
            </>
          )}

          <div className="mt-5 rounded-xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-4">
            <div className="text-xs font-semibold text-muted">Integration note</div>
            <div className="mt-1 text-xs text-muted">
              Flow payment idealnya menerima payload draft ini dan mengembalikan status paid + receipt.
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
