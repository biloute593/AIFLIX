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

    // Support two upload payloads:
    // 1) multipart/form-data with file (browser form)
    // 2) application/json with { title, description, type, fileName, fileType, fileBase64 }
    let title: string | null = null
    let description: string | null = null
    let type: string | null = null
    let fileName: string | null = null
    let fileType: string | null = null
    let buffer: Buffer | null = null

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      title = body.title || null
      description = body.description || null
      type = body.type || null
      fileName = body.fileName || body.file_name || 'upload.bin'
      fileType = body.fileType || body.file_type || 'application/octet-stream'
      if (!body.fileBase64) {
        return NextResponse.json({ error: 'No fileBase64 provided' }, { status: 400 })
      }
      buffer = Buffer.from(body.fileBase64, 'base64')
    } else {
      const formData = await request.formData()
      title = (formData.get('title') as string) || null
      description = (formData.get('description') as string) || null
      type = (formData.get('type') as string) || null
      const file = formData.get('file') as File
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      fileName = file.name
      fileType = file.type || 'application/octet-stream'
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    }

    const containerClient = getContainerClient()
    if (!containerClient) {
      // allow DB-only fallback (container missing) - we'll handle below
      console.warn('No container client available, will attempt DB fallback')
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

    // Upload to Azure Blob Storage (primary path) with DB fallback for small files
    if (!buffer) {
      return NextResponse.json({ error: 'No file buffer' }, { status: 400 })
    }

    let videoUrl: string | null = null
    let attemptedBlob = false
    if (containerClient) {
      try {
        const blobName = `${Date.now()}-${fileName}`
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        attemptedBlob = true

        // Use uploadData when available for server compatibility
        if (typeof blockBlobClient.uploadData === 'function') {
          await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: {
              blobContentType: fileType,
            },
          })
        } else {
          // Fallback to upload (older API)
          await blockBlobClient.upload(buffer, buffer.length, {
            blobHTTPHeaders: {
              blobContentType: fileType,
            },
          })
        }

        videoUrl = blockBlobClient.url
      } catch (uploadErr) {
        console.error('Blob upload failed:', (uploadErr as any)?.stack || uploadErr)
      }
    }

    // If blob upload wasn't possible or failed, fallback to DB for small files
    if (!videoUrl) {
      const MAX_DB_STORE_BYTES = 5 * 1024 * 1024 // 5 MB
      if (buffer.length <= MAX_DB_STORE_BYTES) {
        const b64 = buffer.toString('base64')
        videoUrl = `data:${fileType};base64,${b64}`
        console.warn('Using DB fallback storage for uploaded file (data URI)')
      } else {
        if (!attemptedBlob) {
          console.error('Storage container not configured and file too large for fallback:', buffer.length)
          return NextResponse.json({ error: 'Storage unavailable and file too large for fallback' }, { status: 507 })
        }
        console.error('Blob upload failed and file too large for DB fallback:', buffer.length)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }
    }

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