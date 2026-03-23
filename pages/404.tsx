import Layout from "@/components/layout/Layout";
import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFoundPage() {
  return (
    <Layout title="Not Found — Bagdja Course" description="Page not found">
      <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-8 text-center">
        <div className="text-sm font-semibold text-muted">404</div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-text">Page not found</h1>
        <p className="mt-2 text-sm text-muted">Link-nya mungkin sudah berubah atau halaman belum dibuat.</p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Back to Home
          </ButtonLink>
          <ButtonLink href="/courses" variant="secondary">
            Browse Courses
          </ButtonLink>
        </div>
      </div>
    </Layout>
  );
}

