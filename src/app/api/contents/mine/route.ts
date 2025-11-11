import { NextResponse } from 'next/server'
import { getContentsCollection } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  // Skip database operations during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ contents: [] }, { status: 200 })
  }

  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentsCollection = await getContentsCollection()
    const contents = await contentsCollection.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ contents }, { status: 200 })
  } catch (error) {
    console.error('Get my contents error:', error)
    return NextResponse.json({ contents: [] }, { status: 200 })
  }
}
