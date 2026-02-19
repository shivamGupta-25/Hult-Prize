"use client";

import EventCard from "./EventCard";

/* YearSection — year heading + responsive grid of EventCards. */
export default function YearSection({ year, events, onSelect, hideYearLabel }) {
  return (
    <div>
      {!hideYearLabel && (
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl font-black text-primary leading-none select-none tabular-nums">
            {year}
          </span>
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
