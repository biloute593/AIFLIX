'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const ok = await login(username, password)
      if (ok) {
        window.location.href = '/browse'
      } else {
        alert('Email ou mot de passe invalide')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Erreur lors de la connexion')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button type="submit" className="w-full bg-red-600 py-2 rounded mb-4">Se connecter</button>
        </form>
        <p className="text-center">
          Pas de compte ? <Link href="/register" className="text-red-400">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}