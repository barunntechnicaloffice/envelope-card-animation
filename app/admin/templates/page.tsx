'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface TemplateInfo {
  id: string
  name: string
  version: string
  thumbnail?: string
  status: 'published' | 'draft' | 'error'
  hasLayout: boolean
}

export default function TemplatesListPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [duplicating, setDuplicating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    setLoading(true)

    try {
      // API로 실제 존재하는 템플릿 목록 조회
      const res = await fetch('/api/templates?list=true')
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      } else {
        setTemplates([])
      }
    } catch {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  // 템플릿 삭제
  async function handleDelete(templateId: string) {
    const confirmed = confirm(
      `정말로 "${templateId}" 템플릿을 삭제하시겠습니까?\n\n` +
      `⚠️ 이 작업은 되돌릴 수 없습니다.\n` +
      `- JSON 파일이 삭제됩니다\n` +
      `- 에셋 폴더가 삭제됩니다`
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      const response = await fetch('/api/templates/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || '삭제에 실패했습니다.')
        return
      }

      alert('템플릿이 삭제되었습니다.')

      // 목록 새로고침
      loadTemplates()
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  // 템플릿 복제
  async function handleDuplicate(templateId: string) {
    // 새 템플릿 ID 생성 (다음 번호)
    const existingNumbers = templates
      .map(t => {
        const match = t.id.match(/wedding-card-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
      .filter(n => n > 0)

    const nextNumber = Math.max(...existingNumbers, 0) + 1
    const newTemplateId = `wedding-card-${String(nextNumber).padStart(3, '0')}`

    const newName = prompt(
      `새 템플릿 정보를 입력하세요.\n\n복제할 템플릿: ${templateId}\n새 템플릿 ID: ${newTemplateId}`,
      `${templates.find(t => t.id === templateId)?.name || '템플릿'} (복사본)`
    )

    if (!newName) return

    setDuplicating(true)

    try {
      const response = await fetch('/api/templates/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTemplateId: templateId,
          newTemplateId,
          newName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || '복제에 실패했습니다.')
        return
      }

      alert(`템플릿이 복제되었습니다!\n새 ID: ${newTemplateId}`)

      // 편집 페이지로 이동
      router.push(`/admin/templates/${newTemplateId}`)
    } catch {
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setDuplicating(false)
    }
  }

  const filteredTemplates = templates.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: templates.length,
    published: templates.filter(t => t.status === 'published').length,
    draft: templates.filter(t => t.status === 'draft').length,
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">템플릿 관리</h1>
          <p className="text-gray-600 mt-1">
            전체 {stats.total}개 · 게시됨 {stats.published}개 · 임시저장 {stats.draft}개
          </p>
        </div>
        <Link
          href="/admin/templates/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span> 새 템플릿
        </Link>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? '전체' : f === 'published' ? '게시됨' : '임시저장'}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="템플릿 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 복제/삭제 중 오버레이 */}
      {(duplicating || deleting) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <span className="animate-spin text-2xl">⏳</span>
            <span className="text-gray-700">
              {duplicating ? '템플릿 복제 중...' : '템플릿 삭제 중...'}
            </span>
          </div>
        </div>
      )}

      {/* 템플릿 그리드 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">템플릿 로딩 중...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TemplateCard({
  template,
  onDuplicate,
  onDelete
}: {
  template: TemplateInfo
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDuplicate(template.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete(template.id)
  }

  return (
    <Link
      href={`/admin/templates/${template.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
    >
      {/* 썸네일 */}
      <div className="aspect-[335/515] bg-gray-100 relative overflow-hidden">
        {template.thumbnail && !imgError ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-4xl">💌</span>
          </div>
        )}

        {/* 상태 뱃지 */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            template.status === 'published'
              ? 'bg-green-100 text-green-700'
              : template.status === 'draft'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {template.status === 'published' ? '게시됨' : template.status === 'draft' ? '임시저장' : '오류'}
          </span>
        </div>

        {/* SDUI 뱃지 */}
        {template.hasLayout && (
          <div className="absolute top-2 left-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              SDUI
            </span>
          </div>
        )}

        {/* 복제/삭제 버튼 (호버 시 표시) */}
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            className="px-2 py-1 bg-white/90 hover:bg-white text-gray-700 rounded-lg text-xs font-medium shadow-sm border border-gray-200"
            title="템플릿 복제"
          >
            📋 복제
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium shadow-sm border border-red-200"
            title="템플릿 삭제"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm truncate">{template.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">{template.id}</span>
          <span className="text-xs text-gray-400">v{template.version}</span>
        </div>
      </div>
    </Link>
  )
}
