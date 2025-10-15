'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ServerDrivenUIRenderer from '@/lib/server-driven-ui/renderer'
import type { PageSchema } from '@/types/server-driven-ui/schema'

export default function TemplatePage() {
  const params = useParams()
  const templateId = params?.id as string

  const [schema, setSchema] = useState<PageSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true)
        const response = await fetch(`/api/templates/${templateId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.statusText}`)
        }

        const data = await response.json()
        setSchema(data)
      } catch (err) {
        console.error('Template fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      fetchTemplate()
    }
  }, [templateId])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fefbf6'
      }}>
        <div style={{
          fontSize: '16px',
          color: '#666'
        }}>
          로딩 중...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fefbf6'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#d32f2f'
        }}>
          <h2>오류 발생</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!schema) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fefbf6'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <h2>템플릿을 찾을 수 없습니다</h2>
        </div>
      </div>
    )
  }

  return <ServerDrivenUIRenderer schema={schema} />
}
