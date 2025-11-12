import { NextRequest, NextResponse } from 'next/server'
import { getContentsCollection, getContainerClient } from '@/lib/azure'
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

    // Ensure container exists (create if missing) - helps avoid upload errors when container not created
    try {
      if (typeof containerClient.createIfNotExists === 'function') {
        await containerClient.createIfNotExists()
      }
    } catch (err) {
      console.error('Container ensure error:', (err as any)?.stack || err)
      return NextResponse.json({ error: 'Storage connection failed' }, { status: 500 })
    }

    // Upload to Azure Blob Storage
    const blobName = `${Date.now()}-${file.name}`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use uploadData which works with Uint8Array/Buffer and is simpler in server environments
    if (typeof blockBlobClient.uploadData === 'function') {
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
      })
    } else {
      // Fallback to upload (older API)
      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
      })
    }

    const videoUrl = blockBlobClient.url

    const contentsCollection = await getContentsCollection()

    // Save to MongoDB
    const content = {
      title,
      description,
      type,
      videoUrl,
      userId: user.userId,
      createdAt: new Date().toISOString()
    }

    const result = await contentsCollection.insertOne(content)

    return NextResponse.json({ message: 'Content uploaded successfully', contentId: result.insertedId }, { status: 201 })
  } catch (error) {
    // Log full stack for debugging
    console.error('Upload error:', (error as any)?.stack || error)

    // If DEBUG_UPLOAD env var is set OR request includes X-Debug: true header, return error details in response to aid debugging (temporary)
    try {
      const shouldDebug = process.env.DEBUG_UPLOAD === 'true' || request.headers.get('x-debug') === 'true'
      if (shouldDebug) {
        const msg = (error as any)?.message || String(error)
        const stack = (error as any)?.stack || null
        return NextResponse.json({ error: 'Internal server error', details: msg, stack }, { status: 500 })
      }
    } catch (hdrErr) {
      // ignore header read errors
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}