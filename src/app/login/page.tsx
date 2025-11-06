'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store session (simplified)
        localStorage.setItem('session', JSON.stringify(data.session))
        window.location.href = '/browse'
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de la connexion')
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
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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