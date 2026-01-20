import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { uploadToS3, isS3Enabled } from '@/lib/storage/s3'

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

    // 파일 버퍼 읽기
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // S3 사용 여부에 따라 분기
    if (isS3Enabled()) {
      // S3에 업로드
      try {
        const result = await uploadToS3(buffer, file.name, file.type, folder)

        return NextResponse.json({
          success: true,
          message: '파일이 S3에 업로드되었습니다.',
          file: {
            name: result.fileName,
            path: result.url,
            key: result.key,
            size: result.size,
            storage: 's3'
          }
        })
      } catch (error) {
        console.error('S3 Upload Error:', error)
        return NextResponse.json(
          { error: 'S3 업로드에 실패했습니다.' },
          { status: 500 }
        )
      }
    } else {
      // 로컬에 저장 (기존 로직)
      const sanitizedName = file.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_.]/g, '')

      const folderPath = path.join(ASSETS_DIR, folder)

      if (!existsSync(folderPath)) {
        await mkdir(folderPath, { recursive: true })
      }

      const filePath = path.join(folderPath, sanitizedName)
      await writeFile(filePath, buffer)

      return NextResponse.json({
        success: true,
        message: '파일이 업로드되었습니다.',
        file: {
          name: sanitizedName,
          path: `/assets/${folder}/${sanitizedName}`,
          size: file.size,
          storage: 'local'
        }
      })
    }

  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json(
      { error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}
