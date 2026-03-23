import Layout from "@/components/layout/Layout";
import BookCard from "@/components/catalog/BookCard";
import CourseCard from "@/components/catalog/CourseCard";
import EventRow from "@/components/catalog/EventRow";
import LocationCard from "@/components/catalog/LocationCard";
import TestimonialCard from "@/components/catalog/TestimonialCard";
import Badge from "@/components/ui/Badge";
import ButtonLink from "@/components/ui/ButtonLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { events, testimonials } from "@/lib/data";
import { apiListBooks, apiListCourses, apiListEvents, apiListLocations } from "@/lib/api";
import type { Book, Course, CourseLocation, Event, Testimonial } from "@/lib/types";
import type { GetServerSideProps } from "next";

export default function HomePage(props: {
  hotCourses: Course[];
  featuredBooks: Book[];
  upcomingEvents: Event[];
  quotes: Testimonial[];
  locations: CourseLocation[];
}) {
  return (
    <Layout title="Bagdja Course" description="Portal kursus online/offline dan eBook untuk developer & product builder.">
      <section className="pt-3">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Badge tone="brand">Build skills, ship faster</Badge>
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-text md:text-6xl">
            Learn. Build.
            <span className="block text-[color:rgba(242,178,74,0.95)]">Get it shipped.</span>
          </h1>
          <p className="mt-4 text-base text-muted md:text-lg">
            Kursus online/offline untuk developer & product builder, plus eBook praktis yang bisa langsung dipakai di
            project.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/courses" variant="primary">
              Explore Courses
            </ButtonLink>
            <ButtonLink href="/books" variant="secondary">
              Browse eBooks
            </ButtonLink>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
            {[
              { k: "80%", v: "Faster launch" },
              { k: "60%", v: "Cost reduction" },
              { k: "<5 min", v: "Checkout draft" },
              { k: "Pages Router", v: "Next.js boilerplate" }
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.55)] px-4 py-3"
              >
                <div className="text-lg font-extrabold tracking-tight text-[color:rgba(242,178,74,0.95)]">{s.k}</div>
                <div className="text-xs text-muted">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          title="Hot Courses"
          subtitle="Kursus paling dicari minggu ini."
          action={
            <ButtonLink href="/courses" size="sm" variant="ghost">
              View all →
            </ButtonLink>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {props.hotCourses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading
          title="Books"
          subtitle="eBook ringkas, langsung bisa dipraktikkan."
          action={
            <ButtonLink href="/books" size="sm" variant="ghost">
              View all →
            </ButtonLink>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {props.featuredBooks.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading title="Events" subtitle="Webinar & workshop komunitas." />
        <div className="grid gap-3">
          {props.upcomingEvents.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading title="Testimonials" subtitle="Cerita singkat dari alumni." />
        <div className="grid gap-4 md:grid-cols-3">
          {props.quotes.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading title="Course Locations" subtitle="Kelas offline tersedia di beberapa kota." />
        <div className="grid gap-4 md:grid-cols-3">
          {props.locations.map((loc) => (
            <LocationCard key={loc.id} loc={loc} />
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-6">
          <div className="text-sm font-semibold text-text">Map placeholder</div>
          <div className="mt-1 text-sm text-muted">
            Nanti bisa diintegrasikan ke Google Maps / Mapbox untuk menampilkan titik lokasi.
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [hotCourses, featuredBooks, locations, upcomingEvents] = await Promise.all([
      apiListCourses(),
      apiListBooks(),
      apiListLocations(),
      apiListEvents(true)
    ]);

    return {
      props: {
        hotCourses: hotCourses.slice(0, 3),
        featuredBooks: featuredBooks.slice(0, 3),
        upcomingEvents: upcomingEvents.slice(0, 3),
        quotes: testimonials.slice(0, 3),
        locations: locations.slice(0, 3)
      }
    };
  } catch {
    return {
      props: {
        hotCourses: [],
        featuredBooks: [],
        upcomingEvents: events.slice(0, 3),
        quotes: testimonials.slice(0, 3),
        locations: []
      }
    };
  }
};
