import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

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

    if (body.isApproved !== undefined) {
      comment.isApproved = body.isApproved;
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

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}