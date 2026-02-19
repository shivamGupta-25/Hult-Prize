"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  Presentation,
  Target,
  Award,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  X,
  Trophy,
} from "lucide-react";

// PanelSection
function PanelSection({ icon, title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">{title}</h3>
        <div className="flex-1 h-px bg-border/50" />
      </div>
      {children}
    </div>
  );
}

// SessionCard
function SessionCard({ session }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-2">
      <div>
        <p className="font-semibold text-sm text-foreground">{session.title}</p>
        {session.speaker && (
          <p className="text-xs text-primary/70 font-medium">by {session.speaker}</p>
        )}
      </div>
      {session.image && !imageError && (
        <div className="relative overflow-hidden rounded-lg bg-muted/20" style={{ minHeight: 120 }}>
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${session.image})`, filter: "blur(14px)", opacity: 0.3 }}
          />
          <div className="relative flex items-center justify-center p-2">
            <img
              src={session.image}
              alt={session.title}
              className="max-w-full max-h-40 object-contain rounded-md shadow-md"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        </div>
      )}
      {session.focus?.length > 0 && (
        <ul className="space-y-1">
          {session.focus.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// DayCard
function DayCard({ day }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50">
        <p className="font-bold text-sm text-foreground">{day.day}</p>
        {day.theme && <p className="text-xs text-primary/70 font-medium mt-0.5">{day.theme}</p>}
      </div>
      {day.image && !imageError && (
        <div className="relative overflow-hidden bg-muted/20" style={{ minHeight: 180 }}>
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${day.image})`, filter: "blur(16px)", opacity: 0.3 }}
          />
          <div className="relative flex items-center justify-center p-3">
            <img
              src={day.image}
              alt={day.day}
              className="max-w-full max-h-56 object-contain rounded-lg shadow-md"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        </div>
      )}
      {day.sessions?.length > 0 && (
        <div className="p-3 space-y-2.5">
          {day.sessions.map((s, i) => (
            <SessionCard key={i} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}

// ScheduleContent
function ScheduleContent({ agenda }) {
  return (
    <div className="space-y-4">
      {agenda.map((day, i) => (
        <DayCard key={i} day={day} />
      ))}
    </div>
  );
}

// CategoriesContent
function CategoriesContent({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {categories.map((cat, i) => (
        <div
          key={i}
          className="p-3 rounded-xl bg-muted/40 border border-border/40 flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-black text-xs">{cat.count}</span>
          </div>
          <p className="text-xs font-medium text-foreground leading-tight">{cat.title}</p>
        </div>
      ))}
    </div>
  );
}

// SubEventCard
function SubEventCard({ subEvent }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border/50 flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-sm text-foreground">{subEvent.name}</p>
          {subEvent.tagline && (
            <p className="text-xs text-primary/70 font-medium mt-0.5">{subEvent.tagline}</p>
          )}
        </div>
        {subEvent.prizes && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 shrink-0">
            <Trophy className="h-3 w-3" />
            {subEvent.prizes}
          </span>
        )}
      </div>

      {subEvent.image && !imageError && (
        <div className="relative overflow-hidden bg-muted/20" style={{ minHeight: 180 }}>
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${subEvent.image})`, filter: "blur(16px)", opacity: 0.3 }}
          />
          <div className="relative flex items-center justify-center p-4">
            <img
              src={subEvent.image}
              alt={subEvent.name}
              className="max-w-full max-h-56 object-contain rounded-lg shadow-lg"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        </div>
      )}

      {(subEvent.description || subEvent.phases) && (
        <div className="p-4 space-y-3">
          {subEvent.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{subEvent.description}</p>
          )}
          {subEvent.phases && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Phases
              </p>
              {subEvent.phases.map((phase, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/40 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground">{phase.name}</p>
                    {phase.mode && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium border border-border/50">
                        {phase.mode}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {phase.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {phase.date}
                      </div>
                    )}
                    {phase.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {phase.venue}
                      </div>
                    )}
                    {phase.format && (
                      <p>
                        <span className="font-medium text-foreground">Format:</span> {phase.format}
                      </p>
                    )}
                    {phase.outcome && (
                      <p>
                        <span className="font-medium text-foreground">Outcome:</span> {phase.outcome}
                      </p>
                    )}
                    {phase.evaluation?.length > 0 && (
                      <div>
                        <p className="font-medium text-foreground mb-1">Evaluation:</p>
                        <ul className="space-y-0.5 pl-2">
                          {phase.evaluation.map((item, j) => (
                            <li key={j} className="flex items-start gap-1.5">
                              <span className="text-primary mt-0.5 shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// CompetitionsContent
function CompetitionsContent({ subEvents }) {
  return (
    <div className="space-y-4">
      {subEvents.map((sub, i) => (
        <SubEventCard key={sub.id || i} subEvent={sub} />
      ))}
    </div>
  );
}

// EventDetailPanel (default export)

export default function EventDetailPanel({
  event,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  total,
}) {
  const { header, about, logistics, stats, content, image } = event;
  const [imageError, setImageError] = useState(false);
  const scrollRef = useRef(null);
  const touchStartX = useRef(null);

  // Reset scroll and image error when the event changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setImageError(false);
  }, [event.id]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) >= 50) {
        if (delta > 0 && onNext) onNext(); // swipe left → next
        if (delta < 0 && onPrev) onPrev(); // swipe right → prev
      }
      touchStartX.current = null;
    },
    [onNext, onPrev]
  );

  return (
    <div
      className="flex flex-col h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 shrink-0 bg-background/95 backdrop-blur-sm">
        {/* Prev / counter / Next */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            aria-label="Previous event"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums px-0.5">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={onNext}
            disabled={!onNext}
            aria-label="Next event"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Keyboard hint (desktop only) */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/50">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">→</kbd>
          to navigate
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Hero image */}
        {image && !imageError ? (
          <div className="relative w-full h-52 md:h-64 shrink-0 overflow-hidden bg-muted/50">
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{ backgroundImage: `url(${image})`, filter: "blur(22px)", opacity: 0.35 }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={image}
                alt={header.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
          </div>
        ) : (
          <div className="h-24 bg-linear-to-br from-primary/15 to-primary/5 shrink-0" />
        )}

        {/* Content */}
        <div className="px-6 pb-12 pt-5 space-y-8">
          {/* Title block */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {header.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                  {header.badge}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/50">
                {header.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black italic border border-border/50">
                {header.year}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
              {header.title}
            </h2>
            {header.subtitle && (
              <p className="text-base text-muted-foreground mt-1">{header.subtitle}</p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              {about.description}
            </p>
          </div>

          {/* Logistics */}
          <PanelSection icon={<MapPin className="h-4 w-4" />} title="Logistics">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: <Presentation className="h-3.5 w-3.5" />, label: "Mode", value: logistics.mode },
                { icon: <MapPin className="h-3.5 w-3.5" />, label: "Venue", value: logistics.venue },
                { icon: <Calendar className="h-3.5 w-3.5" />, label: "Dates", value: logistics.dates },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Duration", value: logistics.duration },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-muted/40 border border-border/40">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      {item.icon}
                      <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">{item.value}</p>
                  </div>
                ))}
            </div>
          </PanelSection>

          {/* Vision & Mission */}
          {(about.vision || about.mission?.length > 0) && (
            <PanelSection icon={<Target className="h-4 w-4" />} title="Vision & Mission">
              {about.vision && (
                <blockquote className="border-l-2 border-primary pl-4 py-1 mb-4">
                  <p className="text-sm text-foreground italic leading-relaxed">{about.vision}</p>
                </blockquote>
              )}
              {about.mission?.length > 0 && (
                <ul className="space-y-2.5">
                  {about.mission.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </PanelSection>
          )}

          {/* Highlights / Stats */}
          {stats && Object.entries(stats).some(([, v]) => typeof v !== "object") && (
            <PanelSection icon={<Award className="h-4 w-4" />} title="Highlights">
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(stats)
                  .filter(([, v]) => typeof v !== "object")
                  .map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-muted/40 border border-border/40">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-sm font-bold text-foreground">{value}</p>
                    </div>
                  ))}
              </div>
            </PanelSection>
          )}

          {/* Rich content */}
          {content && (
            <PanelSection icon={<Briefcase className="h-4 w-4" />} title="Event Details">
              {content.details && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{content.details}</p>
              )}
              {content.categories && <CategoriesContent categories={content.categories} />}
              {content.type === "schedule" && content.agenda && (
                <ScheduleContent agenda={content.agenda} />
              )}
              {content.type === "competitions" && content.subEvents && (
                <CompetitionsContent subEvents={content.subEvents} />
              )}
            </PanelSection>
          )}
        </div>
      </div>
    </div>
  );
}
