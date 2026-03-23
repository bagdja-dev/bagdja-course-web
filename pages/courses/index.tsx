import Layout from "@/components/layout/Layout";
import CourseCard from "@/components/catalog/CourseCard";
import ButtonLink from "@/components/ui/ButtonLink";
import SectionHeading from "@/components/ui/SectionHeading";
import { apiListCourses } from "@/lib/api";
import type { Course, CourseMode } from "@/lib/types";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";

function normalizeMode(mode: unknown): CourseMode | "all" {
  if (mode === "online" || mode === "offline") return mode;
  return "all";
}

export default function CoursesPage(props: { courses: Course[] }) {
  const router = useRouter();
  const mode = normalizeMode(router.query.mode);

  const filtered = useMemo(() => {
    if (mode === "all") return props.courses;
    return props.courses.filter((c) => c.mode === mode);
  }, [mode, props.courses]);

  return (
    <Layout title="Courses — Bagdja Course" description="Browse online/offline courses and book a class.">
      <SectionHeading
        title="Courses"
        subtitle="Listing course online & offline."
        action={
          <div className="flex items-center gap-2">
            <ButtonLink href="/courses" size="sm" variant={mode === "all" ? "primary" : "secondary"}>
              All
            </ButtonLink>
            <ButtonLink
              href="/courses?mode=online"
              size="sm"
              variant={mode === "online" ? "primary" : "secondary"}
            >
              Online
            </ButtonLink>
            <ButtonLink
              href="/courses?mode=offline"
              size="sm"
              variant={mode === "offline" ? "primary" : "secondary"}
            >
              Offline
            </ButtonLink>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const courses = await apiListCourses();
    return { props: { courses } };
  } catch {
    return { props: { courses: [] } };
  }
};
