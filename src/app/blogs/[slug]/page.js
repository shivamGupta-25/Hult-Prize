import { notFound } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import BlogClient from './BlogClient'

export async function generateMetadata({ params }) {
  const { slug } = await params

  await connectDB()
  const blog = await Blog.findOne({ slug })

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.posterImage ? [blog.posterImage] : [],
      type: 'article',
      authors: [blog.author],
      publishedTime: blog.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.posterImage ? [blog.posterImage] : [],
    },
  }
}

export default async function BlogPage({ params }) {
  const { slug } = await params

  await connectDB()
  const blog = await Blog.findOne({ slug }).lean()

  if (!blog) {
    notFound()
  }

  // Convert _id and dates to string to pass to Client Component
  const serializableBlog = {
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt?.toISOString(),
    updatedAt: blog.updatedAt?.toISOString(),
    publishedAt: blog.publishedAt?.toISOString(),
    likes: blog.likes?.map(id => id.toString()) || [],
    dislikes: blog.dislikes?.map(id => id.toString()) || [],
    comments: blog.comments?.map(comment => ({
      ...comment,
      _id: comment._id?.toString(),
      createdAt: comment.createdAt?.toISOString()
    })) || []
  }

  // Fetch recommended blogs
  let recommendedBlogs = []
  try {
    const [latest, liked] = await Promise.all([
      Blog.find({ isPublished: true, slug: { $ne: slug } })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select('title slug excerpt posterImage author publishedAt likes views category')
        .lean(),
      Blog.find({ isPublished: true, slug: { $ne: slug } })
        .sort({ likeCount: -1 })
        .limit(3)
        .select('title slug excerpt posterImage author publishedAt likes views category')
        .lean()
    ])

    // Combine and deduplicate
    const all = [...latest, ...liked]
    const unique = all.filter((b, index, self) =>
      index === self.findIndex((t) => t._id.toString() === b._id.toString())
    ).slice(0, 3)

    recommendedBlogs = unique.map(b => ({
      ...b,
      _id: b._id.toString(),
      publishedAt: b.publishedAt?.toISOString(),
      likes: b.likes?.map(id => id.toString()) || []
    }))
  } catch (err) {
    console.error('Error fetching recommended blogs:', err)
  }

  return <BlogClient initialBlog={serializableBlog} slug={slug} recommendedBlogs={recommendedBlogs} />
}
