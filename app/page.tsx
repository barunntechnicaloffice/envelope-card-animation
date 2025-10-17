'use client'

import { useState } from 'react'
import Link from 'next/link'
import EnvelopeCard from '@/components/EnvelopeCard'

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundImage: 'url(/assets/wedding-card-001/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#fefbf6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      position: 'relative'
    }}>
      {/* 템플릿 목록 링크 */}
      <Link
        href="/templates"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#60c0ba',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        템플릿 선택
      </Link>

      <div style={{ width: '100%', maxWidth: '672px' }}>
        <EnvelopeCard isAnimating={isAnimating} onAnimationStart={() => setIsAnimating(true)} />
      </div>
    </main>
  )
}