"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
      {/* 404 Text */}
      <h1 className="text-9xl font-black text-primary/20 select-none">
        404
      </h1>

      {/* Main Content */}
      <div className="space-y-6 relative -mt-12 z-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Page not found
        </h2>
        <p className="text-muted-foreground max-w-[500px] mx-auto text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
            <MoveLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
    </div>
  );
}