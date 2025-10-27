'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import EnvelopeCard from '@/components/EnvelopeCard'

interface TemplatePageClientProps {
  templateId: string
}

export default function TemplatePageClient({ templateId }: TemplatePageClientProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [template, setTemplate] = useState<any>(null)

  useEffect(() => {
    // 템플릿 JSON 로드 (public 폴더 기준)
    console.log('🔍 Fetching template:', templateId)
    fetch(`/templates/${templateId}.json`)
      .then(res => {
        console.log('📡 Fetch response status:', res.status, res.ok)
        if (!res.ok) {
          throw new Error(`Failed to load template: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('✅ Loaded template:', templateId, data)
        console.log('📦 Template components:', data?.components)
        setTemplate(data)
      })
      .catch(err => {
        console.error('❌ Failed to load template:', err)
        setTemplate(null)
      })
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
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0'
    }}>
      <div style={{ width: '100%', maxWidth: '672px' }}>
        <EnvelopeCard
          isAnimating={isAnimating}
          onAnimationStart={() => setIsAnimating(true)}
          templateId={templateId}
          templateData={template}
        />
      </div>
    </main>
  )
}
