/**
 * Rate Limiting (로그인 시도 제한)
 *
 * 목적:
 * - Brute Force 공격 방어 (무차별 대입 공격)
 * - 짧은 시간에 많은 로그인 시도를 차단
 *
 * 전략:
 * - IP 주소당 15분에 5회로 제한
 * - Sliding Window 알고리즘 사용
 * - Upstash Redis 사용 (서버리스 환경 최적화)
 *
 * Upstash Redis 설정:
 * 1. https://upstash.com 에서 무료 계정 생성
 * 2. Redis 데이터베이스 생성
 * 3. REST API 탭에서 URL/Token 복사
 * 4. .env.local에 추가:
 *    UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
 *    UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ==================================================
// 환경변수 확인
// ==================================================

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Rate Limiting 활성화 여부 (Upstash 설정 시에만 활성화)
const isRateLimitEnabled = !!(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);

if (!isRateLimitEnabled) {
  console.warn(
    '⚠️  Rate Limiting이 비활성화되었습니다.\n' +
    '   Upstash Redis 환경변수를 설정하면 Brute Force 공격 방어가 활성화됩니다.\n' +
    '   설정 방법: https://upstash.com 에서 무료 계정 생성 후\n' +
    '   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN 설정'
  );
}

// ==================================================
// Redis 클라이언트 초기화
// ==================================================

let redis: Redis | null = null;
let loginRateLimit: Ratelimit | null = null;

if (isRateLimitEnabled) {
  // Redis 클라이언트 생성
  redis = new Redis({
    url: UPSTASH_REDIS_REST_URL!,
    token: UPSTASH_REDIS_REST_TOKEN!,
  });

  // Rate Limiter 생성
  loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 15분에 5회
    analytics: true,  // 통계 수집 활성화
    prefix: 'ratelimit:login',  // Redis 키 접두사
  });

  console.log('✅ Rate Limiting 활성화: 15분에 5회 로그인 시도 제한');
}

// ==================================================
// 타입 정의
// ==================================================

/**
 * Rate Limit 체크 결과
 */
export interface RateLimitResult {
  success: boolean;      // 요청 허용 여부
  limit: number;         // 최대 허용 횟수
  remaining: number;     // 남은 시도 횟수
  reset: number;         // 제한 해제 시간 (Unix timestamp)
  resetInMinutes: number; // 제한 해제까지 남은 시간 (분)
}

// ==================================================
// Rate Limit 체크 함수
// ==================================================

/**
 * 로그인 시도 횟수 확인
 *
 * @param identifier - 식별자 (보통 IP 주소)
 * @returns Rate Limit 결과
 *
 * 동작 원리 (Sliding Window):
 * 1. Redis에 identifier별로 카운터 저장
 * 2. 15분 윈도우 내에서 요청 횟수 카운트
 * 3. 5회 초과 시 요청 거부
 * 4. 윈도우가 지나면 자동으로 카운터 리셋
 *
 * 예시:
 * - 10:00에 5회 시도 → 10:15까지 차단
 * - 10:10에 1회, 10:20에 1회, 10:30에 1회 → 허용 (윈도우가 슬라이딩)
 *
 * 사용 예시:
 * const result = await checkRateLimit('192.168.1.1');
 * if (!result.success) {
 *   return '너무 많은 시도. ${result.resetInMinutes}분 후 다시 시도하세요.';
 * }
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // Rate Limiting이 비활성화된 경우 항상 허용
  if (!loginRateLimit) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      resetInMinutes: 0,
    };
  }

  try {
    // Rate Limit 체크
    const result = await loginRateLimit.limit(identifier);

    return {
      success: result.success,        // 요청 허용 여부
      limit: result.limit,            // 최대 5회
      remaining: result.remaining,     // 남은 횟수
      reset: result.reset,            // Unix timestamp (ms)
      resetInMinutes: Math.ceil((result.reset - Date.now()) / 1000 / 60), // 분 단위
    };
  } catch (error) {
    // Redis 연결 실패 등의 에러 발생 시
    console.error('❌ Rate Limit 체크 실패:', error);

    // 보안상 에러 발생 시에도 요청 허용 (서비스 중단 방지)
    // 단, 로그는 남겨서 모니터링 가능
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      resetInMinutes: 0,
    };
  }
}

/**
 * Rate Limit 수동 리셋 (관리자용)
 *
 * @param identifier - 리셋할 식별자
 *
 * 사용 사례:
 * - 정당한 사용자가 실수로 차단된 경우
 * - 테스트 중 카운터 초기화 필요 시
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  if (!redis) {
    console.warn('⚠️  Rate Limiting이 비활성화되어 리셋할 수 없습니다.');
    return;
  }

  try {
    const key = `ratelimit:login:${identifier}`;
    await redis.del(key);
    console.log(`✅ Rate Limit 리셋 완료: ${identifier}`);
  } catch (error) {
    console.error('❌ Rate Limit 리셋 실패:', error);
  }
}

/**
 * Rate Limit 상태 조회 (관리자용)
 *
 * @param identifier - 조회할 식별자
 * @returns 현재 카운터 값
 */
export async function getRateLimitStatus(identifier: string): Promise<number | null> {
  if (!redis) {
    return null;
  }

  try {
    const key = `ratelimit:login:${identifier}`;
    const count = await redis.get<number>(key);
    return count ?? 0;
  } catch (error) {
    console.error('❌ Rate Limit 상태 조회 실패:', error);
    return null;
  }
}
