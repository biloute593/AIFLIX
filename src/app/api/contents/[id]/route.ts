import { NextResponse } from 'next/server'
import { getContentsCollection } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
  }

  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const contentsCollection = await getContentsCollection()
    const existing = await contentsCollection.findOne({ _id: new ObjectId(id) })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (existing.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await contentsCollection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (error) {
    console.error('Delete content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
