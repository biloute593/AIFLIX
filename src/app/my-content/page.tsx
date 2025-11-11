'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type Content = {
  _id: string
  title: string
  description?: string
  videoUrl: string
  createdAt: string
}

export default function MyContentPage() {
  const { token } = useAuth()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetch('/api/contents/mine', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setContents(data.contents || [])
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contenu ?')) return
    try {
      const res = await fetch(`/api/contents/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        setContents((c) => c.filter((it) => it._id !== id))
      } else {
        const d = await res.json()
        alert(d.error || 'Erreur suppression')
      }
    } catch (err) {
      console.error(err)
      alert('Erreur suppression')
    }
  }

  if (loading) return <div className="p-8 text-white">Chargement...</div>
  if (!token) return <div className="p-8 text-white">Veuillez vous connecter pour voir vos contenus.</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Mes contenus</h1>
      {contents.length === 0 && <p>Aucun contenu trouvé.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contents.map((c) => (
          <div key={c._id} className="bg-gray-800 p-4 rounded">
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-300">{c.description}</p>
            <div className="mt-3 flex items-center space-x-3">
              <a href={c.videoUrl} target="_blank" rel="noreferrer" className="bg-blue-600 px-3 py-1 rounded">Télécharger</a>
              <button onClick={() => toggleFavorite(c._id)} className="bg-yellow-600 px-3 py-1 rounded">{favorites[c._id] ? '♥ Favori' : '♡ Favori'}</button>
              <a href={`/upload?edit=${c._id}`} className="bg-green-600 px-3 py-1 rounded">Modifier</a>
              <button onClick={() => handleDelete(c._id)} className="bg-red-600 px-3 py-1 rounded">Supprimer</button>
            </div>
            <div className="text-xs text-gray-400 mt-2">Publié le {new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
