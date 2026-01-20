'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface User {
  email: string
  name: string
  picture?: string
  hd?: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {
      const savedUser = localStorage.getItem('user')

      if (savedUser) {
        try {
          const response = await fetch('/api/auth/verify')
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setUser(data.data.user)
            } else {
              logout()
            }
          } else {
            logout()
          }
        } catch (error) {
          console.error('인증 확인 실패:', error)
          logout()
        }
      }
      setLoading(false)
    }

    verifyAuth()
  }, [logout])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
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
