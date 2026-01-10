import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    posterImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
BlogSchema.index({ isPublished: 1, isFeatured: 1, publishedAt: -1 });
BlogSchema.index({ isPublished: 1, publishedAt: -1 });
// BlogSchema.index({ isPublished: 1, likeCount: -1 }); // Removed in favor of runtime $size sort or aggregation
BlogSchema.index({ isPublished: 1, views: -1 });     // Optimized for "Most Viewed"
BlogSchema.index({ createdAt: -1 });

// Auto-generate slug from title if not provided
BlogSchema.pre('save', function () {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Set publishedAt when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export default Blog;