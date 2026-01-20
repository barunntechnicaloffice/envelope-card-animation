import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          userId: payload.userId,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        },
      },
    })
  } catch (error) {
    console.error('토큰 검증 오류:', error)
    return NextResponse.json(
      { success: false, message: '유효하지 않은 토큰입니다.' },
      { status: 401 }
    )
  }
}
