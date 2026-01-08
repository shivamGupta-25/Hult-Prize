import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-session')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const isValid = await verifySession(token)

    if (!isValid) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
