import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { escapeRegex } from '@/lib/utils';
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

    // Build query
    const query = {};

    if (published !== undefined) {
        query.isPublished = published;
    }

    if (search) {
        const searchRegex = escapeRegex(search);
        query.$or = [
            { title: { $regex: searchRegex, $options: 'i' } },
            { excerpt: { $regex: searchRegex, $options: 'i' } },
            { content: { $regex: searchRegex, $options: 'i' } },
        ];
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'likes') {
        sort['likeCount'] = order === 'asc' ? 1 : -1;
    } else {
        sort[sortBy] = order === 'asc' ? 1 : -1;
    }

    const blogs = await Blog.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-content') // Exclude full content for list view
        .lean();

    const total = await Blog.countDocuments(query);

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

export const getFeaturedBlogs = cache(async () => {
    await connectDB();

    // Parallel fetch for different categories
    const [liked, viewed, latest] = await Promise.all([
        Blog.findOne({ isPublished: true }).sort({ likeCount: -1 }).lean(),
        Blog.findOne({ isPublished: true }).sort({ views: -1 }).lean(),
        Blog.findOne({ isPublished: true }).sort({ publishedAt: -1 }).lean()
    ]);

    return {
        liked: liked ? serializeBlog(liked) : null,
        viewed: viewed ? serializeBlog(viewed) : null,
        latest: latest ? serializeBlog(latest) : null
    };
});

export const getRecommendedBlogs = cache(async (currentSlug) => {
    await connectDB();

    // Logic: 3 latest + 3 most liked, then deduplicate and take top 3
    const [latest, liked] = await Promise.all([
        Blog.find({ isPublished: true, slug: { $ne: currentSlug } })
            .sort({ publishedAt: -1 })
            .limit(3)
            .select('title slug excerpt posterImage author publishedAt likes views category')
            .lean(),
        Blog.find({ isPublished: true, slug: { $ne: currentSlug } })
            .sort({ likeCount: -1 })
            .limit(3)
            .select('title slug excerpt posterImage author publishedAt likes views category')
            .lean()
    ]);

    const all = [...latest, ...liked];
    const unique = all.filter((b, index, self) =>
        index === self.findIndex((t) => t._id.toString() === b._id.toString())
    ).slice(0, 3);

    return unique.map(serializeBlog);
});

export const createBlog = async (data) => {
    await connectDB();
    const blog = await Blog.create(data);
    return serializeBlog(blog.toObject());
};

export const updateBlog = async (slug, data) => {
    await connectDB();
    const blog = await Blog.findOne({ slug });
    if (!blog) return null;

    Object.assign(blog, data);
    await blog.save();
    return serializeBlog(blog.toObject());
};

export const deleteBlog = async (slug) => {
    await connectDB();
    return Blog.findOneAndDelete({ slug });
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
        comments: blog.comments?.map(comment => ({
            ...comment,
            _id: comment._id?.toString(),
            createdAt: comment.createdAt?.toISOString()
        })) || [],
        views: blog.views || 0,
        likeCount: blog.likeCount || 0
    };
}
