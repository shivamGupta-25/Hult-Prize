'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const teamImages = [
    '/Team/Team1.png',
    '/Team/Team2.png',
  ];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, teamImages.length]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Slides */}
      {teamImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentSlide === index ? 'opacity-50 lg:opacity-30 scale-100' : 'opacity-0 scale-105'
            }`}
        >
          <Image
            src={image}
            alt={`Team ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            quality={90}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/40 via-rose-900/30 to-orange-900/40" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-6 max-w-6xl">
          {/* Main Heading with Gradient */}
          <h1 className="relative inline-block mb-6">
            <span className="block text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-purple-200 to-rose-200 mb-2 tracking-tighter leading-none animate-fade-in">
              Hult Prize
            </span>
            {/* Glow Effect */}
            <div
              className="absolute inset-0 blur-2xl opacity-50 bg-linear-to-r from-purple-500 via-rose-500 to-orange-500"
              style={{ zIndex: -1 }}
            />
          </h1>

          {/* Divider with Animation */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            <div className="h-px w-12 bg-linear-to-l from-transparent to-white/40" />
          </div>

          {/* Subtitle */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/95 tracking-wide mb-8 animate-fade-in">
            Hansraj
          </h2>

          {/* Tagline */}
          <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto animate-fade-in italic">
            &ldquo;Empowering student entrepreneurs to solve the world&apos;s toughest challenges.&rdquo;
          </p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 sm:bottom-20 md:bottom-24 lg:bottom-28 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {teamImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${currentSlide === index
                ? 'w-6 h-1.5 sm:w-7 sm:h-2 md:w-8 md:h-2 bg-white'
                : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Blur the bottom of the section - responsive gradient fade */}
      <div className="pointer-events-none absolute -bottom-1 sm:bottom-0 md:-bottom-8 left-0 w-full h-12 sm:h-20 md:h-24 lg:h-22 z-30">
        {/* Blur layer */}
        <div className="absolute inset-0 backdrop-blur-sm" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/95 to-transparent" />
      </div>
    </div>
  );
}