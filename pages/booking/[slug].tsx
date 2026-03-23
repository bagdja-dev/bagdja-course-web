import Layout from "@/components/layout/Layout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { apiCreateCourseCheckout, apiGetCourse, apiListLocations, getAccessToken } from "@/lib/api";
import { setCheckoutDraft } from "@/lib/checkoutDraft";
import { formatMoney } from "@/lib/money";
import type { Course, CourseLocation } from "@/lib/types";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function BookingPage(props: { course: Course; locations: CourseLocation[] }) {
  const router = useRouter();
  const c = props.course;

  const [scheduleId, setScheduleId] = useState((c.schedules ?? [])[0]?.id ?? "");
  const [locationId, setLocationId] = useState(c.mode === "offline" ? props.locations[0]?.id ?? "" : "");
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [quantity, setQuantity] = useState(1);

  const schedule = useMemo(
    () => (c.schedules ?? []).find((s) => s.id === scheduleId),
    [c.schedules, scheduleId]
  );
  const location = useMemo(() => props.locations.find((l) => l.id === locationId), [props.locations, locationId]);

  const total = c.price * quantity;

  const canSubmit =
    Boolean(scheduleId) &&
    attendeeName.trim().length >= 2 &&
    attendeeEmail.trim().length >= 5 &&
    attendeePhone.trim().length >= 6 &&
    quantity >= 1 &&
    (c.mode === "online" || Boolean(locationId));

  return (
    <Layout title={`Booking — ${c.title}`} description="Book a class and continue to checkout.">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={c.mode === "offline" ? "brand" : "muted"}>{c.mode.toUpperCase()}</Badge>
            <Badge>{c.level}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text">{c.title}</h1>
          <p className="mt-2 text-base text-muted">{c.tagline}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="text-sm font-semibold text-text">Schedule</div>
              <div className="mt-3">
                <Select value={scheduleId} onChange={(e) => setScheduleId(e.target.value)}>
                  {(c.schedules ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} — {s.startDate} ({s.time})
                    </option>
                  ))}
                </Select>
              </div>
              {schedule ? (
                <div className="mt-3 text-xs text-muted">
                  Start: <span className="text-text">{schedule.startDate}</span> • {schedule.time}
                </div>
              ) : null}
            </Card>

            <Card className="p-5">
              <div className="text-sm font-semibold text-text">Attendee</div>
              <div className="mt-3 space-y-3">
                <Input value={attendeeName} onChange={(e) => setAttendeeName(e.target.value)} placeholder="Full name" />
                <Input
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="Email"
                  inputMode="email"
                />
                <Input
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="Phone (WhatsApp)"
                  inputMode="tel"
                />
              </div>
            </Card>
          </div>

          {c.mode === "offline" ? (
            <div className="mt-4">
              <Card className="p-5">
                <div className="text-sm font-semibold text-text">Location</div>
                <div className="mt-3">
                  <Select value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                    {props.locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.city} — {l.address}
                      </option>
                    ))}
                  </Select>
                </div>
                {location ? (
                  <div className="mt-3 text-xs text-muted">
                    <span className="text-text">{location.city}</span> • {location.notes}
                  </div>
                ) : null}
              </Card>
            </div>
          ) : null}
        </div>

        <Card className="p-5">
          <div className="text-sm font-semibold text-text">Order summary</div>
          <div className="mt-1 text-sm text-muted">Draft checkout (payment coming soon).</div>

          <div className="mt-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-text">{c.title}</div>
                <div className="mt-1 text-xs text-muted">
                  {c.mode.toUpperCase()}
                  {c.mode === "offline" && location ? ` • ${location.city}` : ""}
                </div>
                {schedule ? <div className="mt-1 text-xs text-muted">{schedule.label}</div> : null}
              </div>
              <div className="text-sm font-semibold text-text">{formatMoney(c.price)}</div>
            </div>

            <label className="block text-xs font-semibold text-muted">
              Quantity
              <Input
                className="mt-2"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
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
              disabled={!canSubmit}
              onClick={async () => {
                const accessToken = getAccessToken();
                if (accessToken) {
                  try {
                    const data = await apiCreateCourseCheckout({
                      accessToken,
                      courseSlug: c.slug,
                      sessionId: scheduleId,
                      mode: c.mode,
                      locationId: c.mode === "offline" ? locationId : undefined,
                      attendeeName: attendeeName.trim(),
                      attendeeEmail: attendeeEmail.trim(),
                      attendeePhone: attendeePhone.trim(),
                      quantity
                    });
                    router.push(`/checkout?orderId=${encodeURIComponent(data.order.id)}`);
                    return;
                  } catch {
                    // fall back to local draft
                  }
                }

                setCheckoutDraft({
                  kind: "course",
                  currency: "IDR",
                  courseSlug: c.slug,
                  courseTitle: c.title,
                  mode: c.mode,
                  scheduleId,
                  locationId: c.mode === "offline" ? locationId : undefined,
                  attendeeName: attendeeName.trim(),
                  attendeeEmail: attendeeEmail.trim(),
                  attendeePhone: attendeePhone.trim(),
                  unitPrice: c.price,
                  quantity,
                  createdAt: new Date().toISOString()
                });
                router.push("/checkout");
              }}
            >
              Continue to checkout
            </Button>
          </div>

          {!canSubmit ? (
            <div className="mt-3 text-xs text-muted">
              Lengkapi jadwal, data peserta, dan lokasi (jika offline) untuk lanjut.
            </div>
          ) : null}
        </Card>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  try {
    const [course, locations] = await Promise.all([apiGetCourse(slug), apiListLocations()]);
    return { props: { course, locations } };
  } catch {
    return { notFound: true };
  }
};
