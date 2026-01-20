import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { generateToken } from '@/lib/auth/jwt'
import { authConfig } from '@/lib/auth/config'

const googleClient = new OAuth2Client(authConfig.googleClientId)

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'credential이 필요합니다.' },
        { status: 400 }
      )
    }

    if (!authConfig.googleClientId) {
      return NextResponse.json(
        { success: false, message: 'GOOGLE_CLIENT_ID가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // CRITICAL SECURITY: Always use server-side GOOGLE_CLIENT_ID as audience
    // This prevents attackers from using tokens issued to their own OAuth clients
    let ticket
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: authConfig.googleClientId,
      })
    } catch (error) {
      console.error('Google 토큰 검증 실패:', error)
      return NextResponse.json(
        { success: false, message: 'Google 인증에 실패했습니다. 유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Google 토큰 검증에 실패했습니다.' },
        { status: 401 }
      )
    }

    // Double-check audience and issuer for additional security
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com']

    if (payload.aud !== authConfig.googleClientId) {
      console.error('Token audience mismatch:', {
        expected: authConfig.googleClientId,
        received: payload.aud,
      })
      return NextResponse.json(
        { success: false, message: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      )
    }

    if (!payload.iss || !validIssuers.includes(payload.iss)) {
      console.error('Token issuer invalid:', {
        expected: validIssuers,
        received: payload.iss,
      })
      return NextResponse.json(
        { success: false, message: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      )
    }

    // Check domain restriction
    if (authConfig.allowedEmailDomain && payload.hd !== authConfig.allowedEmailDomain) {
      console.error('Domain not allowed:', {
        email: payload.email,
        attemptedDomain: payload.hd,
        allowedDomain: authConfig.allowedEmailDomain,
      })
      return NextResponse.json(
        {
          success: false,
          message: `${authConfig.allowedEmailDomain} 도메인의 계정만 로그인할 수 있습니다.`
        },
        { status: 403 }
      )
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: payload.sub || '',
      email: payload.email || '',
      name: payload.name || '',
      picture: payload.picture,
    })

    // 응답 생성 (bdc 백오피스와 동일한 형식)
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          hd: payload.hd,
          sub: payload.sub,
          given_name: payload.given_name,
          family_name: payload.family_name,
          email_verified: payload.email_verified,
          locale: payload.locale,
        },
      },
    })

    // 쿠키에 토큰 저장
    response.cookies.set('authToken', token, authConfig.cookieOptions)

    return response
  } catch (error) {
    console.error('인증 오류:', error)
    return NextResponse.json(
      { success: false, message: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
