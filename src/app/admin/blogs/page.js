"use client"

import { useState, useEffect, useMemo } from 'react'
import useDebounce from '@/hooks/useDebounce'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  User,
  Search,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export default function AdminBlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, blog: null })
  const [statusFilter, setStatusFilter] = useState('all') // all | published | draft
  const [page, setPage] = useState(1)
  const pageSize = 8

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchBlogs()
  }, [debouncedSearchQuery])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        published: '', // Get all blogs
        sortBy: 'publishedAt',
        order: 'desc',
        limit: '1000', // Fetch all blogs for client-side pagination
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/blogs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBlogs(data.blogs || [])
      } else {
        console.error('Failed to fetch blogs:', data)
        toast.error(data.error || 'Failed to load blogs')
        setBlogs([])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.blog) return

    try {
      const response = await fetch(`/api/blogs/${deleteDialog.blog.slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Blog deleted successfully')
        setDeleteDialog({ open: false, blog: null })
        fetchBlogs()
      } else {
        toast.error('Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  const handleTogglePublish = async (blog) => {
    try {
      const response = await fetch(`/api/blogs/${blog.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      })

      if (response.ok) {
        toast.success(`Blog ${!blog.isPublished ? 'published' : 'unpublished'}`)
        fetchBlogs()
      } else {
        toast.error('Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Failed to update blog')
    }
  }

  const handleToggleFeatured = async (blog) => {
    try {
      const response = await fetch(`/api/blogs/${blog.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !blog.isFeatured }),
      })

      if (response.ok) {
        toast.success(`Blog ${!blog.isFeatured ? 'featured' : 'unfeatured'}`)
        fetchBlogs()
      } else {
        toast.error('Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      toast.error('Failed to update blog')
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Logged out successfully')
        router.push('/admin/login')
      } else {
        toast.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    }
  }


  // Derived data: filter and paginate on the client
  const { paginatedBlogs, totalPages, totalFiltered } = useMemo(() => {
    const filtered = blogs.filter((blog) => {
      if (statusFilter === 'published') return blog.isPublished
      if (statusFilter === 'draft') return !blog.isPublished
      if (statusFilter === 'featured') return blog.isFeatured
      return true
    })

    const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const currentPage = Math.min(page, pages)
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize

    return {
      paginatedBlogs: filtered.slice(start, end),
      totalPages: pages,
      totalFiltered: filtered.length,
    }
  }, [blogs, statusFilter, page, pageSize])

  // Ensure current page is valid when filters/search change
  useEffect(() => {
    setPage(1)
  }, [statusFilter, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Blog Management</h1>
              <p className="text-muted-foreground">
                View, filter, and manage all blog posts from a single dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2 w-auto">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Link href="/admin/blogs/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="opacity-70" />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, author, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end w-full md:w-auto">
            <ToggleGroup
              type="single"
              value={statusFilter}
              onValueChange={(value) => {
                if (value) setStatusFilter(value)
              }}
              variant="outline"
              className="shrink-0"
            >
              <ToggleGroupItem value="all" aria-label="Show all blogs">
                All
              </ToggleGroupItem>
              <ToggleGroupItem value="published" aria-label="Show published blogs">
                Published
              </ToggleGroupItem>
              <ToggleGroupItem value="draft" aria-label="Show draft blogs">
                Drafts
              </ToggleGroupItem>
              <ToggleGroupItem value="featured" aria-label="Show featured blogs">
                Featured
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="text-right">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Showing{' '}
                <span className="font-medium">
                  {paginatedBlogs.length}/{totalFiltered}
                </span>{' '}
                blog{totalFiltered === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-4 sm:pt-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : totalFiltered === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                No blogs match your current filters.
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting the search term or status filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {paginatedBlogs.map((blog) => (
              <Card key={blog._id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2 flex-wrap">
                        <CardTitle className="text-base sm:text-lg lg:text-xl wrap-break-words">
                          {blog.title}
                        </CardTitle>
                        {blog.isPublished ? (
                          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-600 dark:text-green-400 rounded whitespace-nowrap">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded whitespace-nowrap">
                            Draft
                          </span>
                        )}
                        {blog.isFeatured && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded whitespace-nowrap flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{blog.author}</span>
                        </div>
                        {blog.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span className="whitespace-nowrap">{format(new Date(blog.publishedAt), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span>{blog.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span>{blog.dislikes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span>{blog.commentCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                            <span className="whitespace-nowrap">{blog.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 justify-end sm:justify-start shrink-0">
                      <div className="flex items-center gap-2 mr-2" title={blog.isFeatured ? 'Remove from Featured' : 'Add to Featured'}>
                        <Sparkles className={`h-4 w-4 ${blog.isFeatured ? 'text-purple-500' : 'text-muted-foreground'}`} />
                        <Switch
                          checked={blog.isFeatured}
                          onCheckedChange={() => handleToggleFeatured(blog)}
                        />
                      </div>
                      <div className="flex items-center gap-2 mr-2" title={blog.isPublished ? 'Unpublish' : 'Publish'}>
                        <Switch
                          checked={blog.isPublished}
                          onCheckedChange={() => handleTogglePublish(blog)}
                        />
                      </div>
                      <Link href={`/admin/blogs/${blog.slug}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, blog })}
                        title="Delete"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent className="flex-wrap gap-1">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) {
                            setPage(page - 1)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }}
                        className={`text-xs sm:text-sm ${page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const showPage =
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)

                      if (!showPage) {
                        if (pageNum === page - 2 || pageNum === page + 2) {
                          return (
                            <PaginationItem key={pageNum} className="hidden sm:block">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setPage(pageNum)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            isActive={pageNum === page}
                            className="cursor-pointer text-xs sm:text-sm"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < totalPages) {
                            setPage(page + 1)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }}
                        className={`text-xs sm:text-sm ${page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, blog: deleteDialog.blog })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{deleteDialog.blog?.title}". This action cannot be undone.
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