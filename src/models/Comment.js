import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    blogSlug: {
      type: String,
      required: true,
      index: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      index: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by blog
CommentSchema.index({ blogSlug: 1, createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;
