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

    await db.collection('page_access').add({
      userId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: 'Access registered successfully' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error registering access:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
