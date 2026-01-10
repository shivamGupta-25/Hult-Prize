import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { handleApiError, validateRequest } from '@/lib/api-utils';
import { commentSchema } from '@/lib/validation';

// GET - Fetch comments for a blog
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query = { blogSlug: slug };
    if (!isAdmin) {
      query.isApproved = true;
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Serialize _id and dates
    const serializedComments = comments.map(comment => ({
      ...comment,
      _id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedComments);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create a new comment
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    // Validate request body
    const body = await validateRequest(request, commentSchema);

    // Verify blog exists
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const [newComment] = await Promise.all([
      Comment.create({
        blogSlug: slug,
        blogId: blog._id, // Save the stable ID
        author: body.author,
        content: body.content,
      }),
      Blog.updateOne(
        { _id: blog._id },
        { $inc: { commentCount: 1 } }
      )
    ]);

    return NextResponse.json({
      ...newComment.toObject(),
      _id: newComment._id.toString(),
      createdAt: newComment.createdAt.toISOString(),
      updatedAt: newComment.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
