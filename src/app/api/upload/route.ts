import { NextRequest, NextResponse } from 'next/server'
import { getContentsContainer, getContainerClient } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Prevent execution during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
  }

  try {
    // Verify JWT token
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const containerClient = getContainerClient()
    if (!containerClient) {
      return NextResponse.json({ error: 'Storage connection failed' }, { status: 500 })
    }

    // Upload to Azure Blob Storage
    const blobName = `${Date.now()}-${file.name}`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    })

    const videoUrl = blockBlobClient.url

    const contentsContainer = getContentsContainer()
    if (!contentsContainer) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Save to Cosmos DB
    const content = {
      id: Date.now().toString(),
      title,
      description,
      type,
      videoUrl,
      userId: user.userId,
      createdAt: new Date().toISOString()
    }

    await contentsContainer.items.create(content)

    return NextResponse.json({ message: 'Content uploaded successfully', content }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}