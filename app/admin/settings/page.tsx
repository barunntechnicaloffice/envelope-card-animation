'use client'

import { useState, useEffect } from 'react'

interface AdminSettings {
  figmaApiKey: string
  defaultBaseSize: {
    width: number
    height: number
  }
  autoBackup: boolean
  darkMode: boolean
}

const DEFAULT_SETTINGS: AdminSettings = {
  figmaApiKey: '',
  defaultBaseSize: { width: 335, height: 515 },
  autoBackup: true,
  darkMode: false
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 설정 로드
  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // 설정 저장
  async function saveSettings() {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: '설정이 저장되었습니다!' })
      } else {
        setMessage({ type: 'error', text: data.error || '저장에 실패했습니다.' })
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // 설정 초기화
  function resetSettings() {
    if (confirm('설정을 초기값으로 되돌리시겠습니까?')) {
      setSettings(DEFAULT_SETTINGS)
      setMessage({ type: 'success', text: '설정이 초기화되었습니다. 저장 버튼을 눌러 적용하세요.' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">설정 로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-gray-600 mt-1">어드민 환경 설정</p>
      </div>

      {/* 메시지 */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Figma 설정 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Figma 연동</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Figma API Key
            </label>
            <input
              type="password"
              value={settings.figmaApiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, figmaApiKey: e.target.value }))}
              placeholder="figd_xxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Figma 계정 설정에서 Personal Access Token을 생성하세요.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>참고:</strong> API Key는 <code className="bg-blue-100 px-1 rounded">.admin/settings.json</code>에 로컬 저장됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 템플릿 기본값 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">템플릿 기본값</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 너비 (px)
              </label>
              <input
                type="number"
                value={settings.defaultBaseSize.width}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  defaultBaseSize: { ...prev.defaultBaseSize, width: parseInt(e.target.value) || 335 }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 높이 (px)
              </label>
              <input
                type="number"
                value={settings.defaultBaseSize.height}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  defaultBaseSize: { ...prev.defaultBaseSize, height: parseInt(e.target.value) || 515 }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            종횡비: {(settings.defaultBaseSize.height / settings.defaultBaseSize.width).toFixed(3)} (표준: 1.537)
          </div>
        </div>
      </section>

      {/* 일반 설정 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">일반</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">자동 백업</p>
              <p className="text-sm text-gray-500">JSON 저장 시 이전 버전 자동 백업</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.autoBackup ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : ''
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
              disabled
              className="relative w-12 h-6 rounded-full transition-colors opacity-50 cursor-not-allowed bg-gray-300"
            >
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </section>

      {/* 개발 정보 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">정보</h2>

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
            <span className="text-gray-500">설정 파일</span>
            <span className="text-gray-900 font-mono text-xs">.admin/settings.json</span>
          </div>
        </div>
      </section>

      {/* 저장 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '저장 중...' : '설정 저장'}
        </button>
        <button
          onClick={resetSettings}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  )
}
