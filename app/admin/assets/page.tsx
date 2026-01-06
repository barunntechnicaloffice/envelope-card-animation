'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface AssetFolder {
  name: string
  path: string
  files: string[]
}

// 알려진 에셋 폴더 목록 (실제로는 API로 가져와야 함)
const KNOWN_ASSET_FOLDERS = [
  'common',
  ...Array.from({ length: 50 }, (_, i) => `wedding-card-${String(i + 1).padStart(3, '0')}`)
]

const COMMON_FILES = ['bg.png', 'pattern.png', 'seal.png', 'photo.png']
const TEMPLATE_FILES = ['card-bg.png', 'photo.png', 'decoration.svg', 'date-divider.svg']

export default function AssetsPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>('common')
  const [assetFolders, setAssetFolders] = useState<AssetFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewAsset, setPreviewAsset] = useState<string | null>(null)

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    setLoading(true)
    const folders: AssetFolder[] = []

    // common 폴더
    folders.push({
      name: 'common',
      path: '/assets/common',
      files: COMMON_FILES
    })

    // 각 템플릿 폴더
    for (let i = 1; i <= 50; i++) {
      const folderId = `wedding-card-${String(i).padStart(3, '0')}`
      folders.push({
        name: folderId,
        path: `/assets/${folderId}`,
        files: TEMPLATE_FILES
      })
    }

    setAssetFolders(folders)
    setLoading(false)
  }

  const currentFolder = assetFolders.find(f => f.name === selectedFolder)
  const filteredFolders = assetFolders.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">에셋 관리</h1>
        <p className="text-gray-600 mt-1">템플릿 이미지 및 에셋 관리</p>
      </div>

      <div className="flex gap-6">
        {/* 사이드바: 폴더 목록 */}
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <input
            type="text"
            placeholder="폴더 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4"
          />

          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {filteredFolders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFolder === folder.name
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="mr-2">📁</span>
                {folder.name}
              </button>
            ))}
          </div>
        </div>

        {/* 메인: 파일 목록 */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {currentFolder ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentFolder.name}</h2>
                  <p className="text-sm text-gray-500">{currentFolder.path}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {currentFolder.files.length}개 파일
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFolder.files.map((file) => (
                  <AssetCard
                    key={file}
                    path={`${currentFolder.path}/${file}`}
                    name={file}
                    onPreview={() => setPreviewAsset(`${currentFolder.path}/${file}`)}
                  />
                ))}
              </div>

              {/* 에셋 추가 안내 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">에셋 추가하기</h3>
                <p className="text-sm text-gray-600">
                  새 에셋을 추가하려면 <code className="bg-gray-200 px-1 rounded">public{currentFolder.path}</code> 폴더에 파일을 직접 추가하세요.
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  <p>권장 파일 형식:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>배경/사진: PNG, JPG (최적화된 WebP 권장)</li>
                    <li>아이콘/장식: SVG</li>
                    <li>파일명: 소문자, 하이픈 사용 (예: card-bg.png)</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              폴더를 선택해주세요
            </div>
          )}
        </div>
      </div>

      {/* 프리뷰 모달 */}
      {previewAsset && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewAsset(null)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">{previewAsset}</h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
              <Image
                src={previewAsset}
                alt="Preview"
                fill
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.png'
                }}
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewAsset)
                  alert('경로가 복사되었습니다!')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                📋 경로 복사
              </button>
              <a
                href={previewAsset}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                🔗 새 탭에서 열기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AssetCard({
  path,
  name,
  onPreview
}: {
  path: string
  name: string
  onPreview: () => void
}) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(name)

  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onPreview}
    >
      <div className="aspect-square bg-gray-50 relative flex items-center justify-center">
        {isImage && !error ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">로딩...</span>
              </div>
            )}
            <Image
              src={path}
              alt={name}
              fill
              className={`object-contain p-2 ${loading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError(true)
                setLoading(false)
              }}
            />
          </>
        ) : (
          <div className="text-4xl text-gray-300">
            {error ? '❌' : '📄'}
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-white px-3 py-1 rounded-full text-sm shadow">
            👁️ 미리보기
          </span>
        </div>
      </div>
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-700 truncate font-mono">{name}</p>
        <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-400'}`}>
          {error ? '파일 없음' : isImage ? '이미지' : '파일'}
        </p>
      </div>
    </div>
  )
}
