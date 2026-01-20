import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    data: { message: '로그아웃되었습니다.' },
  })

  // 쿠키 삭제
  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
