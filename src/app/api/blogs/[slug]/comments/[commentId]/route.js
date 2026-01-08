import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// PUT - Update comment (approve/unapprove or edit)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { slug, commentId } = await params;
    const body = await request.json();

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (body.isApproved !== undefined) {
      comment.isApproved = body.isApproved;
    }

    if (body.content !== undefined) {
      comment.content = body.content;
    }

    await blog.save();

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { slug, commentId } = await params;

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blog.comments.id(commentId).deleteOne();
    await blog.save();

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}



