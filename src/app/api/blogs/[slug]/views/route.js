import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';

const VIEW_COOKIE_NAME = 'blog_views';
const VIEW_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// POST - Increment blog view count with deduplication
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    // Get existing cookie
    const cookieStore = await cookies();
    const viewsCookie = cookieStore.get(VIEW_COOKIE_NAME);
    let viewedBlogs = {};

    if (viewsCookie?.value) {
      try {
        viewedBlogs = JSON.parse(viewsCookie.value);
      } catch (e) {
        // Invalid cookie, start fresh
        viewedBlogs = {};
      }
    }

    const now = Date.now();
    const lastViewed = viewedBlogs[slug];

    // Check if this blog was viewed recently (within 7 days)
    if (lastViewed && (now - lastViewed) < VIEW_EXPIRY_MS) {
      // Don't increment, just return current count
      const blog = await Blog.findOne({ slug }).select('views');

      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        views: blog.views || 0,
        incremented: false
      });
    }

    // Increment the view count
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update cookie with new timestamp
    viewedBlogs[slug] = now;

    // Clean up old entries (older than 7 days)
    // Reduce size to max 50 recent entries to prevent cookie overflow
    const sortedSlugs = Object.keys(viewedBlogs).sort((a, b) => viewedBlogs[b] - viewedBlogs[a]);

    // Keep only top 50 recents + remove expired
    const keptSlugs = [];
    for (const key of sortedSlugs) {
      if (now - viewedBlogs[key] <= VIEW_EXPIRY_MS) {
        keptSlugs.push(key);
      }
    }

    // If more than 50, truncate
    if (keptSlugs.length > 50) {
      keptSlugs.length = 50;
    }

    // Rebuild object
    const newViewedBlogs = {};
    keptSlugs.forEach(key => {
      newViewedBlogs[key] = viewedBlogs[key];
    });

    viewedBlogs = newViewedBlogs;

    // Set the updated cookie
    const response = NextResponse.json({
      views: blog.views,
      incremented: true
    });

    response.cookies.set(VIEW_COOKIE_NAME, JSON.stringify(viewedBlogs), {
      maxAge: VIEW_EXPIRY_MS / 1000, // Convert to seconds
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}
