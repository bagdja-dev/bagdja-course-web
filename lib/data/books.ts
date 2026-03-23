import type { Book } from "../types";

export const books: Book[] = [
  {
    slug: "tailwind-ui-systems",
    title: "Tailwind UI Systems",
    subtitle: "A practical guide to tokens, components, and scalable UI.",
    author: "Bagdja Editorial",
    pages: 184,
    price: 159000,
    rating: 4.8,
    topics: ["Design Tokens", "Tailwind", "Components"],
    description:
      "Build consistent interfaces with a token-first approach. Includes component blueprints, layout recipes, and accessibility notes."
  },
  {
    slug: "backend-for-frontend",
    title: "Backend for Frontend",
    subtitle: "Patterns for APIs that make UIs faster to build.",
    author: "Bagdja Editorial",
    pages: 156,
    price: 149000,
    rating: 4.7,
    topics: ["API Design", "Caching", "Security"],
    description:
      "Learn how to shape APIs for UI needs: aggregation, caching, auth boundaries, and pragmatic schema design."
  },
  {
    slug: "shipping-nextjs",
    title: "Shipping Next.js",
    subtitle: "From prototype to production with confidence.",
    author: "Bagdja Editorial",
    pages: 212,
    price: 189000,
    rating: 4.9,
    topics: ["Next.js", "SEO", "Performance"],
    description:
      "A field guide to shipping: routing, rendering, SEO, bundle analysis, and deployment checklists you can reuse."
  }
];

