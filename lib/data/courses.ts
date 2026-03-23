import type { Course } from "../types";

export const courses: Course[] = [
  {
    slug: "nextjs-production-frontend",
    title: "Next.js Production Frontend",
    tagline: "Ship fast with Pages Router, Tailwind, and real-world patterns.",
    mode: "online",
    level: "intermediate",
    durationHours: 12,
    lessons: 28,
    price: 1490000,
    rating: 4.8,
    highlights: ["Pages Router & data fetching", "Design system with Tailwind", "SEO, performance, deployment"],
    schedules: [
      { id: "s1", label: "Weekend Cohort", startDate: "2026-04-04", time: "09:00–12:00 WIB" },
      { id: "s2", label: "Weeknight Cohort", startDate: "2026-04-07", time: "19:30–21:30 WIB" }
    ]
  },
  {
    slug: "nodejs-api-masterclass",
    title: "Node.js API Masterclass",
    tagline: "Build secure REST APIs with validation, auth, and observability.",
    mode: "online",
    level: "beginner",
    durationHours: 10,
    lessons: 24,
    price: 1290000,
    rating: 4.7,
    highlights: ["Auth & RBAC basics", "Testing + error handling", "Logging + metrics"],
    schedules: [{ id: "s1", label: "Self-paced", startDate: "2026-03-20", time: "Anytime" }]
  },
  {
    slug: "ui-engineering-offline-bootcamp",
    title: "UI Engineering Offline Bootcamp",
    tagline: "Hands-on workshop: layout, typography, components, and accessibility.",
    mode: "offline",
    level: "beginner",
    durationHours: 16,
    lessons: 10,
    price: 2490000,
    rating: 4.9,
    locations: ["jakarta", "bandung"],
    highlights: ["Design tokens & component patterns", "Responsive layout drills", "A11y & UX reviews"],
    schedules: [
      { id: "s1", label: "Jakarta (2 days)", startDate: "2026-04-18", time: "10:00–18:00 WIB" },
      { id: "s2", label: "Bandung (2 days)", startDate: "2026-05-02", time: "10:00–18:00 WIB" }
    ]
  }
];

