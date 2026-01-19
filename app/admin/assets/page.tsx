'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface FileInfo {
  name: string
  path: string
  size: number
  type: 'image' | 'svg' | 'other'
  modifiedAt: string
}

interface FolderData {
  name: string
  path: string
  files: FileInfo[]
  totalSize: number
  totalSizeFormatted?: string
  fileCount: number
}

// 파일 크기 포맷
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function AssetsPage() {
  const [folders, setFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const [folderData, setFolderData] = useState<FolderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [folderLoading, setFolderLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewAsset, setPreviewAsset] = useState<FileInfo | null>(null)
  const [stats, setStats] = useState({ totalSize: '', totalFiles: 0, folderCount: 0 })
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 폴더 목록 로드
  useEffect(() => {
    loadFolders()
  }, [])

  // 선택된 폴더 변경 시 파일 목록 로드
  useEffect(() => {
    if (selectedFolder) {
      loadFolderFiles(selectedFolder)
    }
  }, [selectedFolder])

  async function loadFolders() {
    setLoading(true)
    try {
      // 전체 통계도 함께 가져오기
      const res = await fetch('/api/assets')
      if (res.ok) {
        const data = await res.json()
        const folderNames = data.folders?.map((f: FolderData) => f.name) || []
        setFolders(folderNames)
        setStats({
          totalSize: data.totalSizeFormatted || '0 B',
          totalFiles: data.totalFiles || 0,
          folderCount: data.folderCount || 0
        })

        // 첫 번째 폴더 선택
        if (folderNames.length > 0 && !selectedFolder) {
          setSelectedFolder(folderNames[0])
        }
      }
    } catch (err) {
      console.error('Failed to load folders:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadFolderFiles(folder: string) {
    setFolderLoading(true)
    try {
      const res = await fetch(`/api/assets?folder=${encodeURIComponent(folder)}`)
      if (res.ok) {
        const data = await res.json()
        setFolderData(data.folder)
      }
    } catch (err) {
      console.error('Failed to load folder files:', err)
    } finally {
      setFolderLoading(false)
    }
  }

  // 폴더 새로고침
  const refreshFolder = useCallback(() => {
    if (selectedFolder) {
      loadFolderFiles(selectedFolder)
    }
  }, [selectedFolder])

  // 파일 업로드 처리
  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!selectedFolder) {
      alert('먼저 폴더를 선택해주세요.')
      return
    }

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', selectedFolder)

        const res = await fetch('/api/assets/upload', {
          method: 'POST',
          body: formData
        })

        const result = await res.json()

        if (!res.ok) {
          alert(`${file.name}: ${result.error}`)
        }
      }

      // 업로드 후 새로고침
      await loadFolders()
      await loadFolderFiles(selectedFolder)
      alert('파일이 업로드되었습니다!')
    } catch (err) {
      console.error('Upload failed:', err)
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 드래그 앤 드롭 핸들러
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  // 새 폴더 생성
  async function handleCreateFolder() {
    if (!newFolderName.trim()) {
      alert('폴더 이름을 입력해주세요.')
      return
    }

    // 폴더 이름 정리 (소문자, 공백을 하이픈으로)
    const sanitizedName = newFolderName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_]/g, '')

    if (!sanitizedName) {
      alert('유효한 폴더 이름을 입력해주세요.')
      return
    }

    // 빈 파일을 업로드해서 폴더 생성 (placeholder)
    // 실제로는 폴더만 생성하는 API를 따로 만들 수도 있음
    setShowNewFolderInput(false)
    setNewFolderName('')

    // 폴더 목록에 추가하고 선택
    if (!folders.includes(sanitizedName)) {
      setFolders(prev => [...prev, sanitizedName].sort())
    }
    setSelectedFolder(sanitizedName)
  }

  const filteredFolders = folders.filter(f =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">에셋 관리</h1>
          <p className="text-gray-600 mt-1">
            {stats.folderCount}개 폴더 · {stats.totalFiles}개 파일 · 총 {stats.totalSize}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedFolder || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📤</span> {uploading ? '업로드 중...' : '파일 업로드'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <button
            onClick={() => {
              loadFolders()
              refreshFolder()
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> 새로고침
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">에셋 로딩 중...</div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* 사이드바: 폴더 목록 */}
          <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
            <input
              type="text"
              placeholder="폴더 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3"
            />

            {/* 새 폴더 생성 */}
            {showNewFolderInput ? (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="폴더명"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                />
                <button
                  onClick={handleCreateFolder}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  생성
                </button>
                <button
                  onClick={() => {
                    setShowNewFolderInput(false)
                    setNewFolderName('')
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewFolderInput(true)}
                className="w-full px-3 py-2 mb-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                + 새 폴더
              </button>
            )}

            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredFolders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  폴더가 없습니다
                </p>
              ) : (
                filteredFolders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFolder === folder
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="mr-2">📁</span>
                    {folder}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 메인: 파일 목록 */}
          <div
            className={`flex-1 bg-white rounded-xl shadow-sm border-2 p-6 transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {folderLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">파일 로딩 중...</div>
              </div>
            ) : folderData ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{folderData.name}</h2>
                    <p className="text-sm text-gray-500">
                      {folderData.path} · {folderData.fileCount}개 파일 · {folderData.totalSizeFormatted || formatBytes(folderData.totalSize)}
                    </p>
                  </div>
                </div>

                {folderData.files.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <span className="text-4xl mb-4 block">📭</span>
                    <p className="mb-2">이 폴더에는 파일이 없습니다</p>
                    <p className="text-sm">파일을 여기에 드래그하거나 업로드 버튼을 클릭하세요</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folderData.files.map((file) => (
                      <AssetCard
                        key={file.name}
                        file={file}
                        onPreview={() => setPreviewAsset(file)}
                      />
                    ))}
                  </div>
                )}

                {/* 에셋 추가 안내 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">파일 업로드 안내</h3>
                  <p className="text-sm text-blue-700">
                    파일을 이 영역에 드래그하거나 상단의 &quot;파일 업로드&quot; 버튼을 클릭하세요.
                  </p>
                  <div className="mt-3 text-xs text-blue-600">
                    <p>허용 파일 형식 (최대 5MB):</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>이미지: PNG, JPG, JPEG, GIF, WebP</li>
                      <li>벡터: SVG</li>
                      <li>파일명은 자동으로 소문자로 변환됩니다</li>
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
      )}

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
              <div>
                <h3 className="font-medium text-gray-900">{previewAsset.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatBytes(previewAsset.size)} · {new Date(previewAsset.modifiedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: 300 }}>
              {previewAsset.type === 'image' || previewAsset.type === 'svg' ? (
                <Image
                  src={previewAsset.path}
                  alt={previewAsset.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-6xl">📄</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewAsset.path)
                  alert('경로가 복사되었습니다!')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                📋 경로 복사
              </button>
              <a
                href={previewAsset.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                🔗 새 탭에서 열기
              </a>
              <a
                href={previewAsset.path}
                download={previewAsset.name}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                📥 다운로드
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AssetCard({
  file,
  onPreview
}: {
  file: FileInfo
  onPreview: () => void
}) {
  const [error, setError] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  const isVisual = file.type === 'image' || file.type === 'svg'

  return (
    <div
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onPreview}
    >
      <div className="aspect-square bg-gray-50 relative flex items-center justify-center">
        {isVisual && !error ? (
          <>
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">로딩...</span>
              </div>
            )}
            <Image
              src={file.path}
              alt={file.name}
              fill
              className={`object-contain p-2 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setError(true)
                setImgLoading(false)
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
        <p className="text-xs text-gray-700 truncate font-mono" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-400">
          {formatBytes(file.size)}
        </p>
      </div>
    </div>
  )
}
