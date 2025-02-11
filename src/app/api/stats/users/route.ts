import { db } from '@/lib/firebase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const usersRef = db.collection('users')
    const snapshot = await usersRef.count().get()

    if (!snapshot.data) throw new Error('No matching documents.')

    return NextResponse.json(
      { totalUsers: snapshot.data().count },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 },
    )
  }
}
