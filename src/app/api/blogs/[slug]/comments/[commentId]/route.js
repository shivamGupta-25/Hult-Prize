import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';

// PUT - Update comment (approve/unapprove or edit)
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { commentId } = await params; // params contains slug too, but we just need commentId
    const body = await request.json();

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (body.isApproved !== undefined && body.isApproved !== comment.isApproved) {
      const isApproving = body.isApproved;
      comment.isApproved = body.isApproved;

      // Update blog comment count
      await Blog.updateOne(
        { slug: comment.blogSlug },
        { $inc: { commentCount: isApproving ? 1 : -1 } }
      );
    }

    if (body.content !== undefined) {
      comment.content = body.content;
    }

    await comment.save();

    return NextResponse.json({
      ...comment.toObject(),
      _id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    });
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

    const { commentId } = await params;

    const result = await Comment.findByIdAndDelete(commentId);

    if (!result) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // If deleted comment was approved, decrement count on blog
    if (result.isApproved) {
      await Blog.updateOne(
        { slug: result.blogSlug },
        { $inc: { commentCount: -1 } }
      );
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}