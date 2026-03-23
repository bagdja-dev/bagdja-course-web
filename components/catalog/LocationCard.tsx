import type { CourseLocation } from "@/lib/types";
import Card from "../ui/Card";

export default function LocationCard({ loc }: { loc: CourseLocation }) {
  return (
    <Card className="h-full p-5">
      <div className="text-sm font-extrabold tracking-tight text-text">{loc.city}</div>
      <div className="mt-2 text-sm text-muted">{loc.address}</div>
      <div className="mt-3 text-xs text-muted">{loc.notes}</div>
    </Card>
  );
}

