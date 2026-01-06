'use client'

import { useEffect, useState, useCallback, use } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Monaco Editor를 동적으로 로드 (SSR 비활성화)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface TemplateData {
  id: string
  version: string
  name: string
  category: string
  thumbnail?: string
  figmaNodeId?: string
  set?: {
    envelope?: Record<string, string>
    page?: Record<string, string>
    cards?: Record<string, string>
  }
  layout?: Record<string, unknown>
  data?: Record<string, unknown>
  components?: Array<Record<string, unknown>>
}

export default function TemplateEditClient({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id: templateId } = use(params)

  const [templateData, setTemplateData] = useState<TemplateData | null>(null)
  const [jsonString, setJsonString] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'info'>('editor')

  useEffect(() => {
    loadTemplate()
  }, [templateId])

  async function loadTemplate() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/templates/${templateId}.json`)
      if (res.ok) {
        const data = await res.json()
        setTemplateData(data)
        setJsonString(JSON.stringify(data, null, 2))
      } else {
        // 새 템플릿 생성
        const newTemplate: TemplateData = {
          id: templateId,
          version: '1.0.0',
          name: `웨딩 카드 ${templateId.split('-').pop()}`,
          category: '웨딩',
          layout: {
            baseSize: { width: 335, height: 515 }
          },
          data: {
            wedding: {
              groom: '신랑 이름',
              bride: '신부 이름',
              date: '2025년 1월 1일',
              venue: '장소',
              photo: '/assets/common/photo.png'
            }
          },
          components: []
        }
        setTemplateData(newTemplate)
        setJsonString(JSON.stringify(newTemplate, null, 2))
      }
    } catch (err) {
      setError('템플릿을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleJsonChange = useCallback((value: string | undefined) => {
    if (!value) return
    setJsonString(value)
    setJsonError(null)

    try {
      const parsed = JSON.parse(value)
      setTemplateData(parsed)
    } catch {
      setJsonError('유효하지 않은 JSON 형식입니다.')
    }
  }, [])

  async function handleSave() {
    if (jsonError) {
      alert('JSON 오류를 먼저 수정해주세요.')
      return
    }

    setSaving(true)
    try {
      // 실제 저장은 API 엔드포인트가 필요함
      // 여기서는 다운로드로 대체
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${templateId}.json`
      a.click()
      URL.revokeObjectURL(url)
      alert('JSON 파일이 다운로드되었습니다. /public/templates/ 폴더에 저장해주세요.')
    } finally {
      setSaving(false)
    }
  }

  async function handleCopyToClipboard() {
    try {
      await navigator.clipboard.writeText(jsonString)
      alert('클립보드에 복사되었습니다.')
    } catch {
      alert('복사에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">템플릿 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/templates"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← 뒤로
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {templateData?.name || templateId}
            </h1>
            <p className="text-gray-600 mt-1">{templateId} · v{templateData?.version}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📋 복사
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!jsonError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '💾 저장'}
          </button>
          <Link
            href={`/templates/${templateId}`}
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔗 미리보기
          </Link>
        </div>
      </div>

      {/* 에러 표시 */}
      {(error || jsonError) && (
        <div className={`p-4 rounded-lg ${jsonError ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
          {error || jsonError}
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['editor', 'preview', 'info'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'editor' ? '📝 JSON 편집' : tab === 'preview' ? '👁️ 미리보기' : 'ℹ️ 정보'}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-[600px]">
            <MonacoEditor
              height="100%"
              language="json"
              theme="vs-light"
              value={jsonString}
              onChange={handleJsonChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="p-8 flex justify-center">
            <div
              className="relative bg-gray-100 rounded-lg overflow-hidden"
              style={{ width: 335, height: 515 }}
            >
              <iframe
                src={`/templates/${templateId}`}
                className="w-full h-full border-0"
                title="Template Preview"
              />
            </div>
          </div>
        )}

        {activeTab === 'info' && templateData && (
          <div className="p-6 space-y-6">
            <InfoSection title="기본 정보">
              <InfoItem label="ID" value={templateData.id} />
              <InfoItem label="이름" value={templateData.name} />
              <InfoItem label="버전" value={templateData.version} />
              <InfoItem label="카테고리" value={templateData.category} />
              <InfoItem label="Figma Node ID" value={templateData.figmaNodeId || '-'} />
            </InfoSection>

            <InfoSection title="레이아웃">
              <InfoItem
                label="Base Size"
                value={templateData.layout?.baseSize
                  ? `${(templateData.layout.baseSize as { width: number; height: number }).width}×${(templateData.layout.baseSize as { width: number; height: number }).height}px`
                  : '-'}
              />
              <InfoItem
                label="요소 수"
                value={templateData.layout
                  ? `${Object.keys(templateData.layout).filter(k => k !== 'baseSize').length}개`
                  : '0개'}
              />
              <InfoItem
                label="SDUI 지원"
                value={templateData.layout ? '✅ 예' : '❌ 아니오'}
              />
            </InfoSection>

            <InfoSection title="에셋">
              <InfoItem
                label="봉투 패턴"
                value={templateData.set?.envelope?.pattern || '-'}
              />
              <InfoItem
                label="카드 배경"
                value={templateData.set?.cards?.background || '-'}
              />
              <InfoItem
                label="페이지 배경"
                value={templateData.set?.page?.background || '-'}
              />
            </InfoSection>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 font-mono">{value}</span>
    </div>
  )
}
