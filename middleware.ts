import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 보호할 경로들
const protectedPaths = ['/admin']

// 인증 없이 접근 가능한 경로들
const publicPaths = ['/login', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일, API 인증 경로는 통과
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/templates') ||
    pathname === '/favicon.ico' ||
    publicPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // 보호된 경로 확인
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      // 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 토큰이 있으면 통과 (실제 검증은 API에서)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
