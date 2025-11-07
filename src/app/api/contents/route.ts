import { NextResponse } from 'next/server'
import { getContentsContainer } from '@/lib/azure'

export async function GET() {
  // Skip database operations during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ contents: [] }, { status: 200 })
  }

  try {
    const contentsContainer = getContentsContainer()
    if (!contentsContainer) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { resources: contents } = await contentsContainer.items
      .query({
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
      })
      .fetchAll()

    return NextResponse.json({ contents }, { status: 200 })
  } catch (error) {
    console.error('Get contents error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}