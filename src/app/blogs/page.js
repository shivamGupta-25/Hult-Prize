import { Separator } from '@/components/ui/separator'
import BlogsView from './BlogsView'
import { getBlogs } from '@/services/blogService'

export const metadata = {
  title: 'Blog | Hult Prize',
  description: 'Discover insights, stories, and updates from the Hult Prize community',
}

// getBlogs logic is now handled by src/services/blogService.js


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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Blog
          </h1>
          <Separator className="w-24 mx-auto bg-primary/30 mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover insights, stories, and updates from the Hult Prize community
          </p>
        </div>

        <BlogsView initialBlogs={blogs} pagination={pagination} />
      </div>
    </div>
  )
}



