import { NextResponse } from 'next/server'
import { contentsContainer } from '@/lib/azure'

export async function GET() {
  try {
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