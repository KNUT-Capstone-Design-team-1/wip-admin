/**
 * 로그아웃 API 엔드포인트
 *
 * POST /api/auth/logout
 *
 * Response (성공):
 * {
 *   "success": true,
 *   "message": "로그아웃되었습니다."
 * }
 *
 * Response (실패):
 * {
 *   "error": "에러 메시지"
 * }
 */

import { NextResponse } from 'next/server';
import { deleteSession, getSession } from '@/lib/auth';

/**
 * 로그아웃 API 핸들러
 *
 * 처리 순서:
 * 1. 현재 세션 확인 (선택사항)
 * 2. 세션 삭제 (쿠키 제거)
 * 3. 로그 기록
 */
export async function POST() {
  try {
    // ==================================================
    // 1. 현재 세션 확인 (로그 목적)
    // ==================================================

    const session = await getSession();
    const username = session?.username ?? 'unknown';

    // ==================================================
    // 2. 세션 삭제
    // ==================================================

    await deleteSession();

    // ==================================================
    // 3. 로그아웃 로그 기록
    // ==================================================

    console.log('[AUTH] Logout', {
      username,
      timestamp: new Date().toISOString(),
    });

    // ==================================================
    // 4. 성공 응답
    // ==================================================

    return NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.',
    });
  } catch (error) {
    // 예상치 못한 에러 처리
    console.error('[AUTH] Logout error:', error);

    // 로그아웃 실패해도 클라이언트에서는 로그아웃 처리
    // (쿠키 만료로 자연스럽게 로그아웃됨)
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET 메서드 처리 (에러 반환)
 *
 * 로그아웃은 POST만 허용
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use POST.' },
    { status: 405 }
  );
}
