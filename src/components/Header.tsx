"use client"

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">AIFlix</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/browse" className="text-white hover:text-red-400">Explorer</Link>
          <Link href="/upload" className="text-white hover:text-red-400">Uploader</Link>
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-white">{user.username}</span>
              <Link href="/my-content" className="text-white hover:text-red-400">Mes contenus</Link>
              <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Déconnexion</button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="text-white hover:text-red-400">Connexion</Link>
              <Link href="/register" className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700">S'inscrire</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
