'use client'

import { useState } from 'react'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('movie')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const session = JSON.parse(localStorage.getItem('session') || '{}')
    if (!session.userId) {
      alert('Veuillez vous connecter')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('type', type)
    formData.append('file', file)
    formData.append('userId', session.userId)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Contenu uploadé avec succès!')
        window.location.href = '/browse'
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Uploader du contenu</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Titre</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block mb-2">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="movie">Film</option>
            <option value="series">Série</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="file" className="block mb-2">Fichier vidéo</label>
          <input
            type="file"
            id="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-red-600 py-2 rounded">Uploader</button>
      </form>
    </div>
  )
}