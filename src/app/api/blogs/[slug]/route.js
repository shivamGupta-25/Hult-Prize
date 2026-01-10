import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getBlogBySlug, updateBlog, deleteBlog, incrementBlogViews } from '@/services/blogService';
import { handleApiError, validateRequest } from '@/lib/api-utils';
import { updateBlogSchema } from '@/lib/validation';


// GET - Fetch a single blog by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    // Increment views (fire and forget, or await if critical)
    // We await it here to ensure it's counted, but in high trafic apps we might fire-and-forget
    await incrementBlogViews(slug);

    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if blog is published or if user is admin
    if (!blog.isPublished) {
      const cookieStore = await cookies();
      const token = cookieStore.get('admin-session')?.value;
      const isVerified = await verifySession(token);

      if (!isVerified) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(blog);
  } catch (error) {
    return handleApiError(error);
  }
}


// PUT - Update a blog
export async function PUT(request, { params }) {
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

    const { slug } = await params;

    // Validate request body
    const body = await validateRequest(request, updateBlogSchema);

    const blog = await updateBlog(slug, body);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE - Delete a blog
export async function DELETE(request, { params }) {
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

    const { slug } = await params;
    const success = await deleteBlog(slug);

    if (!success) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}