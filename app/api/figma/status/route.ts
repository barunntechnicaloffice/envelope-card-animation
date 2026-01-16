import { NextResponse } from 'next/server'

export async function GET() {
  const hasToken = !!process.env.FIGMA_ACCESS_TOKEN

  return NextResponse.json({
    configured: hasToken,
    message: hasToken
      ? 'Figma API 토큰이 설정되어 있습니다.'
      : 'Figma API 토큰이 설정되지 않았습니다. 서버의 FIGMA_ACCESS_TOKEN 환경변수를 확인해주세요.'
  })
}
