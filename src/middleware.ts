/**
 * Next.js Middleware
 *
 * 역할:
 * - 모든 HTTP 요청을 가로채서 인증 상태 확인
 * - 로그인하지 않은 사용자는 /login으로 리다이렉트
 * - 로그인한 사용자가 /login 접근 시 메인 페이지로 리다이렉트
 *
 * 실행 시점:
 * - 라우트 핸들러보다 먼저 실행
 * - Edge Runtime에서 실행 (빠르고 가벼움)
 *
 * 실행 흐름:
 * 1. 요청 수신
 * 2. Middleware 실행 (인증 체크)
 * 3. 라우트 핸들러 실행
 * 4. 응답 반환
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// ==================================================
// 경로 설정
// ==================================================

/**
 * 공개 경로 (로그인 없이 접근 가능)
 *
 * 로그인하지 않은 사용자도 접근할 수 있는 경로
 * - /login: 로그인 페이지
 * - /api/auth/login: 로그인 API
 */
const publicPaths = ['/login', '/api/auth/login'];

/**
 * 보호된 경로 (로그인 필요)
 *
 * 인증된 사용자만 접근할 수 있는 경로
 * - /wipApplication: 관리자 대시보드
 * - /api/gcp: GCP 관련 API
 * - /api/track: 트래킹 API
 * - /api/auth/logout: 로그아웃 API
 */
const protectedPaths = ['/wipApplication', '/api/gcp', '/api/track', '/api/auth/logout'];

// ==================================================
// Middleware 함수
// ==================================================

/**
 * Middleware 핸들러
 *
 * @param request - HTTP 요청 객체
 * @returns NextResponse - 응답 또는 리다이렉트
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ==================================================
  // 1. 정적 파일 및 Next.js 내부 경로 무시
  // ==================================================

  // 다음 경로는 인증 체크를 건너뜀:
  // - /_next/*: Next.js 내부 파일 (JS, CSS 등)
  // - /static/*: 정적 파일
  // - *.확장자: 이미지, 폰트 등 (favicon.ico, logo.png 등)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // 확장자가 있는 파일
  ) {
    return NextResponse.next();
  }

  // ==================================================
  // 2. 공개 경로 통과
  // ==================================================

  // 로그인 페이지 및 로그인 API는 인증 없이 접근 가능
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // ==================================================
  // 3. 세션 확인
  // ==================================================

  // 쿠키에서 세션 토큰 추출
  const token = request.cookies.get('session')?.value;

  // 토큰 검증 및 복호화
  const session = token ? await decrypt(token) : null;

  // ==================================================
  // 4. 보호된 경로 접근 확인
  // ==================================================

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath && !session) {
    // 인증되지 않은 사용자가 보호된 경로 접근 시도
    console.warn('[MIDDLEWARE] Unauthorized access attempt:', {
      pathname,
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
      timestamp: new Date().toISOString(),
    });

    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ==================================================
  // 5. 루트 경로 처리
  // ==================================================

  if (pathname === '/') {
    // 로그인한 사용자: 메인 페이지로 리다이렉트
    if (session) {
      return NextResponse.redirect(new URL('/wipApplication', request.url));
    }
    // 로그인하지 않은 사용자: 로그인 페이지로 리다이렉트
    else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ==================================================
  // 6. 로그인 페이지 이중 접근 방지
  // ==================================================

  if (pathname === '/login' && session) {
    // 이미 로그인한 사용자가 로그인 페이지 접근 시
    // 메인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/wipApplication', request.url));
  }

  // ==================================================
  // 7. 요청 통과
  // ==================================================

  // 위 조건에 해당하지 않으면 요청 통과
  return NextResponse.next();
}

// ==================================================
// Middleware 설정
// ==================================================

/**
 * Middleware 적용 경로 설정
 *
 * matcher: Middleware가 실행될 경로 패턴
 *
 * 현재 설정:
 * - 모든 경로에 적용
 * - 단, 다음은 제외:
 *   - /_next/static: Next.js 정적 파일
 *   - /_next/image: 이미지 최적화 파일
 *   - /favicon.ico: 파비콘
 *
 * 정규식 설명:
 * - (?!...) : Negative lookahead (제외할 패턴)
 * - .* : 모든 문자
 */
export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 요청 경로에 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
