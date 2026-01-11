import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { deleteAllBlogs } from '@/services/blogService';

export async function DELETE() {
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

    const result = await deleteAllBlogs();

    return NextResponse.json({
      message: 'All blog data deleted successfully',
      deletedCount: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting all blogs:', error);
    return NextResponse.json(
      { error: 'Failed to delete all blog data' },
      { status: 500 }
    );
  }
}
