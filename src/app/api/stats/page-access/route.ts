import { db } from '@/lib/firebase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      )
    }

    const res = await db.collection('page_access').add({
      userId,
      timestamp: new Date().toISOString(),
    })

    if (!res) throw new Error('Failed to register access')

    return NextResponse.json(
      { message: 'Access registered successfully' },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error${error}` },
      { status: 500 },
    )
  }
}
