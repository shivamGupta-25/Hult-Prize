import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, Eye, Sparkles, Calendar, User, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getFeaturedBlogs } from '@/services/blogService';
import FeaturedBlogBanner from '@/components/FeaturedBlogBanner';

const CategoryBadge = ({ type, icon: Icon }) => {
  const badges = {
    liked: {
      label: 'Most Liked',
      className: 'bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300',
    },
    viewed: {
      label: 'Most Viewed',
      className: 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
    },
    latest: {
      label: 'Latest',
      className: 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300',
    },
  };

  const badge = badges[type];

  return (
    <Badge variant="outline" className={`gap-1.5 px-3 py-1.5 text-xs font-semibold ${badge.className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{badge.label}</span>
    </Badge>
  );
};

export const FeaturedBlogs = async () => {
  const blogs = await getFeaturedBlogs();

  const blogEntries = [
    { key: 'liked', blog: blogs.liked, type: 'liked', icon: ThumbsUp },
    { key: 'viewed', blog: blogs.viewed, type: 'viewed', icon: Eye },
    { key: 'latest', blog: blogs.latest, type: 'latest', icon: Sparkles },
  ];

  // Check if we have at least one blog to display
  const hasBlogs = blogEntries.some(entry => entry.blog);

  if (!hasBlogs) {
    return null;
  }

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-center mb-8 sm:mb-12 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Featured Blogs
        </h2>
        <Separator className="w-20 sm:w-24 mx-auto bg-primary/30" />
        <FeaturedBlogBanner />
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <Separator className="w-20 sm:w-24 mx-auto bg-primary/30" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Discover our most popular and latest stories from the community
          </p>
        </div>
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogEntries.map(({ key, blog, type, icon }) => {
            if (!blog) return null;

            return (
              <Link key={key} href={`/blogs/${blog.slug}`}>
                <Card className="pt-0 h-full hover:shadow-xl transition-all duration-500 cursor-pointer group overflow-hidden border-border/50 hover:border-primary/30 relative">
                  {/* Category Badge - Positioned absolutely */}
                  <div className="absolute top-4 left-4 z-20">
                    <CategoryBadge type={type} icon={icon} />
                  </div>

                  {/* Poster Image */}
                  {blog.posterImage && (
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={blog.posterImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                  )}

                  <CardHeader className="px-5 pb-3">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg mb-2 leading-tight">
                      {blog.title}
                    </CardTitle>
                    {blog.excerpt && (
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                        {blog.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="px-5 pt-0 pb-5">
                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[100px]">{blog.author}</span>
                      </div>
                      {blog.publishedAt && (
                        <>
                          <span className="text-muted-foreground/50">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span className="whitespace-nowrap">
                              {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Stats and CTA */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span className="font-medium">{blog.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="font-medium">{blog.views || 0}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:text-primary h-8 text-xs font-semibold"
                      >
                        Read
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        {hasBlogs && (
          <div className="flex justify-center">
            <Link href="/blogs">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Blogs
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBlogs;

