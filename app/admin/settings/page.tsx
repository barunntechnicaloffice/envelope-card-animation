'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [figmaApiKey, setFigmaApiKey] = useState('')
  const [defaultBaseSize, setDefaultBaseSize] = useState({ width: 335, height: 515 })
  const [autoBackup, setAutoBackup] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-1">어드민 환경 설정</p>
      </div>

      {/* Figma 설정 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🎨 Figma 연동</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Figma API Key
            </label>
            <input
              type="password"
              value={figmaApiKey}
              onChange={(e) => setFigmaApiKey(e.target.value)}
              placeholder="figd_xxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Figma 계정 설정에서 Personal Access Token을 생성하세요.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>MCP 서버 연동:</strong> Figma MCP 서버가 설정되어 있으면 자동으로 메타데이터를 추출할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 템플릿 기본값 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📐 템플릿 기본값</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 너비 (px)
              </label>
              <input
                type="number"
                value={defaultBaseSize.width}
                onChange={(e) => setDefaultBaseSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 높이 (px)
              </label>
              <input
                type="number"
                value={defaultBaseSize.height}
                onChange={(e) => setDefaultBaseSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            종횡비: {(defaultBaseSize.height / defaultBaseSize.width).toFixed(3)}
          </div>
        </div>
      </section>

      {/* 일반 설정 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚙️ 일반</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">자동 백업</p>
              <p className="text-sm text-gray-500">JSON 저장 시 이전 버전 자동 백업</p>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoBackup ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoBackup ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">다크 모드</p>
              <p className="text-sm text-gray-500">어드민 인터페이스 다크 모드 (준비 중)</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              disabled
              className={`relative w-12 h-6 rounded-full transition-colors opacity-50 ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 개발 정보 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ 정보</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">버전</span>
            <span className="text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">프레임워크</span>
            <span className="text-gray-900">Next.js 15 + React 19</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">스타일링</span>
            <span className="text-gray-900">Tailwind CSS</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">에디터</span>
            <span className="text-gray-900">Monaco Editor</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">템플릿 수</span>
            <span className="text-gray-900">50개</span>
          </div>
        </div>
      </section>

      {/* 저장 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={() => alert('설정이 저장되었습니다. (데모)')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          💾 설정 저장
        </button>
        <button
          onClick={() => {
            setFigmaApiKey('')
            setDefaultBaseSize({ width: 335, height: 515 })
            setAutoBackup(true)
            setDarkMode(false)
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          🔄 초기화
        </button>
      </div>
    </div>
  )
}
