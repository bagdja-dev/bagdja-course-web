export type CourseMode = "online" | "offline";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Currency = "IDR";

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  mode: CourseMode;
  level: CourseLevel;
  durationHours: number;
  price: number;
  rating: number;
  lessons: number;
  locations?: string[];
  highlights: string[];
  schedules?: { id: string; label: string; startDate: string; endDate?: string; time: string }[];
};

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  pages: number;
  price: number;
  rating: number;
  topics: string[];
  description: string;
  coverUrl?: string | null;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  type: "webinar" | "workshop" | "meetup";
  description?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  outcome: string;
};

export type CourseLocation = {
  id: string;
  city: string;
  address: string;
  notes: string;
  lat?: number | null;
  lng?: number | null;
  imageUrls?: string[];
};

export type CheckoutDraft =
  | {
      kind: "course";
      currency: Currency;
      courseSlug: string;
      courseTitle: string;
      mode: CourseMode;
      scheduleId: string;
      locationId?: string;
      attendeeName: string;
      attendeeEmail: string;
      attendeePhone: string;
      unitPrice: number;
      quantity: number;
      createdAt: string;
    }
  | {
      kind: "book";
      currency: Currency;
      bookSlug: string;
      bookTitle: string;
      buyerEmail: string;
      unitPrice: number;
      quantity: number;
      createdAt: string;
    };
