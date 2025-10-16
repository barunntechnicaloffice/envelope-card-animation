import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * GET /api/templates
 * 모든 템플릿 목록 반환
 */
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates')

    // 템플릿 디렉토리 확인
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json(
        { error: 'Templates directory not found' },
        { status: 404 }
      )
    }

    // 모든 JSON 파일 읽기
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'))

    const templates = files.map(file => {
      const filePath = path.join(templatesDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const template = JSON.parse(fileContent)

      return {
        id: file.replace('.json', ''),
        name: template.name || file.replace('.json', ''),
        version: template.version || '1.0.0',
        description: template.description || '',
        category: template.metadata?.category || 'general',
        thumbnail: template.metadata?.thumbnail,
        endpoint: `/api/templates/${file.replace('.json', '')}`,
        previewUrl: `/templates/${file.replace('.json', '')}`
      }
    })

    return NextResponse.json({
      total: templates.length,
      templates
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Templates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
