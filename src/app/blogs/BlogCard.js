"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Calendar, ThumbsUp, Eye, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function BlogCard({ blog, viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <Link href={`/blogs/${blog.slug}`}>
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden mb-4">
          <div className="flex flex-col sm:flex-row sm:gap-5 p-6">
            {blog.posterImage && (
              <div className="relative h-40 w-full sm:w-56 lg:w-64 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={blog.posterImage}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 250px, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-between min-w-0 gap-4">
              <div className="space-y-3">
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl mb-1">
                  {blog.title}
                </CardTitle>
                {blog.excerpt && (
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {blog.excerpt}
                  </CardDescription>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span className="truncate">{blog.author}</span>
                  </div>
                  {blog.publishedAt && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                      </div>
                    </>
                  )}
                  <span className="text-muted-foreground/50">•</span>
                  <div className="flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{blog.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views || 0}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:text-primary self-start sm:self-auto h-9">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Grid View (Default)
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden pt-0">
        {blog.posterImage && (
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={blog.posterImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="px-5">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg mb-2">
            {blog.title}
          </CardTitle>
          {blog.excerpt && (
            <CardDescription className="line-clamp-3 text-sm leading-relaxed">
              {blog.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-5 pt-0">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 pb-4 border-b">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{blog.author}</span>
            </div>
            {blog.publishedAt && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{blog.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{blog.views || 0}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="group-hover:text-primary h-8 text-xs">
              Read More
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
