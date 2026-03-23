import Layout from "@/components/layout/Layout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { apiCreateBookCheckout, apiGetBook, getAccessToken } from "@/lib/api";
import { setCheckoutDraft } from "@/lib/checkoutDraft";
import { formatMoney } from "@/lib/money";
import type { Book } from "@/lib/types";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function BookDetailPage(props: { book: Book }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);

  const total = useMemo(() => props.book.price * qty, [props.book.price, qty]);

  return (
    <Layout title={`${props.book.title} — Books`} description={props.book.subtitle}>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {props.book.topics.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text md:text-4xl">{props.book.title}</h1>
          <p className="mt-2 text-base text-muted">{props.book.subtitle}</p>

          <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-6">
            <div className="grid gap-3 text-sm text-muted sm:grid-cols-3">
              <div>
                <div className="text-xs">Author</div>
                <div className="mt-1 font-semibold text-text">{props.book.author}</div>
              </div>
              <div>
                <div className="text-xs">Pages</div>
                <div className="mt-1 font-semibold text-text">{props.book.pages}</div>
              </div>
              <div>
                <div className="text-xs">Rating</div>
                <div className="mt-1 font-semibold text-text">{props.book.rating.toFixed(1)} ★</div>
              </div>
            </div>
            <div className="mt-5 text-sm text-muted">{props.book.description}</div>
          </div>
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold text-text">Checkout draft</div>
          <div className="mt-1 text-sm text-muted">
            Nanti proses pembayaran akan diintegrasikan ke <span className="text-text">bagdja-payment</span>.
          </div>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-semibold text-muted">
              Email
              <Input
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                inputMode="email"
              />
            </label>

            <label className="block text-xs font-semibold text-muted">
              Quantity
              <Input
                className="mt-2"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
            <div>
              <div className="text-xs text-muted">Total</div>
              <div className="text-lg font-extrabold text-text">{formatMoney(total)}</div>
            </div>
            <Button
              variant="primary"
              onClick={async () => {
                const accessToken = getAccessToken();
                if (accessToken) {
                  try {
                    const data = await apiCreateBookCheckout({
                      accessToken,
                      bookSlug: props.book.slug,
                      buyerEmail: email.trim(),
                      quantity: qty
                    });
                    router.push(`/checkout?orderId=${encodeURIComponent(data.order.id)}`);
                    return;
                  } catch {
                    // fall back to local draft
                  }
                }

                setCheckoutDraft({
                  kind: "book",
                  currency: "IDR",
                  bookSlug: props.book.slug,
                  bookTitle: props.book.title,
                  buyerEmail: email.trim(),
                  unitPrice: props.book.price,
                  quantity: qty,
                  createdAt: new Date().toISOString()
                });
                router.push("/checkout");
              }}
            >
              Buy eBook
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted">Format: PDF (download link after payment)</div>
        </Card>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  try {
    const book = await apiGetBook(slug);
    return { props: { book } };
  } catch {
    return { notFound: true };
  }
};
