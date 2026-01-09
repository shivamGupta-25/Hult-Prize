import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getBlogs } from '@/services/blogService';


// GET - Fetch all blogs (with optional filtering)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';

    // Convert 'published' string to boolean or undefined
    let isPublished;
    if (published === 'true') isPublished = true;
    if (published === 'false') isPublished = false;

    const result = await getBlogs({
      page,
      limit,
      published: isPublished,
      sortBy,
      order,
      search
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}


// POST - Create a new blog
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-session')?.value;
    const isVerified = await verifySession(token);

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, slug, excerpt, content, posterImage, author, isPublished } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    let blogSlug = slug;
    if (!blogSlug) {
      blogSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: blogSlug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      slug: blogSlug,
      excerpt: excerpt || '',
      content,
      posterImage: posterImage || '',
      author,
      isPublished: isPublished || false,
    };

    if (isPublished) {
      blogData.publishedAt = new Date();
    }

    const blog = await Blog.create(blogData);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}


