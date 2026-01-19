import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

interface FileInfo {
  name: string
  path: string
  size: number
  type: 'image' | 'svg' | 'other'
  modifiedAt: string
}

interface FolderInfo {
  name: string
  path: string
  files: FileInfo[]
  totalSize: number
  fileCount: number
}

// 파일 타입 판별
function getFileType(filename: string): 'image' | 'svg' | 'other' {
  const ext = path.extname(filename).toLowerCase()
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) return 'image'
  if (ext === '.svg') return 'svg'
  return 'other'
}

// 파일 크기를 읽기 쉬운 형식으로 변환
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder') // 특정 폴더만 조회
    const listFolders = searchParams.get('list') === 'true' // 폴더 목록만 조회

    // assets 폴더가 없으면 빈 결과 반환
    if (!existsSync(ASSETS_DIR)) {
      return NextResponse.json({
        success: true,
        folders: [],
        totalSize: 0,
        totalFiles: 0
      })
    }

    // 폴더 목록만 조회
    if (listFolders) {
      const entries = await readdir(ASSETS_DIR, { withFileTypes: true })
      const folders = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort((a, b) => {
          // common을 맨 앞으로
          if (a === 'common') return -1
          if (b === 'common') return 1
          // 나머지는 숫자 기준 정렬
          const numA = parseInt(a.match(/\d+/)?.[0] || '0')
          const numB = parseInt(b.match(/\d+/)?.[0] || '0')
          return numA - numB
        })

      return NextResponse.json({
        success: true,
        folders
      })
    }

    // 특정 폴더 조회
    if (folder) {
      const folderPath = path.join(ASSETS_DIR, folder)

      if (!existsSync(folderPath)) {
        return NextResponse.json({
          success: false,
          error: '폴더를 찾을 수 없습니다.'
        }, { status: 404 })
      }

      const files = await readdir(folderPath)
      const fileInfos: FileInfo[] = []
      let totalSize = 0

      for (const file of files) {
        const filePath = path.join(folderPath, file)
        const fileStat = await stat(filePath)

        if (fileStat.isFile()) {
          totalSize += fileStat.size
          fileInfos.push({
            name: file,
            path: `/assets/${folder}/${file}`,
            size: fileStat.size,
            type: getFileType(file),
            modifiedAt: fileStat.mtime.toISOString()
          })
        }
      }

      // 파일명 기준 정렬
      fileInfos.sort((a, b) => a.name.localeCompare(b.name))

      return NextResponse.json({
        success: true,
        folder: {
          name: folder,
          path: `/assets/${folder}`,
          files: fileInfos,
          totalSize,
          totalSizeFormatted: formatBytes(totalSize),
          fileCount: fileInfos.length
        }
      })
    }

    // 전체 폴더 및 파일 조회
    const entries = await readdir(ASSETS_DIR, { withFileTypes: true })
    const folders: FolderInfo[] = []
    let grandTotalSize = 0
    let grandTotalFiles = 0

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const folderPath = path.join(ASSETS_DIR, entry.name)
      const files = await readdir(folderPath)
      const fileInfos: FileInfo[] = []
      let folderSize = 0

      for (const file of files) {
        const filePath = path.join(folderPath, file)
        const fileStat = await stat(filePath)

        if (fileStat.isFile()) {
          folderSize += fileStat.size
          fileInfos.push({
            name: file,
            path: `/assets/${entry.name}/${file}`,
            size: fileStat.size,
            type: getFileType(file),
            modifiedAt: fileStat.mtime.toISOString()
          })
        }
      }

      grandTotalSize += folderSize
      grandTotalFiles += fileInfos.length

      folders.push({
        name: entry.name,
        path: `/assets/${entry.name}`,
        files: fileInfos,
        totalSize: folderSize,
        fileCount: fileInfos.length
      })
    }

    // 정렬: common 먼저, 나머지는 숫자 순
    folders.sort((a, b) => {
      if (a.name === 'common') return -1
      if (b.name === 'common') return 1
      const numA = parseInt(a.name.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.name.match(/\d+/)?.[0] || '0')
      return numA - numB
    })

    return NextResponse.json({
      success: true,
      folders,
      totalSize: grandTotalSize,
      totalSizeFormatted: formatBytes(grandTotalSize),
      totalFiles: grandTotalFiles,
      folderCount: folders.length
    })

  } catch (error) {
    console.error('Assets API Error:', error)
    return NextResponse.json(
      { error: '에셋 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
