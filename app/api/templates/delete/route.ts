import { NextRequest, NextResponse } from 'next/server'
import { unlink, rm } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates')
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId } = body

    if (!templateId) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 템플릿 JSON 파일 경로
    const templatePath = path.join(TEMPLATES_DIR, `${templateId}.json`)

    // 템플릿 파일이 존재하는지 확인
    if (!existsSync(templatePath)) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 1. 템플릿 JSON 파일 삭제
    await unlink(templatePath)

    // 2. 에셋 폴더 삭제 (있으면)
    const assetsPath = path.join(ASSETS_DIR, templateId)
    if (existsSync(assetsPath)) {
      await rm(assetsPath, { recursive: true, force: true })
    }

    return NextResponse.json({
      success: true,
      message: '템플릿이 삭제되었습니다.',
    })

  } catch (error) {
    console.error('Template delete error:', error)
    return NextResponse.json(
      { error: '템플릿 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
