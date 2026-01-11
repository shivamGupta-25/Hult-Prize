"use client";

import React, { useState, useEffect } from "react";
import { eventsByYear } from "@/Data/EventData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, Users, Trophy, Target, ExternalLink, Award, Presentation, Briefcase, Sparkles } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function EventsPage() {
  const years = Object.keys(eventsByYear).sort((a, b) => b.localeCompare(a));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const allEvents = years.flatMap(year =>
    eventsByYear[year].map(event => ({ ...event, year }))
  );

  const filteredEvents = selectedYear === "All"
    ? allEvents
    : allEvents.filter(event => event.year === selectedYear);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <section className="w-full pt-8 pb-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 overflow-hidden bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-lg italic font-medium mb-4">
              Our Events
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-foreground">
              <span className="text-white">Past &</span>{" "}
              <span className="text-primary">Upcoming</span>{" "}
              <span className="text-white">Events</span>
            </h1>
            <Separator className="w-20 mx-auto bg-primary/30 mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our journey through impactful events, workshops, and
              competitions that have shaped our community.
            </p>
          </div>
        </div>
      </section>

      {/* Year Filter Section */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-primary animate-[spin_2s_ease-in-out_1_normal_forwards]" />
            <h2 className="text-2xl font-bold text-foreground">Browse Editions</h2>
          </div>

          <ToggleGroup
            type="single"
            value={selectedYear}
            onValueChange={(value) => {
              if (value) setSelectedYear(value);
            }}
            className="flex flex-wrap gap-3 mb-8"
            variant="outline"
            size="lg"
            spacing={3}
          >
            <ToggleGroupItem
              value="All"
              aria-label="All Years"
              className="px-6 py-3 bg-card hover:bg-muted/80 border border-border/50 hover:border-primary/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-md data-[state=on]:border-primary transition-all duration-300"
            >
              <span className="text-base font-semibold">All Years</span>
              <Badge
                variant="secondary"
                className={`ml-2 ${selectedYear === "All"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                {allEvents.length}
              </Badge>
            </ToggleGroupItem>

            {years.map((year) => {
              const eventCount = eventsByYear[year].length;
              const isSelected = selectedYear === year;
              return (
                <ToggleGroupItem
                  key={year}
                  value={year}
                  aria-label={`Filter by ${year}`}
                  className="px-6 py-3 bg-card hover:bg-muted/80 border border-border/50 hover:border-primary/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-md data-[state=on]:border-primary transition-all duration-300"
                >
                  <span className="text-base font-semibold">{year}</span>
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted"
                      }`}
                  >
                    {eventCount}
                  </Badge>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        {/* Events Grid with Grouping */}
        <div className="space-y-12">
          {selectedYear === "All" ? (
            // Show all events grouped by year
            years.map((year) => {
              const yearEvents = filteredEvents.filter(e => e.year === year);
              if (yearEvents.length === 0) return null;

              return (
                <div key={year} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 sticky top-4 z-10 bg-background/80 backdrop-blur-sm py-4 border-b border-border">
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        {year}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {yearEvents.length} Event{yearEvents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {yearEvents.map((event, eventIndex) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={eventIndex}
                        onSelect={() => setSelectedEvent(event)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show filtered events for selected year
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-12 bg-primary rounded-full" />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {selectedYear}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, eventIndex) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={eventIndex}
                    onSelect={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function EventCard({ event, index, onSelect }) {
  const { header, about, logistics, stats, image } = event;
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div>
      <Card className="h-full hover:shadow-xl transition-all duration-500 cursor-pointer group overflow-hidden border-border/50 hover:border-primary/30 relative pt-0">
        {/* Poster Image */}
        <div className="relative w-full overflow-hidden" style={{ minHeight: '200px', maxHeight: '300px' }}>
          {image && !imageError ? (
            <>
              {/* Blurred Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${image})`,
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)',
                  opacity: 0.4
                }}
              />
              {/* Actual Image */}
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={image}
                  alt={header.title}
                  className="max-w-full max-h-full object-contain rounded-sm shadow-lg"
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/10 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {header.title}
                  </h3>
                  {header.subtitle && (
                    <p className="text-sm text-muted-foreground">
                      {header.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <CardHeader className="px-5 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg leading-tight">
              {header.title}
            </CardTitle>
            {header.badge && (
              <Badge
                variant="outline"
                className="shrink-0 bg-primary/10 border-primary/30 text-primary text-xs"
              >
                {header.badge}
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {about.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pt-0 pb-5 space-y-4">
          {/* Logistics Info */}
          <div className="space-y-2 text-xs text-muted-foreground">
            {logistics.mode && (
              <div className="flex items-center gap-2">
                <Presentation className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{logistics.mode}</span>
              </div>
            )}
            {logistics.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{logistics.venue}</span>
              </div>
            )}
            {logistics.dates && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{logistics.dates}</span>
              </div>
            )}
          </div>

          {/* Stats Preview */}
          {stats && (
            <div className="pt-3 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {stats.participants && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{stats.participants}</span>
                  </div>
                )}
                {stats.registrations && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{stats.registrations}</span>
                  </div>
                )}
                {stats.prizes && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    <span>{stats.prizes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View Details Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full group-hover:text-primary h-8 text-xs font-semibold"
            onClick={onSelect}
          >
            View Details
            <ExternalLink className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EventDetailDialog({ event, open, onClose }) {
  const { header, about, logistics, stats, content, image } = event;
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2">
                {header.title}
              </DialogTitle>
              {header.subtitle && (
                <p className="text-lg text-muted-foreground mb-2">
                  {header.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {header.badge && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 border-primary/30 text-primary"
                  >
                    {header.badge}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {header.type}
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-base text-muted-foreground mt-4">
            {about.description}
          </p>
        </DialogHeader>

        {/* Event Poster Image */}
        {image && !imageError && (
          <div className="w-full my-6 rounded-xl overflow-hidden relative bg-muted/20">
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${image})`,
                filter: 'blur(20px)',
                transform: 'scale(1.1)',
                opacity: 0.4
              }}
            />
            {/* Actual Image */}
            <div className="relative w-full flex items-center justify-center p-4" style={{ minHeight: '300px' }}>
              <img
                src={image}
                alt={header.title}
                className="w-auto h-auto max-w-full max-h-125 object-contain rounded-sm shadow-lg"
                onError={() => setImageError(true)}
                loading="lazy"
                style={{ aspectRatio: 'auto' }}
              />
            </div>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              Vision & Mission
            </h3>
            <div className="space-y-4 pl-7">
              {about.vision && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-foreground">
                    Vision
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {about.vision}
                  </p>
                </div>
              )}
              {about.mission && about.mission.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">
                    Mission
                  </h4>
                  <ul className="space-y-2">
                    {about.mission.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-primary mt-1.5 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Logistics Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Logistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              {logistics.mode && (
                <div className="flex items-start gap-2">
                  <Presentation className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Mode
                    </p>
                    <p className="text-sm text-foreground">{logistics.mode}</p>
                  </div>
                </div>
              )}
              {logistics.venue && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Venue
                    </p>
                    <p className="text-sm text-foreground">{logistics.venue}</p>
                  </div>
                </div>
              )}
              {logistics.dates && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Dates
                    </p>
                    <p className="text-sm text-foreground">{logistics.dates}</p>
                  </div>
                </div>
              )}
              {logistics.duration && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Duration
                    </p>
                    <p className="text-sm text-foreground">
                      {logistics.duration}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Stats Section */}
          {stats && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  Statistics & Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  {Object.entries(stats).map(([key, value]) => {
                    if (typeof value === "object") return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Content Section */}
          {content && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-primary">
                  <Briefcase className="h-5 w-5" />
                  Event Details
                </h3>
                <div className="pl-7">
                  {content.type === "schedule" && content.agenda && (
                    <ScheduleContent agenda={content.agenda} />
                  )}
                  {content.type === "schedule" && content.categories && (
                    <CategoriesContent categories={content.categories} />
                  )}
                  {content.type === "competitions" && (
                    <CompetitionsContent subEvents={content.subEvents} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SessionCard({ session, sessionIdx }) {
  const [sessionImageError, setSessionImageError] = useState(false);

  return (
    <div
      key={sessionIdx}
      className="p-4 rounded-lg bg-muted/30 border border-border/50"
    >
      <h4 className="font-semibold text-foreground mb-1">
        {session.title}
      </h4>
      {session.speaker && (
        <p className="text-sm text-muted-foreground mb-2">
          Speaker: {session.speaker}
        </p>
      )}
      {session.image && !sessionImageError && (
        <div className="w-full my-3 rounded-xl overflow-hidden relative bg-muted/20">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${session.image})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
              opacity: 0.4
            }}
          />
          {/* Actual Image */}
          <div className="relative w-full flex items-center justify-center p-3" style={{ minHeight: '180px' }}>
            <img
              src={session.image}
              alt={session.title}
              className="w-auto h-auto max-w-full max-h-70 object-contain rounded-lg shadow-lg"
              onError={() => setSessionImageError(true)}
              loading="lazy"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      )}
      {session.focus && session.focus.length > 0 && (
        <ul className="space-y-1 mt-2">
          {session.focus.map((item, focusIdx) => (
            <li
              key={focusIdx}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <span className="text-primary mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DayCard({ day, idx }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">{day.day}</CardTitle>
        {day.theme && (
          <CardDescription className="text-base font-medium">
            {day.theme}
          </CardDescription>
        )}
      </CardHeader>
      {day.image && !imageError && (
        <div className="w-auto m-2 px-6 pb-4 rounded-sm overflow-hidden relative bg-muted/20">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${day.image})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
              opacity: 0.4
            }}
          />
          {/* Actual Image */}
          <div className="relative w-full flex items-center justify-center p-4" style={{ minHeight: '250px' }}>
            <img
              src={day.image}
              alt={`${day.day} - ${day.theme || ''}`}
              className="w-auto h-auto max-w-full max-h-87.5 object-contain rounded-lg shadow-lg"
              onError={() => setImageError(true)}
              loading="lazy"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      )}
      <CardContent className="space-y-4">
        {day.sessions?.map((session, sessionIdx) => (
          <SessionCard key={sessionIdx} session={session} sessionIdx={sessionIdx} />
        ))}
      </CardContent>
    </Card>
  );
}

function ScheduleContent({ agenda, eventId }) {
  return (
    <div className="space-y-6">
      {agenda.map((day, idx) => (
        <DayCard key={idx} day={day} idx={idx} />
      ))}
    </div>
  );
}

function CategoriesContent({ categories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {categories.map((category, idx) => (
        <Card key={idx} className="border-border/50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground mb-1">
              {category.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {category.count} Speaker{category.count !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SubEventCard({ subEvent, idx }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card key={subEvent.id || idx} className="border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{subEvent.name}</CardTitle>
            {subEvent.tagline && (
              <CardDescription className="text-base font-medium mt-1">
                {subEvent.tagline}
              </CardDescription>
            )}
          </div>
          {subEvent.prizes && (
            <Badge
              variant="outline"
              className="bg-primary/10 border-primary/30 text-primary shrink-0"
            >
              <Trophy className="h-3 w-3 mr-1" />
              {subEvent.prizes}
            </Badge>
          )}
        </div>
      </CardHeader>
      {subEvent.image && !imageError && (
        <div className="w-auto m-2 px-6 pb-4 rounded-sm overflow-hidden relative bg-muted/20">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${subEvent.image})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
              opacity: 0.4
            }}
          />
          {/* Actual Image */}
          <div className="relative w-full flex items-center justify-center p-4" style={{ minHeight: '250px' }}>
            <img
              src={subEvent.image}
              alt={subEvent.name}
              className="w-auto h-auto max-w-full max-h-87.5 object-contain rounded-sm shadow-lg"
              onError={() => setImageError(true)}
              loading="lazy"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      )}
      {subEvent.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {subEvent.description}
          </p>
        </CardContent>
      )}
      {subEvent.phases && (
        <CardContent className="pt-0">
          <div className="space-y-3 mt-4">
            <h5 className="text-sm font-semibold text-foreground">
              Competition Phases
            </h5>
            {subEvent.phases.map((phase, phaseIdx) => (
              <div
                key={phaseIdx}
                className="p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h6 className="font-semibold text-sm text-foreground">
                    {phase.name}
                  </h6>
                  {phase.mode && (
                    <Badge variant="outline" className="text-xs">
                      {phase.mode}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {phase.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      <span>{phase.date}</span>
                    </div>
                  )}
                  {phase.venue && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      <span>{phase.venue}</span>
                    </div>
                  )}
                  {phase.format && (
                    <p>
                      <span className="font-medium">Format:</span>{" "}
                      {phase.format}
                    </p>
                  )}
                  {phase.outcome && (
                    <p>
                      <span className="font-medium">Outcome:</span>{" "}
                      {phase.outcome}
                    </p>
                  )}
                  {phase.evaluation && phase.evaluation.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Evaluation:</p>
                      <ul className="space-y-0.5 pl-3">
                        {phase.evaluation.map((item, evalIdx) => (
                          <li key={evalIdx} className="flex items-start gap-1">
                            <span className="text-primary mt-0.5 shrink-0">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function CompetitionsContent({ subEvents }) {
  return (
    <div className="space-y-4">
      {subEvents.map((subEvent, idx) => (
        <SubEventCard key={subEvent.id || idx} subEvent={subEvent} idx={idx} />
      ))}
    </div>
  );
}
