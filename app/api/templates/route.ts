import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates')

// GET: 템플릿 목록 또는 특정 템플릿 조회
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const templateId = searchParams.get('id')
  const listAll = searchParams.get('list')

  if (templateId) {
    // 특정 템플릿 조회
    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    try {
      const content = await readFile(filePath, 'utf-8')
      const data = JSON.parse(content)
      return NextResponse.json({ success: true, data })
    } catch (error) {
      return NextResponse.json(
        { error: '템플릿을 읽는데 실패했습니다.' },
        { status: 500 }
      )
    }
  }

  // 전체 템플릿 목록 조회
  if (listAll === 'true') {
    try {
      const { readdir } = await import('fs/promises')
      const files = await readdir(TEMPLATES_DIR)
      const jsonFiles = files.filter(f => f.endsWith('.json'))

      const templates = await Promise.all(
        jsonFiles.map(async (file) => {
          try {
            const content = await readFile(path.join(TEMPLATES_DIR, file), 'utf-8')
            const data = JSON.parse(content)
            return {
              id: data.id || file.replace('.json', ''),
              name: data.name || file.replace('.json', ''),
              version: data.version || '1.0.0',
              category: data.category,
              thumbnail: data.thumbnail || data.set?.cards?.background,
              hasLayout: !!data.layout,
              status: 'published' as const
            }
          } catch {
            return {
              id: file.replace('.json', ''),
              name: file.replace('.json', ''),
              version: '-',
              hasLayout: false,
              status: 'error' as const
            }
          }
        })
      )

      // ID 기준 정렬
      templates.sort((a, b) => a.id.localeCompare(b.id))

      return NextResponse.json({ success: true, templates })
    } catch (error) {
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

    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)
    const jsonString = JSON.stringify(jsonData, null, 2)

    await writeFile(filePath, jsonString, 'utf-8')

    return NextResponse.json({
      success: true,
      message: '템플릿이 저장되었습니다.',
      path: `/templates/${templateId}.json`
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

    if (!templateId || !content) {
      return NextResponse.json(
        { error: 'templateId와 content가 필요합니다.' },
        { status: 400 }
      )
    }

    const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)

    // 기존 파일 존재 확인
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '수정할 템플릿을 찾을 수 없습니다.' },
        { status: 404 }
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

    const jsonString = JSON.stringify(jsonData, null, 2)
    await writeFile(filePath, jsonString, 'utf-8')

    return NextResponse.json({
      success: true,
      message: '템플릿이 수정되었습니다.',
      path: `/templates/${templateId}.json`
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

  if (!templateId) {
    return NextResponse.json(
      { error: 'templateId가 필요합니다.' },
      { status: 400 }
    )
  }

  const filePath = path.join(TEMPLATES_DIR, `${templateId}.json`)

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: '삭제할 템플릿을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  try {
    await unlink(filePath)
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
