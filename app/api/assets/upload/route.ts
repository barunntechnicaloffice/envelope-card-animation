import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

// 허용된 파일 확장자
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file) {
      return NextResponse.json(
        { error: '파일이 없습니다.' },
        { status: 400 }
      )
    }

    if (!folder) {
      return NextResponse.json(
        { error: '폴더를 선택해주세요.' },
        { status: 400 }
      )
    }

    // 파일 확장자 검증
    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `허용되지 않는 파일 형식입니다. (허용: ${ALLOWED_EXTENSIONS.join(', ')})` },
        { status: 400 }
      )
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기가 5MB를 초과합니다.' },
        { status: 400 }
      )
    }

    // 파일명 정리 (소문자, 공백 제거)
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-_.]/g, '')

    // 폴더 경로 생성
    const folderPath = path.join(ASSETS_DIR, folder)

    // 폴더가 없으면 생성
    if (!existsSync(folderPath)) {
      await mkdir(folderPath, { recursive: true })
    }

    // 파일 저장
    const filePath = path.join(folderPath, sanitizedName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      message: '파일이 업로드되었습니다.',
      file: {
        name: sanitizedName,
        path: `/assets/${folder}/${sanitizedName}`,
        size: file.size
      }
    })

  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json(
      { error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}
