"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, User, ThumbsUp, Eye, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export default function BlogPreview({ blog, featured = false }) {
  if (!blog) return null

  if (featured) {
    return (
      <Link href={`/blogs/${blog.slug}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
          {blog.posterImage && (
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={blog.posterImage}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </CardTitle>
            {blog.excerpt && (
              <CardDescription className="line-clamp-3">
                {blog.excerpt}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author}</span>
                </div>
                {blog.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{blog.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views || 0}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="group-hover:text-primary">
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        {blog.posterImage && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={blog.posterImage}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </CardTitle>
          {blog.excerpt && (
            <CardDescription className="line-clamp-2">
              {blog.excerpt}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{blog.likes?.length || 0}</span>
            </div>
            <Button variant="ghost" size="sm" className="group-hover:text-primary">
              Read
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}



