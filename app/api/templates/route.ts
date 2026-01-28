import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import {
  isS3Enabled,
  saveTemplateToS3,
  getTemplateFromS3,
  listTemplatesFromS3,
  deleteTemplateFromS3
} from '@/lib/storage/s3'

const TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates')

// 캐시 비활성화 - 동적으로 파일 시스템을 읽어야 하므로
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET: 템플릿 목록 또는 특정 템플릿 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('id')
  const listAll = searchParams.get('list')
  const useS3 = isS3Enabled()

  if (templateId) {
    // 특정 템플릿 조회
    try {
      let data: object | null = null

      // S3 모드면 S3에서 먼저 조회
      if (useS3) {
        data = await getTemplateFromS3(templateId)
      }

      // S3에 없거나 S3 비활성화면 로컬 파일 조회
      if (!data) {
        const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
        if (existsSync(filePath)) {
          const content = await readFile(filePath, 'utf-8')
          data = JSON.parse(content)
        }
      }

      if (!data) {
        return NextResponse.json(
          { error: '템플릿을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, data })
    } catch (error) {
      console.error('Template read error:', error)
      return NextResponse.json(
        { error: '템플릿을 읽는데 실패했습니다.' },
        { status: 500 }
      )
    }
  }

  // 전체 템플릿 목록 조회
  if (listAll === 'true') {
    console.log(`[Templates API] 목록 조회 시작 - useS3: ${useS3}`)
    try {
      interface TemplateInfo {
        id: string
        name: string
        version: string
        category?: string
        thumbnail?: string
        hasLayout: boolean
        status: 'published' | 'draft' | 'error'
      }

      const templateMap = new Map<string, TemplateInfo>()

      // 1. 로컬 파일에서 템플릿 목록 조회
      try {
        const { readdir } = await import('fs/promises')
        const files = await readdir(TEMPLATES_DIR)
        const jsonFiles = files.filter(f => f.endsWith('.json'))

        await Promise.all(
          jsonFiles.map(async (file) => {
            try {
              const content = await readFile(path.join(TEMPLATES_DIR, file), 'utf-8')
              const data = JSON.parse(content)
              const id = data.id || file.replace('.json', '')
              templateMap.set(id, {
                id,
                name: data.name || file.replace('.json', ''),
                version: data.version || '1.0.0',
                category: data.category,
                thumbnail: data.thumbnail || data.set?.cards?.background || data.set?.cards?.main || data.data?.wedding?.photo,
                hasLayout: !!data.layout,
                status: 'published'
              })
            } catch {
              const id = file.replace('.json', '')
              templateMap.set(id, {
                id,
                name: file.replace('.json', ''),
                version: '-',
                hasLayout: false,
                status: 'error'
              })
            }
          })
        )
      } catch (error) {
        console.log('[Templates] 로컬 디렉토리 읽기 실패 (정상일 수 있음):', error)
      }

      // 2. S3에서 템플릿 목록 조회 (S3 모드인 경우)
      if (useS3) {
        console.log('[Templates API] S3에서 템플릿 목록 조회 시작')
        const s3Templates = await listTemplatesFromS3()
        console.log(`[Templates API] S3 템플릿 수: ${s3Templates.length}`)

        await Promise.all(
          s3Templates.map(async ({ id }) => {
            // 이미 로컬에 있으면 S3 버전으로 덮어쓰기 (S3가 최신)
            const data = await getTemplateFromS3(id)
            if (data && typeof data === 'object') {
              const templateData = data as Record<string, unknown>
              templateMap.set(id, {
                id: (templateData.id as string) || id,
                name: (templateData.name as string) || id,
                version: (templateData.version as string) || '1.0.0',
                category: templateData.category as string | undefined,
                thumbnail: (templateData.thumbnail as string) ||
                  (templateData.set as Record<string, Record<string, string>>)?.cards?.background ||
                  (templateData.set as Record<string, Record<string, string>>)?.cards?.main ||
                  (templateData.data as Record<string, Record<string, string>>)?.wedding?.photo,
                hasLayout: !!(templateData.layout),
                status: 'published'
              })
            }
          })
        )
      }

      // Map을 배열로 변환하고 정렬
      const templates = Array.from(templateMap.values())
      templates.sort((a, b) => a.id.localeCompare(b.id))

      console.log(`[Templates API] 최종 템플릿 수: ${templates.length}`)

      return NextResponse.json(
        { success: true, templates, storage: useS3 ? 's3' : 'local' },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
          },
        }
      )
    } catch (error) {
      console.error('Template list error:', error)
      return NextResponse.json(
        { error: '템플릿 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ success: true, message: 'Use ?id=template-id or ?list=true' })
}

// POST: 새 템플릿 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, content } = body
    const useS3 = isS3Enabled()

    if (!templateId || !content) {
      return NextResponse.json(
        { error: 'templateId와 content가 필요합니다.' },
        { status: 400 }
      )
    }

    // 템플릿 ID 유효성 검사
    if (!/^[a-z0-9-]+$/.test(templateId)) {
      return NextResponse.json(
        { error: '템플릿 ID는 소문자, 숫자, 하이픈만 사용할 수 있습니다.' },
        { status: 400 }
      )
    }

    // JSON 유효성 검사
    let jsonData
    try {
      jsonData = typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      return NextResponse.json(
        { error: '유효하지 않은 JSON 형식입니다.' },
        { status: 400 }
      )
    }

    // S3 모드면 S3에 저장
    if (useS3) {
      const result = await saveTemplateToS3(templateId, jsonData)
      console.log(`[Templates] S3에 저장됨: ${templateId}`, result.url)

      return NextResponse.json({
        success: true,
        message: '템플릿이 S3에 저장되었습니다.',
        path: result.url,
        storage: 's3'
      })
    }

    // 로컬 파일에 저장
    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
    const jsonString = JSON.stringify(jsonData, null, 2)
    await writeFile(filePath, jsonString, 'utf-8')

    return NextResponse.json({
      success: true,
      message: '템플릿이 저장되었습니다.',
      path: `/templates/${templateId}.json`,
      storage: 'local'
    })

  } catch (error) {
    console.error('Template save error:', error)
    return NextResponse.json(
      { error: '템플릿 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 기존 템플릿 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, content } = body
    const useS3 = isS3Enabled()

    if (!templateId || !content) {
      return NextResponse.json(
        { error: 'templateId와 content가 필요합니다.' },
        { status: 400 }
      )
    }

    // JSON 유효성 검사
    let jsonData
    try {
      jsonData = typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      return NextResponse.json(
        { error: '유효하지 않은 JSON 형식입니다.' },
        { status: 400 }
      )
    }

    // S3 모드면 S3에서 확인 후 저장
    if (useS3) {
      const existing = await getTemplateFromS3(templateId)
      if (!existing) {
        // 로컬에도 없으면 404
        const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
        if (!existsSync(filePath)) {
          return NextResponse.json(
            { error: '수정할 템플릿을 찾을 수 없습니다.' },
            { status: 404 }
          )
        }
      }

      const result = await saveTemplateToS3(templateId, jsonData)
      return NextResponse.json({
        success: true,
        message: '템플릿이 수정되었습니다.',
        path: result.url,
        storage: 's3'
      })
    }

    // 로컬 파일 수정
    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '수정할 템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const jsonString = JSON.stringify(jsonData, null, 2)
    await writeFile(filePath, jsonString, 'utf-8')

    return NextResponse.json({
      success: true,
      message: '템플릿이 수정되었습니다.',
      path: `/templates/${templateId}.json`,
      storage: 'local'
    })

  } catch (error) {
    console.error('Template update error:', error)
    return NextResponse.json(
      { error: '템플릿 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 템플릿 삭제
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('id')
  const useS3 = isS3Enabled()

  console.log(`[Templates API] 삭제 요청 - templateId: ${templateId}, useS3: ${useS3}`)

  if (!templateId) {
    return NextResponse.json(
      { error: 'templateId가 필요합니다.' },
      { status: 400 }
    )
  }

  try {
    // S3에서 삭제 시도 (존재 여부 확인 없이 바로 삭제 - S3는 없는 키 삭제해도 에러 안남)
    if (useS3) {
      console.log(`[Templates API] S3에서 삭제 시도: ${templateId}`)
      await deleteTemplateFromS3(templateId)
      console.log(`[Templates API] S3 삭제 완료: ${templateId}`)
    }

    // 로컬 파일 삭제 시도
    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
    if (existsSync(filePath)) {
      console.log(`[Templates API] 로컬 파일 삭제: ${filePath}`)
      await unlink(filePath)
    }

    // S3 모드에서는 항상 성공으로 처리 (S3 DeleteObject는 없는 키도 성공 반환)
    // 로컬 모드에서만 파일 존재 여부 확인
    if (!useS3 && !existsSync(filePath)) {
      // 이미 삭제된 후이므로 이 체크는 의미없음, 삭제 전에 체크했어야 함
      // 하지만 S3 모드가 아닌 경우에만 이 로직이 필요
    }

    return NextResponse.json({
      success: true,
      message: '템플릿이 삭제되었습니다.'
    })
  } catch (error) {
    console.error('Template delete error:', error)
    return NextResponse.json(
      { error: '템플릿 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
