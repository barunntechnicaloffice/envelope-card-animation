'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import EnvelopeCard from '@/components/EnvelopeCard'

// Static export를 위한 generateStaticParams
export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' }
  ]
}

export default function TemplatePage() {
  const params = useParams()
  const templateId = params.id as string
  const [isAnimating, setIsAnimating] = useState(false)
  const [template, setTemplate] = useState<any>(null)

  useEffect(() => {
    // 템플릿 JSON 로드
    fetch(`/templates/${templateId}.json`)
      .then(res => res.json())
      .then(data => setTemplate(data))
      .catch(err => console.error('Failed to load template:', err))
  }, [templateId])

  if (!template) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>템플릿 로딩중...</p>
      </div>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundImage: template.common?.background ? `url(${template.common.background})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#fefbf6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* 헤더 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <Link
          href="/templates"
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#333',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          ← 템플릿 목록
        </Link>
        <h2 style={{
          margin: 0,
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 600,
          color: '#333',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {template.name}
        </h2>
      </div>

      {/* 봉투 카드 */}
      <div style={{ width: '100%', maxWidth: '672px', marginTop: '80px' }}>
        <EnvelopeCard
          isAnimating={isAnimating}
          onAnimationStart={() => setIsAnimating(true)}
          templateId={templateId}
        />
      </div>

      {/* 하단 정보 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        zIndex: 10
      }}>
        <div style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          템플릿 ID: {template.id}
        </div>
        <div style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          버전: {template.version}
        </div>
      </div>
    </main>
  )
}
