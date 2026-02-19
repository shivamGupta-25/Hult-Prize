"use client";

import { useState } from "react";
import { MapPin, Presentation, ArrowRight, Zap } from "lucide-react";
import { useInView } from "../hooks/useInView";

export default function EventCard({ event, index, onSelect }) {
  const { header, about, logistics, image } = event;
  const [imageError, setImageError] = useState(false);
  const [ref, inView] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${header.title}`}
      onClick={() => onSelect(event)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(event)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: `opacity 0.45s ease ${index * 70}ms, transform 0.45s ease ${index * 70}ms`,
        boxShadow: hovered
          ? "0 20px 60px -10px rgba(0,0,0,0.3), 0 0 0 1px var(--color-primary)"
          : "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Image area */}
      <div className="relative w-full h-56 overflow-hidden bg-muted/60">
        {image && !imageError ? (
          <>
            {/* Blurred background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
              style={{
                backgroundImage: `url(${image})`,
                filter: "blur(18px)",
                opacity: 0.3,
                transform: hovered ? "scale(1.15)" : "scale(1.08)",
              }}
            />
            {/* Sharp foreground image */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <img
                src={image}
                alt={header.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-500"
                style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-primary/8 to-transparent flex items-center justify-center">
            <Zap className="h-10 w-10 text-primary/30" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-background/75 backdrop-blur-sm text-xs font-bold text-foreground shadow-sm">
            {header.year}
          </span>
          {header.badge && (
            <span className="px-2.5 py-1 rounded-full bg-primary/85 backdrop-blur-sm text-xs font-bold text-primary-foreground shadow-sm">
              {header.badge}
            </span>
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-card to-transparent" />
      </div>

      {/* Card body */}
      <div className="bg-card px-5 pt-4 pb-5 space-y-3">
        <div>
          <h3
            className="text-base font-bold text-foreground leading-snug transition-colors duration-200"
            style={{ color: hovered ? "var(--color-primary)" : undefined }}
          >
            {header.title}
          </h3>
          <p className="text-[11px] text-primary/60 font-semibold uppercase tracking-wider mt-0.5">
            {header.type}
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {about.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {logistics.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-primary/50" />
              <span className="truncate max-w-[130px]">{logistics.venue}</span>
            </span>
          )}
          {logistics.mode && (
            <span className="flex items-center gap-1.5">
              <Presentation className="h-3 w-3 shrink-0 text-primary/50" />
              {logistics.mode}
            </span>
          )}
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60">{logistics.dates}</span>
          <span
            className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
            style={{ color: hovered ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
          >
            View Story
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300"
              style={{ transform: hovered ? "translateX(3px)" : "translateX(0)" }}
            />
          </span>
        </div>
      </div>
    </article>
  );
}
