"use client";

import { AnimatedCounter } from "../hooks/useInView";

/* HeroSection — full-width hero with animated stats grid. */

export default function HeroSection({ totalEvents, totalYears, totalParticipants }) {
  const stats = [
    { label: "Events", value: totalEvents, suffix: "+" },
    { label: "Years Active", value: totalYears, suffix: "" },
    { label: "Participants", value: totalParticipants, suffix: "+" },
  ];

  return (
    <section className="relative w-full pt-10 pb-14 sm:pt-12 sm:pb-16 md:pt-4 md:pb-12 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient orbs */}
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-8 max-w-6xl text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8 max-w-[90vw]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="text-primary text-[10px] sm:text-xs font-bold capitalize tracking-widest leading-tight">
            Hult Prize @ Hansraj College
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-4 sm:mb-6">
          <span className="block text-foreground">Chronicle</span>
          <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent pb-2">
            of Impact
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
          Workshops, conclaves, and speaker sessions that have shaped a
          generation of changemakers at Hansraj College.
        </p>

        {/* Stats grid */}
        <div className="w-full sm:w-auto sm:inline-grid grid grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-4 sm:px-8 py-4 sm:py-5 text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tabular-nums">
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
