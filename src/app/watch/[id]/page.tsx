'use client'

import { notFound } from 'next/navigation'
import ReactPlayer from 'react-player'

interface WatchPageProps {
  params: {
    id: string
  }
}

async function getContent(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/contents`, {
      cache: 'no-store'
    })
    if (!response.ok) return null

    const data = await response.json()
    return data.contents.find((c: any) => c.id === id)
  } catch (error) {
    return null
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const content = await getContent(params.id)

  if (!content) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
        <p className="text-gray-300 mb-8">{content.description}</p>
        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
          <ReactPlayer
            url={content.videoUrl}
            controls
            width="100%"
            height="100%"
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}