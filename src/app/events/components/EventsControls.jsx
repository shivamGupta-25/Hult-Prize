"use client";

import { Search, X } from "lucide-react";

/* EventsControls — sticky year-tab bar + search input. */
export default function EventsControls({
  years,
  allEvents,
  eventsByYear,
  selectedYear,
  searchQuery,
  onYearChange,
  onSearchChange,
  onClearSearch,
}) {
  const tabs = ["All", ...years];

  return (
    <div className="sticky top-16 md:top-20 z-30 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

          {/* Year tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((year) => {
              const count =
                year === "All"
                  ? allEvents.length
                  : (eventsByYear[year]?.length ?? 0);
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-250 border ${isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-transparent border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                >
                  {year}
                  <span className={`ml-1.5 text-xs ${isActive ? "opacity-70" : "opacity-50"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search events…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-full bg-muted/50 border border-border/50 focus:outline-none focus:border-primary/60 focus:bg-muted/80 transition-all placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
