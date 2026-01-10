import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getBlogs, createBlog } from '@/services/blogService';
import { handleApiError, validateRequest } from '@/lib/api-utils';
import { blogSchema } from '@/lib/validation';

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
    return handleApiError(error);
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

    // Validate body using Zod
    const body = await validateRequest(request, blogSchema);

    // Create using service
    const blog = await createBlog(body);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}