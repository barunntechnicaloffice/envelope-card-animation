'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginPage } from '@/components/auth/LoginPage'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <LoginPage />
}
