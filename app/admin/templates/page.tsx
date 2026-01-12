'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface TemplateInfo {
  id: string
  name: string
  version: string
  thumbnail?: string
  status: 'published' | 'draft' | 'error'
  hasLayout: boolean
}

export default function TemplatesListPage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [searchQuery, setSearchQuery] = useState('')

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

      {/* 템플릿 그리드 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">템플릿 로딩 중...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}

function TemplateCard({ template }: { template: TemplateInfo }) {
  const [imgError, setImgError] = useState(false)

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
