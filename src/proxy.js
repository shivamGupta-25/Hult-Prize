import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET
)

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-session')?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verify the token
      await jwtVerify(token, SECRET_KEY)
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
