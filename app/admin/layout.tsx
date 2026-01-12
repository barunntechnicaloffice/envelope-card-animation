'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: '대시보드', href: '/admin', icon: '📊' },
  { name: '템플릿 관리', href: '/admin/templates', icon: '🎨' },
  { name: '새 템플릿', href: '/admin/templates/new', icon: '➕' },
  { name: '에셋 관리', href: '/admin/assets', icon: '🖼️' },
  { name: '설정', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                💌 Template Admin
              </Link>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                v1.0.0
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <span>🔗</span> 사이트 보기
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-64px)] border-r border-gray-200 flex flex-col">
          <nav className="p-4 space-y-1 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* 하단 정보 */}
          <div className="p-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                템플릿 수: <span className="font-semibold text-gray-700">50개</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                마지막 업데이트: <span className="font-semibold text-gray-700">오늘</span>
              </p>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
