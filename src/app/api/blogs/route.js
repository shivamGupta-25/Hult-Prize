import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

// GET - Fetch all blogs (with optional filtering)
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Only filter by published status if a specific value is provided
    if (published !== null && published !== undefined && published !== '') {
      query.isPublished = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'likes') {
      sort['likeCount'] = order === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-content') // Exclude full content from listing
      .lean();

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
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


