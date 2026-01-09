"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Search, Grid3x3, List } from 'lucide-react'
import BlogCard from './BlogCard'

const VIEW_MODE_KEY = 'blog-view-mode'

export default function BlogsView({ initialBlogs, pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL State
  const searchQuery = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || 'publishedAt'
  const page = parseInt(searchParams.get('page') || '1')

  // Local State
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  // Load view mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem(VIEW_MODE_KEY)
      const isMobile = window.innerWidth < 640
      if (savedViewMode === 'grid' || savedViewMode === 'list') {
        setViewMode(isMobile ? 'grid' : savedViewMode)
      }
    }
  }, [])

  // Save view mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, viewMode)
    }
  }, [viewMode])

  // Handle resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth < 640
        if (isMobile && viewMode === 'list') {
          setViewMode('grid')
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  // Update search term when URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Always reset to page 1 if searching or sorting changes
    if (newParams.search !== undefined || newParams.sortBy !== undefined) {
      if (newParams.page === undefined) params.set('page', '1')
    }

    router.push(`/blogs?${params.toString()}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateUrl({ search: searchTerm })
  }

  const handlePageChange = (newPage) => {
    updateUrl({ page: newPage.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Search, Sort, and View Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          <div className="flex gap-2 items-center">
            <ToggleGroup
              type="single"
              value={sortBy}
              onValueChange={(value) => {
                if (value) updateUrl({ sortBy: value })
              }}
              variant="outline"
              className="shrink-0"
            >
              <ToggleGroupItem value="publishedAt" aria-label="Sort by latest">
                Latest
              </ToggleGroupItem>
              <ToggleGroupItem value="likes" aria-label="Sort by most liked">
                Most Liked
              </ToggleGroupItem>
              <ToggleGroupItem value="views" aria-label="Sort by most viewed">
                Most Viewed
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="hidden sm:flex h-9 border rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none border-0"
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none border-0 border-l"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid/List */}
      {initialBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No blogs found.</p>
        </div>
      ) : (
        <>
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            : ""
          }>
            {initialBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (page > 1) handlePageChange(page - 1)
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => {
                  const showPage =
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)

                  if (!showPage) {
                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <PaginationItem key={pageNum}>
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
                          handlePageChange(pageNum)
                        }}
                        isActive={pageNum === page}
                        className="cursor-pointer"
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
                      if (page < pagination.pages) handlePageChange(page + 1)
                    }}
                    className={page === pagination.pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </>
  )
}
