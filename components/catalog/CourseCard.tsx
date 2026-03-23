import Link from "next/link";
import type { Course } from "@/lib/types";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { formatMoney } from "@/lib/money";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group h-full p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={course.mode === "offline" ? "brand" : "muted"}>
              {course.mode.toUpperCase()}
            </Badge>
            <Badge>{course.level}</Badge>
          </div>
          <h3 className="mt-3 text-base font-extrabold tracking-tight text-text md:text-lg">
            <Link href={`/courses/${course.slug}`} className="hover:underline">
              {course.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-muted">{course.tagline}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-text">{formatMoney(course.price)}</div>
          <div className="mt-1 text-xs text-muted">{course.rating.toFixed(1)} ★</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-muted">
        <li>
          <span className="text-text">{course.lessons}</span> lessons •{" "}
          <span className="text-text">{course.durationHours}</span> hours
        </li>
        <li className="line-clamp-2">{course.highlights[0]}</li>
      </ul>

      <div className="mt-5">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center text-sm font-semibold text-[color:rgba(242,178,74,0.95)] hover:underline"
        >
          View details →
        </Link>
      </div>
    </Card>
  );
}

