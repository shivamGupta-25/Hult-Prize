import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

// POST - Handle image upload (base64 encoding for simplicity)
export async function POST(request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-session')?.value;
    const isVerified = await verifySession(token);

    if (!isVerified) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // For production, you might want to:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Validate file size
    // 3. Process/resize images
    // For now, we'll return the base64 data as-is

    return NextResponse.json({
      url: image,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
