'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getProfile } from './api'

interface User {
  id: string
  name: string
  age?: number
  sex?: string
  profession?: string
  hobbies?: string[]
  locale?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await getProfile(userId)
      console.log(response.data);
      setUser(response.data)
    } catch (error) {
      console.error('Failed to get user profile:', error)
      localStorage.removeItem('userId')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
