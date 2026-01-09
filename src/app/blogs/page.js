import { Separator } from '@/components/ui/separator'
import { escapeRegex } from '@/lib/utils'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogsView from './BlogsView'

export const metadata = {
  title: 'Blog | Hult Prize',
  description: 'Discover insights, stories, and updates from the Hult Prize community',
}

async function getBlogs(searchParams) {
  try {
    await connectDB()

    const page = parseInt(searchParams.page || '1')
    const limit = 9 // Adjusted to 9 to match the UI grid
    const sortBy = searchParams.sortBy || 'publishedAt'
    const order = 'desc'
    const search = searchParams.search || ''

    const skip = (page - 1) * limit

    // Build query
    const query = { isPublished: true } // Default to published only for the public page

    if (search) {
      const searchRegex = escapeRegex(search)
      query.$or = [
        { title: { $regex: searchRegex, $options: 'i' } },
        { excerpt: { $regex: searchRegex, $options: 'i' } },
      ]
    }

    // Build sort object
    const sort = {}
    if (sortBy === 'likes') {
      sort['likeCount'] = order === 'asc' ? 1 : -1
    } else {
      sort[sortBy] = order === 'asc' ? 1 : -1
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt posterImage author publishedAt likes views') // Select only needed fields
      .lean()

    const total = await Blog.countDocuments(query)

    // Serialize MongoDB objects (convert OID and Dates to strings)
    const serializedBlogs = blogs.map(blog => ({
      ...blog,
      _id: blog._id.toString(),
      publishedAt: blog.publishedAt?.toISOString(),
      likes: blog.likes?.map(id => id.toString()) || [],
      // Ensure views is a number
      views: blog.views || 0
    }))

    return {
      blogs: serializedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return {
      blogs: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    }
  }
}

export default async function BlogsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const { blogs, pagination } = await getBlogs(resolvedSearchParams)

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



