'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Quote, Globe, Users, Target } from 'lucide-react';
import { aboutData } from '@/Data/SiteData';

const IconFeature = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
    <div className="p-2.5 sm:p-3 rounded-full bg-primary/10 border-2 border-primary/20">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
    </div>
    <span className="text-[10px] xs:text-xs md:text-sm font-medium text-muted-foreground text-center">
      {label}
    </span>
  </div>
);

const VerticalDivider = () => (
  <div className="h-10 sm:h-12 w-px bg-primary/20" />
);

export const About = () => {
  const { aboutContent, flagshipEvent } = aboutData;

  return (
    <section className="w-full py-4 px-4 sm:py-12 md:py-12 lg:py-8 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <header className="text-center space-y-3 sm:space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
            About Us
          </h2>
          <Separator className="w-20 sm:w-24 mx-auto bg-primary/30" />
        </header>

        {/* Main Content */}
        <div className="relative text-justify">
          <div className="relative z-10">
            {/* Icon Features */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-12 mb-6 sm:mb-8 md:mb-12">
              <IconFeature icon={Globe} label="Global Reach" />
              <VerticalDivider />
              <IconFeature icon={Users} label="Community" />
              <VerticalDivider />
              <IconFeature icon={Target} label="Impact" />
            </div>

            {/* Text Content */}
            <div className="relative">
              {/* Left Accent Line - Hidden on mobile */}
              <div
                className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-primary/60 to-primary/30 rounded-full"
                aria-hidden="true"
              />

              {/* Content Container */}
              <div className="md:pl-12 lg:pl-16">
                {/* Main Text Block */}
                <div className="relative">
                  {/* Decorative Bullets - Adjusted for mobile */}
                  <div
                    className="absolute -left-2 sm:-left-4 md:-left-8 top-2 sm:top-3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -left-2 sm:-left-4 md:-left-8 top-6 sm:top-8 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary/60"
                    aria-hidden="true"
                  />

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-foreground/90 pl-3 sm:pl-4 md:pl-6">
                    {aboutContent}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="mt-6 sm:mt-8 md:mt-10 flex items-center gap-2 sm:gap-3" aria-hidden="true">
                  <div className="h-px flex-1 bg-linear-to-r from-primary/40 via-primary/60 to-transparent" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flagship Event Card */}
        <div className="relative mt-8 sm:mt-12 md:mt-16">
          <Card className="border-l-4 border-l-primary bg-linear-to-br from-primary/5 via-primary/3 to-background shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {/* Decorative Quote Icon */}
            <div
              className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 opacity-5 md:opacity-10"
              aria-hidden="true"
            >
              <Quote className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 text-primary" strokeWidth={1} />
            </div>

            <CardContent className="p-4 sm:p-6 md:p-10 lg:p-12 relative z-10">
              <div className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-primary rounded-full" aria-hidden="true" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                    {flagshipEvent.title}
                  </h3>
                </div>

                {/* Quote Text */}
                <div className="relative pl-3 sm:pl-4 md:pl-8">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-linear-to-b from-primary via-primary/80 to-primary/40 rounded-full"
                    aria-hidden="true"
                  />
                  <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-foreground font-medium pl-3 sm:pl-4 md:pl-6">
                    <p className="relative text-justify">
                      <span
                        className="absolute -left-1 sm:-left-2 -top-1 text-3xl sm:text-4xl md:text-5xl font-bold text-primary/20 leading-none"
                        aria-hidden="true"
                      >
                        "
                      </span>
                      <span className="relative z-10">{flagshipEvent.text}</span>
                    </p>
                  </blockquote>
                </div>

                {/* Decorative Elements */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-2 sm:pt-4" aria-hidden="true">
                  <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-primary/30 rounded-full" />
                  <div className="h-0.5 sm:h-1 w-8 sm:w-12 bg-primary/50 rounded-full" />
                  <div className="h-0.5 sm:h-1 w-6 sm:w-8 bg-primary/30 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;