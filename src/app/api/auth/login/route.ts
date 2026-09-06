/**
 * 로그인 API 엔드포인트
 *
 * POST /api/auth/login
 *
 * Request Body:
 * {
 *   "username": "admin",
 *   "password": "password123"
 * }
 *
 * Response (성공):
 * {
 *   "success": true,
 *   "message": "로그인되었습니다."
 * }
 *
 * Response (실패):
 * {
 *   "error": "에러 메시지"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { decryptLoginPayload } from '@/lib/loginCrypto.server';

/**
 * 로그인 API 핸들러
 *
 * 처리 순서:
 * 1. Rate Limit 체크 (Brute Force 방어)
 * 2. 입력 검증 (username, password 필수)
 * 3. 자격증명 확인 (bcrypt 해시 비교)
 * 4. 세션 생성 (JWT 토큰 발급, HttpOnly 쿠키 저장)
 * 5. 로그 기록 (성공/실패)
 */
export async function POST(request: NextRequest) {
  try {
    // ==================================================
    // 1. Rate Limit 체크
    // ==================================================

    // 클라이언트 IP 주소 추출
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';

    const rateLimitResult = await checkRateLimit(`login:${ip}`);

    if (!rateLimitResult.success) {
      // Rate Limit 초과 (15분에 5회 이상 시도)
      console.warn(`[AUTH] Rate limit exceeded: ${ip}`);

      return NextResponse.json(
        {
          error: `너무 많은 로그인 시도가 감지되었습니다. ${rateLimitResult.resetInMinutes}분 후 다시 시도해주세요.`,
          retryAfter: rateLimitResult.resetInMinutes,
        },
        {
          status: 429, // Too Many Requests
          headers: {
            'Retry-After': String(rateLimitResult.resetInMinutes * 60), // 초 단위
          },
        }
      );
    }

    // ==================================================
    // 2. 입력 검증
    // ==================================================

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    // 암호화된 payload 만 허용
    // 클라이언트가 NEXT_PUBLIC_LOGIN_PUBLIC_KEY 로 RSA-OAEP 암호화한 base64 문자열
    const encryptedPayload = body?.payload;
    if (typeof encryptedPayload !== 'string' || encryptedPayload.length === 0) {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    // 지나치게 큰 페이로드 차단 (2048bit RSA-OAEP ciphertext ≈ 344자 base64)
    if (encryptedPayload.length > 2048) {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    const decrypted = decryptLoginPayload(encryptedPayload);

    if (!decrypted.ok || !decrypted.payload) {
      // expired 는 재시도 유도, 그 외에는 일반 400
      if (decrypted.error === 'expired') {
        return NextResponse.json(
          { error: '요청이 만료되었습니다. 다시 시도해주세요.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    const { username, password } = decrypted.payload;

    // 필수 필드 체크
    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 길이 체크 (DoS 방어)
    if (username.length > 100 || password.length > 100) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 너무 깁니다.' },
        { status: 400 }
      );
    }

    // ==================================================
    // 3. 자격증명 확인
    // ==================================================

    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      // 로그인 실패 로그 기록
      console.error('[AUTH] Failed login attempt', {
        username,
        ip,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
      });

      // 보안상 구체적인 실패 이유를 노출하지 않음
      // (아이디 존재 여부를 알려주지 않음)
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 } // Unauthorized
      );
    }

    // ==================================================
    // 4. 세션 생성
    // ==================================================

    await createSession(username);

    // 로그인 성공 로그 기록
    console.log('[AUTH] Successful login', {
      username,
      ip,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });

    // ==================================================
    // 5. 성공 응답
    // ==================================================

    return NextResponse.json({
      success: true,
      message: '로그인되었습니다.',
    });
  } catch (error) {
    // 예상치 못한 에러 처리
    console.error('[AUTH] Login error:', error);

    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 } // Internal Server Error
    );
  }
}

/**
 * GET 메서드 처리 (에러 반환)
 *
 * 로그인은 POST만 허용
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405 }
  );
}
