import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Comment from '@/models/Comment'; // Import Comment for cascade delete
import { cache } from 'react';

// Use React cache to deduplicate requests in a single render pass
export const getBlogs = cache(async (params = {}) => {
  await connectDB();

  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'publishedAt',
    order = 'desc',
    published // boolean or undefined
  } = params;

  const skip = (page - 1) * limit;

  // Build match stage (query)
  const matchStage = {};

  if (published !== undefined) {
    matchStage.isPublished = published;
  }

  if (search) {
    matchStage.$text = { $search: search };
  }

  // Aggregation Pipeline
  const pipeline = [
    { $match: matchStage },
  ];

  // Build sort stage
  const sortStage = {};

  // Add calculated likeCount for sorting if needed
  if (sortBy === 'likes') {
    pipeline.push({
      $addFields: {
        calculatedLikeCount: { $size: '$likes' }
      }
    });
    sortStage.calculatedLikeCount = order === 'asc' ? 1 : -1;
  } else if (search) {
    sortStage.score = { $meta: 'textScore' };
  } else {
    sortStage[sortBy] = order === 'asc' ? 1 : -1;
  }

  pipeline.push({ $sort: sortStage });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });
  pipeline.push({
    $project: {
      content: 0, // exclude content for list view
      calculatedLikeCount: 0 // remove temp field
    }
  });

  const blogs = await Blog.aggregate(pipeline);
  const total = await Blog.countDocuments(matchStage);

  // Serialize for Client Components if needed
  const serializedBlogs = blogs.map(serializeBlog);

  return {
    blogs: serializedBlogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
});

export const getBlogBySlug = cache(async (slug) => {
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) return null;
  return serializeBlog(blog);
});

// NEW: Helper to increment views atomically
export const incrementBlogViews = async (slug) => {
  await connectDB();
  await Blog.updateOne({ slug }, { $inc: { views: 1 } });
};

export const getFeaturedBlogs = cache(async () => {
  await connectDB();

  const [results] = await Blog.aggregate([
    { $match: { isPublished: true } },
    {
      $facet: {
        liked: [
          { $addFields: { likeCount: { $size: '$likes' } } },
          { $sort: { likeCount: -1 } },
          { $limit: 1 }
        ],
        viewed: [
          { $sort: { views: -1 } },
          { $limit: 1 }
        ],
        latest: [
          { $sort: { publishedAt: -1 } },
          { $limit: 1 }
        ]
      }
    }
  ]);

  const liked = results.liked[0] ? serializeBlog(results.liked[0]) : null;
  const viewed = results.viewed[0] ? serializeBlog(results.viewed[0]) : null;
  const latest = results.latest[0] ? serializeBlog(results.latest[0]) : null;

  return { liked, viewed, latest };
});

export const getHeroBlog = cache(async () => {
  await connectDB();
  const blog = await Blog.findOne({ isPublished: true, isFeatured: true })
    .sort({ publishedAt: -1 })
    .lean();

  if (!blog) return null;
  return serializeBlog(blog);
});

export const getRecommendedBlogs = cache(async (currentSlug) => {
  await connectDB();

  const [results] = await Blog.aggregate([
    { $match: { isPublished: true, slug: { $ne: currentSlug } } },
    {
      $facet: {
        latest: [
          { $sort: { publishedAt: -1 } },
          { $limit: 3 },
          { $project: { title: 1, slug: 1, excerpt: 1, posterImage: 1, author: 1, publishedAt: 1, likes: 1, views: 1, category: 1 } }
        ],
        liked: [
          { $addFields: { likeCountSize: { $size: '$likes' } } },
          { $sort: { likeCountSize: -1 } },
          { $limit: 3 },
          { $project: { title: 1, slug: 1, excerpt: 1, posterImage: 1, author: 1, publishedAt: 1, likes: 1, views: 1, category: 1 } }
        ]
      }
    }
  ]);

  const latest = results.latest || [];
  const liked = results.liked || [];
  const all = [...latest, ...liked];

  // Deduplicate
  const unique = all.filter((b, index, self) =>
    index === self.findIndex((t) => t._id.toString() === b._id.toString())
  ).slice(0, 3);

  return unique.map(serializeBlog);
});

export const createBlog = async (data) => {
  await connectDB();

  // Note: Validation is now handled by Zod in the API route before calling this service.
  // We can trust specific fields exist, but we still handle business logic like slugs.

  const { title, slug, excerpt, content, posterImage, author, isPublished, isFeatured } = data;

  // Generate slug if not provided or empty
  let blogSlug = slug;
  if (!blogSlug) {
    blogSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Check availability
  const existingBlog = await Blog.findOne({ slug: blogSlug });
  if (existingBlog) {
    throw new Error('A blog with this slug already exists');
  }

  const blogData = {
    title,
    slug: blogSlug,
    excerpt: excerpt || '',
    content,
    posterImage: posterImage || '',
    author,
    isPublished: isPublished || false,
    isFeatured: isFeatured || false,
  };

  // If this blog is featured, un-feature others
  if (blogData.isFeatured) {
    await Blog.updateMany(
      { isFeatured: true },
      { $set: { isFeatured: false } }
    );
  }

  if (isPublished) {
    blogData.publishedAt = new Date();
  }

  const blog = await Blog.create(blogData);
  return serializeBlog(blog.toObject());
};

export const updateBlog = async (currentSlug, data) => {
  await connectDB();
  const blog = await Blog.findOne({ slug: currentSlug });
  if (!blog) return null;

  // Handle slug updates
  if (data.slug && data.slug !== blog.slug) {
    const existingBlog = await Blog.findOne({ slug: data.slug });
    if (existingBlog && existingBlog._id.toString() !== blog._id.toString()) {
      throw new Error('A blog with this slug already exists');
    }

    // CASCADE UPDATE: Update all comments associated with the old slug
    const oldSlug = blog.slug;
    blog.slug = data.slug;

    // We already imported Comment at the top
    await Comment.updateMany({ blogSlug: oldSlug }, { blogSlug: data.slug });
  }

  // Handle publish status changes
  if (data.isPublished !== undefined) {
    const wasPublished = blog.isPublished;
    blog.isPublished = data.isPublished;

    if (!wasPublished && data.isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
  }

  if (data.isFeatured !== undefined) {
    blog.isFeatured = data.isFeatured;

    // If setting to featured, un-feature others
    if (data.isFeatured) {
      await Blog.updateMany(
        { _id: { $ne: blog._id }, isFeatured: true },
        { $set: { isFeatured: false } }
      );
    }
  }

  // Update other fields if they are present in data
  // Note: undefined checks are crucial to allow partial updates
  if (data.title !== undefined) blog.title = data.title;
  if (data.excerpt !== undefined) blog.excerpt = data.excerpt;
  if (data.content !== undefined) blog.content = data.content;
  if (data.posterImage !== undefined) blog.posterImage = data.posterImage;
  if (data.author !== undefined) blog.author = data.author;

  await blog.save();
  return serializeBlog(blog.toObject());
};

export const deleteBlog = async (slug) => {
  await connectDB();

  // Find the blog first to ensure it exists
  const blog = await Blog.findOne({ slug });
  if (!blog) return false;

  // CASCADE DELETE: Delete all comments associated with this blog
  await Comment.deleteMany({ blogSlug: slug });

  // Delete the blog
  await Blog.deleteOne({ _id: blog._id });

  return true;
};

// Helper to standardise ID and Date serialization
function serializeBlog(blog) {
  if (!blog) return null;
  return {
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt?.toISOString(),
    updatedAt: blog.updatedAt?.toISOString(),
    publishedAt: blog.publishedAt?.toISOString(),
    likes: blog.likes?.map(id => id.toString()) || [],
    dislikes: blog.dislikes?.map(id => id.toString()) || [],
    // comments removed from blog object in previous discussions, keeping it clean
    views: blog.views || 0,
    likeCount: blog.likes?.length || 0,
    commentCount: blog.commentCount || 0
  };
}
