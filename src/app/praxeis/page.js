"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import magazineData from "@/Data/MagazineData";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, BookOpen, ExternalLink, Calendar, Users, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PraxeisPage() {
  const { hero, editions } = magazineData;
  const latestEdition = editions.find((edition) => edition.isCurrent) || editions[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Section */}
      <section className="w-full pt-8 pb-12 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24 overflow-hidden bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {hero.organization}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 text-foreground">
                  {hero.title}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-primary font-medium mb-6">
                  {hero.tagline}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {hero.description}
                </p>
              </motion.div>
            </div>

            {/* 3D Flip Card - Hero Interaction */}
            <div className="flex-1 flex justify-center perspective-1000 z-10 w-full max-w-md lg:max-w-xl">
              <FlipCard edition={latestEdition} />
            </div>
          </div>
        </div>
      </section>

      {/* Editions Grid Section */}
      <section className="container mx-auto px-4 md:px-8 mt-16">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">All Editions</h2>
          <div className="h-1 w-20 bg-primary rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Explore our archive of past editions, featuring comprehensive insights into social entrepreneurship and sustainable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {editions.map((edition, index) => (
            <EditionCard key={edition.id} edition={edition} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FlipCard({ edition }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInteraction = () => {
    if (isMobile) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="relative w-72 h-112.5 cursor-pointer group"
      style={{ perspective: "1500px" }}
      onMouseEnter={() => !isMobile && setIsFlipped(true)}
      onMouseLeave={() => !isMobile && setIsFlipped(false)}
      onClick={handleInteraction}
    >
      <motion.div
        className="w-full h-full relative transition-all duration-700 ease-in-out"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: isFlipped ? -15 : 0,
          rotateZ: isFlipped ? 2 : 0
        }}
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
      >
        {/* Book Cover */}
        <div className="absolute inset-0 w-full h-full rounded-r-lg rounded-l-sm shadow-2xl overflow-hidden bg-card">
          {/* Book Spine visual trick */}
          <div className="absolute left-0 top-0 bottom-0 w-2 lg:w-3 bg-linear-to-r from-gray-800 to-gray-600 z-20 opacity-80" />
          <div className="absolute inset-0 pl-1 h-full w-full">
            <Image
              src={edition.assets.coverImage}
              alt={edition.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info Card Pop-out (simulating inside or back) */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{
            opacity: isFlipped ? 1 : 0,
            x: isFlipped ? (isMobile ? 50 : 180) : 0,
            rotateY: isFlipped ? (isMobile ? 0 : 5) : 0,
            zIndex: isMobile && isFlipped ? 20 : -10
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute top-8 left-0 w-64 h-100 bg-card rounded-xl shadow-2xl -z-10 flex flex-col items-center justify-between p-6 border border-border"
        >
          <div className="text-center w-full">
            <h3 className="text-xl font-bold text-foreground mb-2">{edition.title}</h3>
            <div className="w-12 h-1 bg-primary mx-auto mb-4 rounded-full" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {edition.volume}
            </p>
            <p className="text-sm text-foreground/80 font-medium line-clamp-4 leading-relaxed">
              {edition.theme}
            </p>
          </div>

          <div className="w-full space-y-3">
            <Link
              href={edition.assets.downloadLink}
              target="_blank"
              download
              className="flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ArrowDownToLine size={16} /> Download PDF
            </Link>
            <Link
              href={edition.assets.downloadLink}
              target="_blank"
              className="flex w-full items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-semibold py-2.5 rounded-lg transition-colors border border-border"
            >
              Read Online
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Helper Text */}
      <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-primary text-sm font-medium animate-pulse pointer-events-none">
        {isMobile ? "Tap to view details" : "Hover to preview details"}
      </div>
    </div>
  );
}

function EditionCard({ edition, index }) {
  return (
    <div
      className="group flex flex-col h-full bg-card rounded-xl border border-border hover:border-primary/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-72 w-full overflow-hidden bg-muted">
        <Image
          src={edition.assets.coverImage}
          alt={edition.title}
          fill
          className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Link
            href={edition.assets.downloadLink}
            target="_blank"
            download
            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110"
            title="Download PDF"
          >
            <ArrowDownToLine size={24} />
          </Link>
          <Link
            href={edition.assets.downloadLink}
            target="_blank"
            className="p-3 bg-primary hover:bg-primary/90 rounded-full text-white transition-all transform hover:scale-110 shadow-lg"
            title="Read Online"
          >
            <BookOpen size={24} />
          </Link>
        </div>

        {edition.isCurrent && (
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs italic font-bold px-3 py-1 rounded-full shadow-lg">
            LATEST
          </div>
        )}
      </div>

      <div className="flex flex-col grow p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{edition.title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
            <Calendar size={12} />
            <span>{edition.year}</span>
            <span>•</span>
            <span>{edition.volume}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 grow leading-relaxed">
          {edition.theme}
        </p>

        <div className="pt-4 border-t border-border mt-auto">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase">
              <Users size={12} /> Editors
            </div>
            <div className="text-xs font-medium truncate">
              {edition.people.editors.map(e => e.name).join(", ")}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button
                className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium py-2 rounded-md transition-colors"
              >
                <Info size={16} /> View Details
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-serif">{edition.title}</DialogTitle>
                <DialogDescription>
                  {edition.volume} | {edition.year}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex flex-col sm:block relative sm:h-48 w-full rounded-lg overflow-hidden shrink-0">
                  <div className="relative h-48 w-full sm:absolute sm:inset-0">
                    <div className="absolute inset-0 bg-primary/10" />
                    <Image
                      src={edition.assets.coverImage}
                      alt={edition.title}
                      fill
                      className="object-contain object-center sm:object-left"
                    />
                    <div className="absolute inset-0 bg-linear-to-b sm:bg-linear-to-r from-transparent via-background/50 to-background pointer-events-none" />
                  </div>
                  <div className="relative z-10 p-4 text-center sm:text-left sm:absolute sm:right-0 sm:top-0 sm:bottom-0 sm:w-2/3 sm:p-6 sm:flex sm:flex-col sm:justify-center">
                    <h4 className="font-semibold mb-2">Theme</h4>
                    <p className="text-sm text-foreground/80 italic">&quot;{edition.theme}&quot;</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-primary">About this Edition</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {edition.about.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-primary">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {edition.about.focusAreas.map(area => (
                      <span key={area} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-primary">Editors</h4>
                    <ul className="space-y-1">
                      {edition.people.editors.map((editor, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className="font-medium">{editor.name}</span>
                          <span className="text-muted-foreground text-xs">({editor.role})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-primary">Contributors</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-break-spaces text-justify">
                      {edition.people.contributors.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-border">
                  <Link
                    href={edition.assets.downloadLink}
                    target="_blank"
                    download
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    <ArrowDownToLine size={18} /> Download PDF
                  </Link>
                  <Link
                    href={edition.assets.downloadLink}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-secondary py-2.5 rounded-lg transition-colors font-medium"
                  >
                    <BookOpen size={18} /> Read Online
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
