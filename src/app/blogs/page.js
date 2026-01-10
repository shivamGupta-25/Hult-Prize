import { Separator } from '@/components/ui/separator'
import FeaturedBlogBanner from '@/components/FeaturedBlogBanner'
import BlogsView from './BlogsView'
import { getBlogs } from '@/services/blogService'

export const metadata = {
  title: 'Blog | Hult Prize',
  description: 'Discover insights, stories, and updates from the Hult Prize community',
}

export default async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams

  // Use service to fetch blogs
  const { blogs, pagination } = await getBlogs({
    page: parseInt(resolvedSearchParams.page || '1'),
    limit: 9,
    search: resolvedSearchParams.search || '',
    sortBy: resolvedSearchParams.sortBy || 'publishedAt',
    order: 'desc',
    published: true // Always valid for public page
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4">
            <span className="text-white">Our</span> <span className="text-primary">Blog</span>
          </h1>
          <Separator className="w-24 mx-auto bg-primary/30 mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover insights, stories, and updates from the Hult Prize community
          </p>
        </div>
        <div className="mb-8">
          <FeaturedBlogBanner />
        </div>
        <BlogsView initialBlogs={blogs} pagination={pagination} />
      </div>
    </div>
  )
}