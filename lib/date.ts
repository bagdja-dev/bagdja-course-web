export function formatDate(dateISO: string) {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

