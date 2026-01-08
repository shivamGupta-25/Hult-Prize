import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET - Fetch a single blog by slug
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    blog.views = (blog.views || 0) + 1;

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update a blog
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json();

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.title !== undefined) blog.title = body.title;
    if (body.excerpt !== undefined) blog.excerpt = body.excerpt;
    if (body.content !== undefined) blog.content = body.content;
    if (body.posterImage !== undefined) blog.posterImage = body.posterImage;
    if (body.author !== undefined) blog.author = body.author;

    // Handle publish status
    if (body.isPublished !== undefined) {
      const wasPublished = blog.isPublished;
      blog.isPublished = body.isPublished;

      if (!wasPublished && body.isPublished && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    // Handle slug change
    if (body.slug !== undefined && body.slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug: body.slug });
      if (existingBlog && existingBlog._id.toString() !== blog._id.toString()) {
        return NextResponse.json(
          { error: 'A blog with this slug already exists' },
          { status: 400 }
        );
      }
      blog.slug = body.slug;
    }

    await blog.save();

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const blog = await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}



