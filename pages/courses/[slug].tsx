import Layout from "@/components/layout/Layout";
import Badge from "@/components/ui/Badge";
import ButtonLink from "@/components/ui/ButtonLink";
import Card from "@/components/ui/Card";
import { apiGetCourse } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import type { Course } from "@/lib/types";
import type { GetServerSideProps } from "next";

export default function CourseDetailPage(props: { course: Course }) {
  const c = props.course;
  return (
    <Layout title={`${c.title} — Courses`} description={c.tagline}>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={c.mode === "offline" ? "brand" : "muted"}>{c.mode.toUpperCase()}</Badge>
            <Badge>{c.level}</Badge>
            <Badge>{c.rating.toFixed(1)} ★</Badge>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text md:text-4xl">{c.title}</h1>
          <p className="mt-2 text-base text-muted">{c.tagline}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { k: "Lessons", v: String(c.lessons) },
              { k: "Duration", v: `${c.durationHours} hours` },
              { k: "Price", v: formatMoney(c.price) }
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] px-5 py-4"
              >
                <div className="text-xs text-muted">{s.k}</div>
                <div className="mt-1 text-sm font-semibold text-text">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-6">
            <div className="text-sm font-semibold text-text">What you’ll build</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              {c.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold text-text">Book a class</div>
          <div className="mt-1 text-sm text-muted">Pilih jadwal, isi data, lalu lanjut ke checkout.</div>

          <div className="mt-5 space-y-3">
            {(c.schedules ?? []).map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-4"
              >
                <div className="text-sm font-semibold text-text">{s.label}</div>
                <div className="mt-1 text-xs text-muted">
                  Start: <span className="text-text">{s.startDate}</span> • {s.time}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <ButtonLink href={`/booking/${c.slug}`} variant="primary" className="w-full">
              Book this class
            </ButtonLink>
          </div>
          <div className="mt-3 text-xs text-muted">
            Checkout hanya berisi detail order. Payment akan diintegrasikan via `bagdja-payment`.
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  try {
    const course = await apiGetCourse(slug);
    return { props: { course } };
  } catch {
    return { notFound: true };
  }
};
