import { NextResponse } from 'next/server'
import { getContentsCollection } from '@/lib/azure'

export async function GET() {
  // Skip database operations during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ contents: [] }, { status: 200 })
  }

  try {
    const contentsCollection = await getContentsCollection()

    const contents = await contentsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ contents }, { status: 200 })
  } catch (error) {
    console.error('Get contents error:', error)
    // Return empty array instead of error during build
    return NextResponse.json({ contents: [] }, { status: 200 })
  }
}