"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  MessageSquare,
  Copy,
  Check,
  ArrowLeft,
  Eye,
  ArrowRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [engagement, setEngagement] = useState({ likes: 0, comments: [], userLiked: false, userDisliked: false })
  const [recommendedBlogs, setRecommendedBlogs] = useState([])
  const [comment, setComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate a simple user ID (in production, use proper auth)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || `user_${Date.now()}` : `user_${Date.now()}`

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId)
    }
  }, [userId])

  useEffect(() => {
    if (slug) {
      fetchBlog()
      fetchEngagement()
      fetchRecommendedBlogs()
    }
  }, [slug])

  const fetchBlog = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blogs/${slug}`)
      const data = await response.json()

      if (response.ok) {
        setBlog(data)
      } else {
        toast.error('Blog not found')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      toast.error('Failed to load blog')
    } finally {
      setLoading(false)
    }
  }

  const fetchEngagement = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}/engagement?userId=${userId}`)
      const data = await response.json()

      if (response.ok) {
        setEngagement(data)
      }
    } catch (error) {
      console.error('Error fetching engagement:', error)
    }
  }

  const fetchRecommendedBlogs = async () => {
    try {
      // Fetch latest and most liked blogs
      const [latestRes, likedRes] = await Promise.all([
        fetch('/api/blogs?limit=3&published=true&sortBy=publishedAt&order=desc'),
        fetch('/api/blogs?limit=3&published=true&sortBy=likes&order=desc'),
      ])

      const latestData = await latestRes.json()
      const likedData = await likedRes.json()

      // Combine and filter out current blog
      const all = [...(latestData.blogs || []), ...(likedData.blogs || [])]
      const unique = all.filter((b, index, self) =>
        index === self.findIndex((t) => t._id === b._id) && b.slug !== slug
      )

      setRecommendedBlogs(unique.slice(0, 3))
    } catch (error) {
      console.error('Error fetching recommended blogs:', error)
    }
  }

  const handleEngagement = async (action) => {
    try {
      const response = await fetch(`/api/blogs/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      })

      const data = await response.json()

      if (response.ok) {
        setEngagement(prev => ({
          ...prev,
          likes: data.likes,
          dislikes: data.dislikes,
          userLiked: data.userLiked,
          userDisliked: data.userDisliked,
        }))
      }
    } catch (error) {
      console.error('Error handling engagement:', error)
      toast.error('Failed to update engagement')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() || !commentAuthor.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/blogs/${slug}/engagement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'comment',
          userId,
          comment: {
            author: commentAuthor,
            content: comment,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setEngagement(prev => ({
          ...prev,
          comments: data.comments,
        }))
        setComment('')
        setCommentAuthor('')
        toast.success('Comment added successfully')
      } else {
        toast.error('Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = (platform) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = blog?.title || ''
    const text = blog?.excerpt || ''

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blogs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>

        {/* Header */}
        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.author}</span>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(blog.publishedAt), 'MMMM d, yyyy')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{blog.views || 0} views</span>
            </div>
          </div>

          {/* Poster Image */}
          {blog.posterImage && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.posterImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Engagement Section */}
          <Separator className="my-8" />
          <div className="flex flex-wrap items-center gap-4 mb-8 justify-between">
            <div className="flex gap-2">
              <Button
                variant={engagement.userLiked ? 'default' : 'outline'}
                onClick={() => handleEngagement('like')}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {engagement.likes}
              </Button>
              <Button
                variant={engagement.userDisliked ? 'default' : 'outline'}
                onClick={() => handleEngagement('dislike')}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Share:</span>
              <Button variant="ghost" size="icon-sm" onClick={() => handleShare('twitter')}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleShare('facebook')}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => handleShare('whatsapp')}>
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <Separator className="my-8" />
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Comments ({engagement.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleComment} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submittingComment}>
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {engagement.comments?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                engagement.comments?.map((comment, index) => (
                  <Card key={index}>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-foreground">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Recommended Blogs */}
          {recommendedBlogs.length > 0 && (
            <>
              <Separator className="my-8" />
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Recommended for you</h2>
                  <p className="text-sm text-muted-foreground">Fresh picks from our latest and most liked posts.</p>
                </div>
                <Badge variant="secondary" className="hidden md:inline-flex">Curated</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedBlogs.map((recBlog) => {
                  const isRecent = recBlog.publishedAt
                    ? (Date.now() - new Date(recBlog.publishedAt).getTime()) / (1000 * 60 * 60 * 24) <= 14
                    : false

                  return (
                    <Link key={recBlog._id} href={`/blogs/${recBlog.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden pt-0 border-border/70">
                        {recBlog.posterImage && (
                          <div className="relative h-36 w-full overflow-hidden">
                            <Image
                              src={recBlog.posterImage}
                              alt={recBlog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {isRecent && (
                              <Badge className="absolute top-3 left-3" variant="default">
                                New
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardHeader className="space-y-2">
                          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
                            {recBlog.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span className="truncate">{recBlog.author}</span>
                            </div>
                            {recBlog.publishedAt && (
                              <>
                                <span className="text-muted-foreground/50">•</span>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{format(new Date(recBlog.publishedAt), 'MMM d, yyyy')}</span>
                                </div>
                              </>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          {recBlog.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{recBlog.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-[11px] px-2 py-0">
                                {recBlog.category || 'Blog'}
                              </Badge>
                              <div className="flex items-center gap-2 text-muted-foreground/80">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                  <span>{recBlog.likes?.length || 0}</span>
                                </div>
                                <span className="text-muted-foreground/40">•</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{recBlog.views || 0}</span>
                                </div>
                              </div>
                              {recBlog.readingTime && (
                                <span className="text-muted-foreground/80">{recBlog.readingTime} min read</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-primary group-hover:gap-1.5 transition-all">
                              <span>Read</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </article>
      </div>
    </div>
  )
}

