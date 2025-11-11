'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const ok = await register(name, username, password)
      if (ok) {
        // Redirect to login
        window.location.href = '/login'
      } else {
        alert('Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Erreur lors de l\'inscription')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
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
          <button type="submit" className="w-full bg-red-600 py-2 rounded mb-4">S'inscrire</button>
        </form>
        <p className="text-center">
          Déjà un compte ? <Link href="/login" className="text-red-400">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}