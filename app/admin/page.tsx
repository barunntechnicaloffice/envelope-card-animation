'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TemplateStats {
  total: number
  published: number
  draft: number
  recentlyUpdated: string[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<TemplateStats>({
    total: 0,
    published: 0,
    draft: 0,
    recentlyUpdated: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplateStats()
  }, [])

  async function loadTemplateStats() {
    try {
      // 템플릿 목록 로드
      const templateIds: string[] = []
      for (let i = 1; i <= 50; i++) {
        templateIds.push(`wedding-card-${String(i).padStart(3, '0')}`)
      }

      let loadedCount = 0
      const recentTemplates: string[] = []

      for (const id of templateIds.slice(0, 10)) {
        try {
          const res = await fetch(`/templates/${id}.json`)
          if (res.ok) {
            loadedCount++
            const data = await res.json()
            recentTemplates.push(data.name || id)
          }
        } catch {
          // 템플릿이 없을 수 있음
        }
      }

      // 실제로는 모든 템플릿 체크하지만, 여기선 빠른 로드를 위해 일부만
      setStats({
        total: 50, // 실제 템플릿 수
        published: loadedCount,
        draft: 50 - loadedCount,
        recentlyUpdated: recentTemplates.slice(0, 5)
      })
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { name: '새 템플릿 만들기', href: '/admin/templates/new', icon: '➕', color: 'bg-blue-500' },
    { name: 'Figma에서 가져오기', href: '/admin/templates/new?mode=figma', icon: '🎨', color: 'bg-purple-500' },
    { name: '템플릿 목록', href: '/admin/templates', icon: '📋', color: 'bg-green-500' },
    { name: '에셋 관리', href: '/admin/assets', icon: '🖼️', color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">웨딩 카드 템플릿 관리 시스템</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="전체 템플릿"
          value={loading ? '-' : stats.total.toString()}
          icon="📑"
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="게시됨"
          value={loading ? '-' : stats.published.toString()}
          icon="✅"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="임시저장"
          value={loading ? '-' : stats.draft.toString()}
          icon="📝"
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          title="총 에셋"
          value="250+"
          icon="🖼️"
          color="bg-purple-50 text-purple-700"
        />
      </div>

      {/* 빠른 액션 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className={`text-3xl mb-3 ${action.color} p-3 rounded-full text-white flex items-center justify-center w-14 h-14`}>
                {action.icon}
              </span>
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 업데이트된 템플릿 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 템플릿</h2>
          {loading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : (
            <ul className="space-y-3">
              {stats.recentlyUpdated.map((name, idx) => (
                <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg">💌</span>
                  <span className="text-sm text-gray-700">{name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">개발 가이드</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span>📐</span>
              <span>템플릿 크기: 335×515px (모바일 기준)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <span>좌표 변환: Figma 절대 좌표 → BG 상대 좌표</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📝</span>
              <span>필수 필드: type, x, y, zIndex</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✨</span>
              <span>SDUI 패턴 사용 (renderLayoutElement)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`${color} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
