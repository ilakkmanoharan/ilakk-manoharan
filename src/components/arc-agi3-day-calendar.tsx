import Link from "next/link";

type Props = {
  dates: string[];
  basePath?: string;
  selected?: string;
};

/** Simple month-agnostic calendar of recorded experiment days. */
export function ArcAgi3DayCalendar({
  dates,
  basePath = "/projects/arc-agi-3/daily",
  selected,
}: Props) {
  if (dates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No daily research pages yet. The ARC project-page-agent writes one per
        America/Chicago day at 11 PM.
      </p>
    );
  }

  const byMonth = new Map<string, string[]>();
  for (const d of dates) {
    const key = d.slice(0, 7);
    const list = byMonth.get(key) ?? [];
    list.push(d);
    byMonth.set(key, list);
  }

  return (
    <div className="space-y-6">
      {[...byMonth.entries()].map(([month, days]) => (
        <div key={month}>
          <h3 className="text-sm font-medium text-muted-foreground">
            {new Date(`${month}-01T12:00:00Z`).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {days.map((d) => {
              const active = d === selected;
              return (
                <Link
                  key={d}
                  href={`${basePath}/${d}`}
                  className={
                    active
                      ? "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                      : "rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                  }
                >
                  {d.slice(8)}
                  <span className="sr-only"> {d}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
