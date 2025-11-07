'use client'

import ContentCard from '@/components/ContentCard'
import { useEffect, useState } from 'react'

interface Content {
  id: string
  title: string
  description: string
  type: 'movie' | 'series'
  videoUrl: string
}

export default function Browse() {
  const [contents, setContents] = useState<Content[]>([])

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/contents')
      if (response.ok) {
        const data = await response.json()
        setContents(data.contents)
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Explorer le contenu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <ContentCard key={content.id} {...content} />
        ))}
      </div>
    </div>
  )
}