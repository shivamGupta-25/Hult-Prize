'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, Home, Users, Mail, Book, BookOpen, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { mottoData } from '@/Data/SiteData';
import { ModeToggle } from '@/components/mode-toggle';

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Ensure component is mounted before applying scroll-based styles to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/praxeis', label: 'Praxeis', icon: BookOpen },
    { path: '/blogs', label: 'Blogs', icon: Book },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/team', label: 'Team', icon: Users },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        mounted && isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Hult Prize Home"
          >
            <Image
              src="/Hult-Prize_Logo.png"
              alt="Hult Prize Logo"
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110"
              priority
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-foreground leading-tight">
                Hult Prize
              </span>
              <span className="text-xs md:text-sm text-muted-foreground leading-tight">
                Hansraj College
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            <ModeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-70 sm:w-[320px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Compact Header */}
                  <div className="px-5 pt-6 pb-4 border-b border-border">
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 group"
                    >
                      <Image
                        src="/Hult-Prize_Logo.png"
                        alt="Hult Prize Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground leading-tight">
                          Hult Prize
                        </span>
                        <span className="text-xs text-muted-foreground leading-tight">
                          Hansraj College
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 px-3 py-4 overflow-y-auto">
                    <nav className="flex flex-col gap-1">
                      {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                          <Link
                            key={link.path}
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                              active
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0 transition-colors',
                                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                              )}
                            />
                            <span className="text-sm font-medium flex-1">
                              {link.label}
                            </span>
                            {active && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="px-5 pb-6 text-center text-sm text-primary">
                    <Separator className="my-4 bg-primary/10" />
                    <p className="tracking-wide text-center italic font-medium">
                      &ldquo;{mottoData.text}&rdquo;
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mottoData.attribution} - Hansraj College
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;