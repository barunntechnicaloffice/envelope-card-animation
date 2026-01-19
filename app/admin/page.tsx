'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  templates: {
    total: number
    published: number
    draft: number
  }
  assets: {
    totalFiles: number
    totalSize: string
    folderCount: number
  }
  recentTemplates: Array<{
    id: string
    name: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    templates: { total: 0, published: 0, draft: 0 },
    assets: { totalFiles: 0, totalSize: '0 B', folderCount: 0 },
    recentTemplates: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  async function loadDashboardStats() {
    try {
      // 템플릿 통계 로드
      const templatesRes = await fetch('/api/templates?list=true')
      let templateStats = { total: 0, published: 0, draft: 0 }
      let recentTemplates: Array<{ id: string, name: string }> = []

      if (templatesRes.ok) {
        const data = await templatesRes.json()
        const templates = data.templates || []
        templateStats = {
          total: templates.length,
          published: templates.filter((t: { status: string }) => t.status === 'published').length,
          draft: templates.filter((t: { status: string }) => t.status === 'draft').length
        }
        recentTemplates = templates.slice(0, 5).map((t: { id: string, name: string }) => ({
          id: t.id,
          name: t.name
        }))
      }

      // 에셋 통계 로드
      const assetsRes = await fetch('/api/assets')
      let assetStats = { totalFiles: 0, totalSize: '0 B', folderCount: 0 }

      if (assetsRes.ok) {
        const data = await assetsRes.json()
        assetStats = {
          totalFiles: data.totalFiles || 0,
          totalSize: data.totalSizeFormatted || '0 B',
          folderCount: data.folderCount || 0
        }
      }

      setStats({
        templates: templateStats,
        assets: assetStats,
        recentTemplates
      })
    } catch (err) {
      console.error('Failed to load dashboard stats:', err)
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">웨딩 카드 템플릿 관리 시스템</p>
        </div>
        <button
          onClick={() => {
            setLoading(true)
            loadDashboardStats()
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          새로고침
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="전체 템플릿"
          value={loading ? '-' : stats.templates.total.toString()}
          icon="📑"
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="게시됨"
          value={loading ? '-' : stats.templates.published.toString()}
          icon="✅"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="임시저장"
          value={loading ? '-' : stats.templates.draft.toString()}
          icon="📝"
          color="bg-yellow-50 text-yellow-700"
        />
        <StatCard
          title="총 에셋"
          value={loading ? '-' : `${stats.assets.totalFiles}`}
          subtitle={loading ? '' : stats.assets.totalSize}
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

      {/* 최근 업데이트된 템플릿 & 에셋 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">최근 템플릿</h2>
            <Link href="/admin/templates" className="text-sm text-blue-600 hover:underline">
              전체 보기
            </Link>
          </div>
          {loading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : stats.recentTemplates.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p>템플릿이 없습니다</p>
              <Link href="/admin/templates/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                새 템플릿 만들기
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.recentTemplates.map((template) => (
                <li key={template.id}>
                  <Link
                    href={`/admin/templates/${template.id}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg">💌</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-700 block truncate">{template.name}</span>
                      <span className="text-xs text-gray-400">{template.id}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">에셋 요약</h2>
            <Link href="/admin/assets" className="text-sm text-blue-600 hover:underline">
              관리하기
            </Link>
          </div>
          {loading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">총 폴더 수</span>
                <span className="font-semibold text-gray-900">{stats.assets.folderCount}개</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">총 파일 수</span>
                <span className="font-semibold text-gray-900">{stats.assets.totalFiles}개</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">총 용량</span>
                <span className="font-semibold text-gray-900">{stats.assets.totalSize}</span>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">개발 가이드</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <span>📐</span>
                <span>템플릿 크기: 335×515px</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔄</span>
                <span>좌표 변환: Figma → BG 상대 좌표</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✨</span>
                <span>SDUI 패턴 사용</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color
}: {
  title: string
  value: string
  subtitle?: string
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
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
