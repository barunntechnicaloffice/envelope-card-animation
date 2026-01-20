import { NextRequest, NextResponse } from 'next/server'
import { upsertTemplate, isBdcWebApiEnabled } from '@/lib/api/bdc-web'

/**
 * POST /api/templates/publish
 *
 * 템플릿을 bdc-web 백오피스에 등록/수정
 */
export async function POST(request: NextRequest) {
  try {
    // API 설정 확인
    if (!isBdcWebApiEnabled()) {
      return NextResponse.json(
        {
          success: false,
          error: 'bdc-web API가 설정되지 않았습니다.',
          details: 'BDC_WEB_API_URL과 BDC_WEB_API_KEY 환경변수를 확인하세요.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { template } = body

    if (!template) {
      return NextResponse.json(
        { success: false, error: '템플릿 데이터가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!template.id) {
      return NextResponse.json(
        { success: false, error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 필수 필드 검증
    const requiredFields = ['version', 'name', 'category', 'layout', 'data', 'components']
    const missingFields = requiredFields.filter((field) => !template[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // components 검증
    if (!Array.isArray(template.components) || template.components.length === 0) {
      return NextResponse.json(
        { success: false, error: 'components 배열이 필요합니다.' },
        { status: 400 }
      )
    }

    // bdc-web에 등록/수정
    const result = await upsertTemplate(template)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '템플릿이 bdc-web에 등록되었습니다.',
      data: result.data,
    })
  } catch (error) {
    console.error('Template publish error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '템플릿 등록 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
