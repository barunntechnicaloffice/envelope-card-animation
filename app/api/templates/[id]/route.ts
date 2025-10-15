import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filePath = path.join(process.cwd(), 'public', 'templates', `${id}.json`)

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // JSON 파일 읽기
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const template = JSON.parse(fileContent)

    return NextResponse.json(template, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Template API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 템플릿 업데이트 (개발용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const filePath = path.join(process.cwd(), 'public', 'templates', `${id}.json`)

    // JSON 파일 쓰기
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8')

    return NextResponse.json({ success: true, message: 'Template updated' })
  } catch (error) {
    console.error('Template update error:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}
