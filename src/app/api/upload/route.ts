import { NextRequest, NextResponse } from 'next/server'
import { contentsContainer, containerClient } from '@/lib/azure'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
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

    // Save to Cosmos DB
    const content = {
      id: Date.now().toString(),
      title,
      description,
      type,
      videoUrl,
      userId,
      createdAt: new Date().toISOString()
    }

    await contentsContainer.items.create(content)

    return NextResponse.json({ message: 'Content uploaded successfully', content }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}