import type { Book, Course, CourseLocation } from "./types";

type ApiEnvelope<T> = { data: T };

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3008";
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("bagdja:access_token") ||
    window.localStorage.getItem("access_token") ||
    window.localStorage.getItem("token")
  );
}

async function apiFetch<T>(path: string, init?: RequestInit & { accessToken?: string | null }) {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("accept", "application/json");
  if (init?.body) headers.set("content-type", "application/json");
  if (init?.accessToken) {
    headers.set("authorization", `Bearer ${init.accessToken}`);
  }

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      typeof json === "object" && json && "message" in json ? String((json as any).message) : res.statusText;
    throw new Error(`API ${res.status}: ${message}`);
  }

  return json as T;
}

export async function apiListCourses(mode?: "online" | "offline") {
  const qs = mode ? `?mode=${encodeURIComponent(mode)}` : "";
  const res = await apiFetch<ApiEnvelope<Course[]>>(`/courses${qs}`);
  return res.data;
}

export async function apiGetCourse(slug: string) {
  const res = await apiFetch<ApiEnvelope<Course & { sessions?: any[] }>>(`/courses/${encodeURIComponent(slug)}`);
  const c: any = res.data;
  if (Array.isArray(c.sessions) && !c.schedules) {
    c.schedules = c.sessions.map((s: any) => ({
      id: String(s.id),
      label: String(s.label),
      startDate: String(s.startDate),
      endDate: s.endDate ? String(s.endDate) : undefined,
      time: String(s.time)
    }));
  }
  return c as Course;
}

export async function apiListBooks() {
  const res = await apiFetch<ApiEnvelope<any[]>>("/books");
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map((b: any) => ({
    slug: String(b.slug),
    title: String(b.title),
    subtitle: String(b.subtitle ?? ""),
    author: String(b.author ?? ""),
    pages: Number(b.pages ?? 0),
    price: Number(b.price ?? 0),
    rating: Number(b.rating ?? 0),
    topics: Array.isArray(b.topics) ? b.topics.map((t: any) => String(t)) : [],
    description: String(b.description ?? ""),
    coverUrl: b.coverUrl ? String(b.coverUrl) : null
  })) as Book[];
}

export async function apiGetBook(slug: string) {
  const res = await apiFetch<ApiEnvelope<any>>(`/books/${encodeURIComponent(slug)}`);
  const b: any = res.data ?? {};
  return {
    slug: String(b.slug),
    title: String(b.title),
    subtitle: String(b.subtitle ?? ""),
    author: String(b.author ?? ""),
    pages: Number(b.pages ?? 0),
    price: Number(b.price ?? 0),
    rating: Number(b.rating ?? 0),
    topics: Array.isArray(b.topics) ? b.topics.map((t: any) => String(t)) : [],
    description: String(b.description ?? ""),
    coverUrl: b.coverUrl ? String(b.coverUrl) : null
  } as Book;
}

export async function apiListLocations() {
  const res = await apiFetch<ApiEnvelope<CourseLocation[]>>("/locations");
  return res.data;
}

export async function apiListEvents(active = true) {
  const qs = `?active=${active ? "true" : "false"}`;
  const res = await apiFetch<ApiEnvelope<any[]>>(`/events${qs}`);
  const rows = Array.isArray(res.data) ? res.data : [];
  return rows.map((e: any) => ({
    id: String(e.id),
    slug: String(e.slug ?? ""),
    title: String(e.title),
    description: e.description ? String(e.description) : undefined,
    date: String(e.startAt ?? e.start_at ?? e.date ?? ""),
    location: String(e.location ?? ""),
    type: (e.type === "workshop" ? "workshop" : e.type === "meetup" ? "meetup" : "webinar") as any
  }));
}

export async function apiCreateCourseCheckout(input: {
  accessToken?: string;
  courseSlug: string;
  sessionId: string;
  mode: "online" | "offline";
  locationId?: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  quantity: number;
}) {
  const res = await apiFetch<ApiEnvelope<{ order: { id: string } }>>("/checkout/course", {
    method: "POST",
    accessToken: input.accessToken,
    body: JSON.stringify(input)
  });
  return res.data;
}

export async function apiCreateBookCheckout(input: {
  accessToken?: string;
  bookSlug: string;
  buyerEmail: string;
  quantity: number;
}) {
  const res = await apiFetch<ApiEnvelope<{ order: { id: string } }>>("/checkout/book", {
    method: "POST",
    accessToken: input.accessToken,
    body: JSON.stringify(input)
  });
  return res.data;
}

export async function apiGetOrder(input: { accessToken?: string; id: string }) {
  const res = await apiFetch<ApiEnvelope<any>>(`/orders/${encodeURIComponent(input.id)}`, {
    accessToken: input.accessToken
  });
  return res.data;
}

export async function apiCreatePaymentTransaction(input: { accessToken?: string; orderId: string }) {
  const res = await apiFetch<{ token: string; redirect_url: string }>("/payment/create-transaction", {
    method: "POST",
    accessToken: input.accessToken,
    body: JSON.stringify({ orderId: input.orderId })
  });
  return res;
}
