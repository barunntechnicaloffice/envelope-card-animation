'use client'

import { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function LoginPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { login } = useAuth()

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">설정 오류</h1>
          <p className="text-red-600">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.
          </p>
        </div>
      </div>
    )
  }

  const handleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    if (credentialResponse.credential) {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/auth/verify-google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        })

        const data = await response.json()

        if (data.success) {
          login(data.data.user)
          router.push('/admin')
        } else {
          setError(data.message || '인증에 실패했습니다.')
        }
      } catch (error) {
        console.error('인증 오류:', error)
        setError('인증에 실패했습니다. 다시 시도해주세요.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleLoginError = () => {
    setError('로그인에 실패했습니다. 다시 시도해주세요.')
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-2">
            청첩장 템플릿 어드민
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Google 계정으로 로그인해주세요
          </p>

          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">인증 중...</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                useOneTap={false}
                text="signin_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            🔒 인증된 사용자만 접근할 수 있습니다
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
