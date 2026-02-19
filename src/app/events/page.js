"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  eventsByYear,
  getAllEvents,
  getYears,
  TOTAL_PARTICIPANTS,
} from "@/Data/EventData";

import HeroSection from "./components/EventHeroSection";
import EventsControls from "./components/EventsControls";
import YearSection from "./components/YearSection";
import EventDetailPanel from "./components/EventDetailPanel";

// Derived constants (computed once at module load)
const allEvents = getAllEvents();
const years = getYears();

// Main Page
export default function EventsPage() {
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerEvent, setDrawerEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const contentRef = useRef(null);

  // Scroll helper
  const scrollToContent = useCallback(() => {
    if (!contentRef.current) return;
    const offset =
      contentRef.current.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, []);

  // Filtering
  const baseFiltered =
    selectedYear === "All"
      ? allEvents
      : allEvents.filter((e) => e.year === selectedYear);

  const filteredEvents = searchQuery.trim()
    ? baseFiltered.filter((e) =>
      [e.header.title, e.header.type, e.about.description, e.header.badge]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : baseFiltered;

  // Drawer helpers
  const openDrawer = useCallback(
    (event) => {
      const idx = filteredEvents.findIndex((e) => e.id === event.id);
      setDrawerIndex(idx >= 0 ? idx : 0);
      setDrawerEvent(event);
      setDrawerOpen(true);
    },
    [filteredEvents]
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setDrawerEvent(null), 350);
  }, []);

  const navigateDrawer = useCallback(
    (dir) => {
      const next = drawerIndex + dir;
      if (next < 0 || next >= filteredEvents.length) return;
      setDrawerIndex(next);
      setDrawerEvent(filteredEvents[next]);
    },
    [drawerIndex, filteredEvents]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") navigateDrawer(-1);
      if (e.key === "ArrowRight") navigateDrawer(1);
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen, navigateDrawer, closeDrawer]);

  // Grouped view for "All" tab
  // Array (not object) to guarantee newest-first ordering.
  const groupedByYear = years
    .map((year) => ({ year, events: filteredEvents.filter((e) => e.year === year) }))
    .filter(({ events }) => events.length > 0);

  // Year tab handler
  const handleYearChange = useCallback(
    (year) => {
      setSelectedYear(year);
      setSearchQuery("");
      scrollToContent();
    },
    [scrollToContent]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    scrollToContent();
  }, [scrollToContent]);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <HeroSection
        totalEvents={allEvents.length}
        totalYears={years.length}
        totalParticipants={TOTAL_PARTICIPANTS}
      />

      {/* Sticky controls */}
      <EventsControls
        years={years}
        allEvents={allEvents}
        eventsByYear={eventsByYear}
        selectedYear={selectedYear}
        searchQuery={searchQuery}
        onYearChange={handleYearChange}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
      />

      {/* Events content */}
      <main ref={contentRef} className="container mx-auto px-4 md:px-8 max-w-6xl py-10 pb-24">

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Filter className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try a different search term or year filter.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedYear("All"); }}
              className="text-sm text-primary hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* All years grouped */}
        {filteredEvents.length > 0 && selectedYear === "All" && (
          <div className="space-y-16">
            {groupedByYear.map(({ year, events }) => (
              <YearSection key={year} year={year} events={events} onSelect={openDrawer} />
            ))}
          </div>
        )}

        {/* Single year */}
        {filteredEvents.length > 0 && selectedYear !== "All" && (
          <YearSection
            year={selectedYear}
            events={filteredEvents}
            onSelect={openDrawer}
            hideYearLabel={!!searchQuery}
          />
        )}

        {/* Search result count */}
        {searchQuery && filteredEvents.length > 0 && (
          <p className="text-xs text-muted-foreground mt-8">
            {filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </main>

      {/* Event detail drawer */}
      <Sheet open={drawerOpen} onOpenChange={closeDrawer}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 overflow-hidden border-l border-border/40 flex flex-col"
          hideCloseButton
        >
          <div className="sr-only">
            <SheetTitle>{drawerEvent?.header?.title ?? "Event Details"}</SheetTitle>
            <SheetDescription>{drawerEvent?.about?.description ?? ""}</SheetDescription>
          </div>
          {drawerEvent && (
            <EventDetailPanel
              event={drawerEvent}
              onClose={closeDrawer}
              onPrev={drawerIndex > 0 ? () => navigateDrawer(-1) : null}
              onNext={drawerIndex < filteredEvents.length - 1 ? () => navigateDrawer(1) : null}
              currentIndex={drawerIndex}
              total={filteredEvents.length}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
