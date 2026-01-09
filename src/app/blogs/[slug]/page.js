import { notFound } from 'next/navigation'
import BlogClient from './BlogClient'
import { getBlogBySlug, getRecommendedBlogs } from '@/services/blogService'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

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

  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // Fetch recommended blogs
  let recommendedBlogs = []
  try {
    recommendedBlogs = await getRecommendedBlogs(slug)
  } catch (err) {
    console.error('Error fetching recommended blogs:', err)
  }

  return <BlogClient initialBlog={blog} slug={slug} recommendedBlogs={recommendedBlogs} />
}

