"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
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
import { Search, Calendar, User, ArrowRight, ThumbsUp, Eye, Grid3x3, List } from 'lucide-react'
import { format } from 'date-fns'

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
                            <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                                <Card className={viewMode === 'grid'
                                    ? "h-full hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden pt-0"
                                    : "hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden mb-4"
                                }>
                                    {viewMode === 'grid' ? (
                                        <>
                                            {blog.posterImage && (
                                                <div className="relative h-52 w-full overflow-hidden">
                                                    <Image
                                                        src={blog.posterImage}
                                                        alt={blog.title}
                                                        fill
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
                                        </>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row sm:gap-5 p-6">
                                            {blog.posterImage && (
                                                <div className="relative h-40 w-full sm:w-56 lg:w-64 shrink-0 overflow-hidden rounded-lg">
                                                    <Image
                                                        src={blog.posterImage}
                                                        alt={blog.title}
                                                        fill
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
                                    )}
                                </Card>
                            </Link>
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
