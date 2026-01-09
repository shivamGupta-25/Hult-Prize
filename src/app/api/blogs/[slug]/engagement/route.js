import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// POST - Handle like/dislike/comment
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json();
    const { action, userId, comment } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug }).select('likes dislikes comments likeCount');

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (action === 'like') {
      // Toggle like
      const likeIndex = blog.likes.indexOf(userId);
      if (likeIndex > -1) {
        blog.likes.splice(likeIndex, 1);
      } else {
        // Remove from dislikes if present
        const dislikeIndex = blog.dislikes.indexOf(userId);
        if (dislikeIndex > -1) {
          blog.dislikes.splice(dislikeIndex, 1);
        }
        blog.likes.push(userId);
      }
    } else if (action === 'dislike') {
      // Toggle dislike
      const dislikeIndex = blog.dislikes.indexOf(userId);
      if (dislikeIndex > -1) {
        blog.dislikes.splice(dislikeIndex, 1);
      } else {
        // Remove from likes if present
        const likeIndex = blog.likes.indexOf(userId);
        if (likeIndex > -1) {
          blog.likes.splice(likeIndex, 1);
        }
        blog.dislikes.push(userId);
      }

    } else if (action === 'comment') {
      if (!comment || !comment.content || !comment.author) {
        return NextResponse.json(
          { error: 'Comment content and author are required' },
          { status: 400 }
        );
      }

      blog.comments.push({
        author: comment.author,
        content: comment.content,
        createdAt: new Date(),
        isApproved: true,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Always update likeCount based on current likes array
    blog.likeCount = blog.likes.length;

    await blog.save();

    return NextResponse.json({
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
      comments: blog.comments.filter(c => c.isApproved).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      userLiked: blog.likes.includes(userId),
      userDisliked: blog.dislikes.includes(userId),
    });
  } catch (error) {
    console.error('Error handling engagement:', error);
    return NextResponse.json(
      { error: 'Failed to handle engagement' },
      { status: 500 }
    );
  }
}

// GET - Get engagement data
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const blog = await Blog.findOne({ slug }).select('likes dislikes comments');

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const response = {
      likes: blog.likes.length,
      dislikes: isAdmin ? blog.dislikes.length : undefined, // Hide from non-admins
      comments: blog.comments.filter(c => c.isApproved).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      userLiked: userId ? blog.likes.includes(userId) : false,
      userDisliked: userId ? blog.dislikes.includes(userId) : false,
    };

    // Include all comments for admins (including unapproved)
    if (isAdmin) {
      response.allComments = blog.comments;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching engagement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    );
  }
}



