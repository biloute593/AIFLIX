'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  username: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (name: string, username: string, password: string) => Promise<boolean>
  logout: () => void
  getAuthHeaders: () => Record<string, string>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  getAuthHeaders: () => ({}),
})

export function useAuth() {
  return useContext(AuthContext)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedToken = localStorage.getItem('aiflix-token')
    const savedUser = localStorage.getItem('aiflix-user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const userData = { id: data.user.id, username: data.user.username, name: data.user.name }
        setUser(userData)
        setToken(data.token)
        localStorage.setItem('aiflix-user', JSON.stringify(userData))
        localStorage.setItem('aiflix-token', data.token)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (name: string, username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // After registration, user needs to login to get token
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('aiflix-user')
    localStorage.removeItem('aiflix-token')
  }

  const getAuthHeaders = (): Record<string, string> => {
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  )
}