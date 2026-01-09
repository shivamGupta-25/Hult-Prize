import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { getHeroBlog } from '@/services/blogService';

export const FeaturedBlogBanner = async () => {
  const blog = await getHeroBlog();

  if (!blog) {
    return null;
  }

  return (
    <section className="w-full relative overflow-hidden bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-2xl group">
          <div className="grid lg:grid-cols-2 gap-0 relative z-10">
            {/* Content Side */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center order-2 lg:order-1">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="relative font-bold text-md italic pl-4 pr-4 w-fit gap-1.5 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                  <Sparkles className="h-9 w-9" />
                  <span>Featured</span>
                </Badge>
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors duration-300">
                    <Link href={`/blogs/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h2>
                  {blog.excerpt && (
                    <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{blog.author}</span>
                  </div>
                  {blog.publishedAt && (
                    <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Link href={`/blogs/${blog.slug}`}>
                    <Button size="lg" className="rounded-full gap-2 text-base px-8 group-hover:scale-105 transition-transform duration-300">
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden order-1 lg:order-2">
              {blog.posterImage ? (
                <>
                  <Image
                    src={blog.posterImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Overlay for mobile/tablet text readability if needed, but we used split layout. 
                      Adding a subtle gradient anyway for style */}
                  <div className="absolute inset-0 bg-linear-to-bl from-transparent via-transparent to-background/20 lg:to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogBanner;
