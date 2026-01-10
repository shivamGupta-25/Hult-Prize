import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { handleApiError, validateRequest } from '@/lib/api-utils';
import { commentSchema } from '@/lib/validation';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { serializeComment } from '@/lib/serializers';

// GET - Fetch comments for a blog
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // SECURE: Check admin session via cookie instead of trust query param
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-session')?.value;
    const isAdmin = await verifySession(token);

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
    // Serialize _id and dates using helper
    const serializedComments = comments.map(serializeComment);

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

    return NextResponse.json(serializeComment(newComment), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
