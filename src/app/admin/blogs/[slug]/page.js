"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import BlogEditor from '@/components/BlogEditor'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Save,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    posterImage: '',
    author: '',
    isPublished: false,
    isFeatured: false,
  })
  const [engagement, setEngagement] = useState({
    likes: [],
    dislikes: [],
    comments: [],
  })

  useEffect(() => {
    if (slug) {
      fetchBlog()
      fetchEngagement()
    }
  }, [slug])

  const fetchBlog = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blogs/${slug}`)
      const data = await response.json()

      if (response.ok) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          posterImage: data.posterImage || '',
          author: data.author || '',
          author: data.author || '',
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
        })
      } else {
        toast.error('Blog not found')
        router.push('/admin/blogs')
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
      const response = await fetch(`/api/blogs/${slug}/engagement?isAdmin=true`)
      const data = await response.json()

      if (response.ok) {
        setEngagement({
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          comments: data.allComments || [],
        })
      }
    } catch (error) {
      console.error('Error fetching engagement:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Blog updated successfully')
        router.push('/admin/blogs')
      } else {
        toast.error(data.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Failed to update blog')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Blog deleted successfully')
        router.push('/admin/blogs')
      } else {
        toast.error('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result

      try {
        const response = await fetch('/api/images/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String }),
        })

        const data = await response.json()
        if (data.url) {
          setFormData(prev => ({ ...prev, posterImage: data.url }))
          toast.success('Image uploaded successfully')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload image')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCommentToggle = async (commentId, isApproved) => {
    try {
      const response = await fetch(`/api/blogs/${slug}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      })

      if (response.ok) {
        toast.success(`Comment ${isApproved ? 'approved' : 'unapproved'}`)
        fetchEngagement()
      } else {
        toast.error('Failed to update comment')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/blogs/${slug}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Comment deleted')
        fetchEngagement()
      } else {
        toast.error('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin/blogs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 order-1">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="posterImage">Poster Image</Label>
                    <div className="flex gap-4">
                      <Input
                        id="posterImage"
                        type="text"
                        value={formData.posterImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, posterImage: e.target.value }))}
                      />
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button type="button" variant="outline" asChild>
                          <span>Upload</span>
                        </Button>
                      </label>
                    </div>
                    {formData.posterImage && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <img
                          src={formData.posterImage}
                          alt="Poster preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="isPublished"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                    />
                    <Label htmlFor="isPublished" className="cursor-pointer">
                      Published
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured Post
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Sidebar - Hidden on mobile, shown on lg+ */}
            <div className="lg:col-span-1 order-2 hidden lg:block">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>Likes</span>
                      </div>
                      <span className="font-semibold">{engagement.likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4" />
                        <span>Dislikes</span>
                      </div>
                      <span className="font-semibold">{engagement.dislikes}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-semibold">Comments ({engagement.comments?.length || 0})</span>
                    </div>
                    <div className="space-y-3 max-h-104 overflow-y-auto">
                      {engagement.comments?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                      ) : (
                        engagement.comments?.map((comment) => (
                          <div key={comment._id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{comment.author}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                              {!comment.isApproved && (
                                <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleCommentToggle(comment._id, !comment.isApproved)}
                              >
                                {comment.isApproved ? 'Unapprove' : 'Approve'}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Wide Editor */}
          <Card className="order-3">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BlogEditor
                content={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                contentClassName="min-h-[720px]"
                className="h-[800px]"
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Sidebar - Shown on mobile below editor */}
          <Card className="order-4 lg:hidden">
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Likes</span>
                  </div>
                  <span className="font-semibold">{engagement.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4" />
                    <span>Dislikes</span>
                  </div>
                  <span className="font-semibold">{engagement.dislikes}</span>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-semibold">Comments ({engagement.comments?.length || 0})</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {engagement.comments?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  ) : (
                    engagement.comments?.map((comment) => (
                      <div key={comment._id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          {!comment.isApproved && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleCommentToggle(comment._id, !comment.isApproved)}
                          >
                            {comment.isApproved ? 'Unapprove' : 'Approve'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this blog. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}