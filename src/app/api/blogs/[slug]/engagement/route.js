import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// POST - Handle like/dislike
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (action === 'like') {
      const hasLiked = blog.likes.includes(userId);
      const hasDisliked = blog.dislikes.includes(userId);

      if (hasLiked) {
        // Un-like: Atomically pull from likes and decrement count
        await Blog.updateOne(
          { _id: blog._id },
          {
            $pull: { likes: userId },
            $inc: { likeCount: -1 }
          }
        );
      } else {
        // Like: Atomically push to likes, increment count, and pull from dislikes if present
        const updateOps = {
          $addToSet: { likes: userId },
          $inc: { likeCount: 1 }
        };
        if (hasDisliked) {
          updateOps.$pull = { dislikes: userId };
        }
        await Blog.updateOne({ _id: blog._id }, updateOps);
      }
    } else if (action === 'dislike') {
      const hasLiked = blog.likes.includes(userId);
      const hasDisliked = blog.dislikes.includes(userId);

      if (hasDisliked) {
        // Un-dislike: Atomically pull from dislikes
        await Blog.updateOne(
          { _id: blog._id },
          { $pull: { dislikes: userId } }
        );
      } else {
        // Dislike: Atomically push to dislikes and pull from likes if present (decrement count)
        const updateOps = {
          $addToSet: { dislikes: userId }
        };
        if (hasLiked) {
          updateOps.$pull = { likes: userId };
          updateOps.$inc = { likeCount: -1 };
        }
        await Blog.updateOne({ _id: blog._id }, updateOps);
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Fetch updated Blog to return current state
    const updatedBlog = await Blog.findById(blog._id).select('likes dislikes likeCount');

    return NextResponse.json({
      likes: updatedBlog.likes.length,
      dislikes: updatedBlog.dislikes.length,
      userLiked: updatedBlog.likes.includes(userId),
      userDisliked: updatedBlog.dislikes.includes(userId),
    });
  } catch (error) {
    console.error('Error handling engagement:', error);
    return NextResponse.json(
      { error: 'Failed to handle engagement' },
      { status: 500 }
    );
  }
}

// GET - Get engagement data (Likes only)
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const blog = await Blog.findOne({ slug }).select('likes dislikes');

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      likes: blog.likes.length,
      dislikes: isAdmin ? blog.dislikes.length : undefined,
      userLiked: userId ? blog.likes.includes(userId) : false,
      userDisliked: userId ? blog.dislikes.includes(userId) : false,
    });
  } catch (error) {
    console.error('Error fetching engagement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    );
  }
}