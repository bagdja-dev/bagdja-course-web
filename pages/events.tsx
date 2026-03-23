import Layout from "@/components/layout/Layout";
import EventRow from "@/components/catalog/EventRow";
import SectionHeading from "@/components/ui/SectionHeading";
import { apiListEvents } from "@/lib/api";
import { events as fallbackEvents } from "@/lib/data";
import type { Event } from "@/lib/types";
import type { GetServerSideProps } from "next";

export default function EventsPage(props: { events: Event[] }) {
  return (
    <Layout title="Events — Bagdja Course" description="Webinar, workshop, dan meetup untuk komunitas Bagdja.">
      <div className="mb-6">
        <SectionHeading title="Events" subtitle="Webinar & workshop komunitas." />
      </div>
      <div className="grid gap-3">
        {props.events.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
        {props.events.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:rgba(17,24,33,0.45)] p-6 text-sm text-muted">
            No events yet.
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const list = await apiListEvents(true);
    return { props: { events: list } };
  } catch {
    return { props: { events: fallbackEvents } };
  }
};

