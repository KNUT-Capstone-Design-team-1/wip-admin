/**
 * 인증 라이브러리
 *
 * 주요 기능:
 * 1. JWT 토큰 생성/검증 (jose 라이브러리 사용)
 * 2. 세션 생성/삭제 (HttpOnly 쿠키)
 * 3. 비밀번호 검증 (bcrypt 해시 비교)
 * 4. 현재 세션 조회
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// ==================================================
// 환경변수 검증
// ==================================================

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET) {
  throw new Error('⚠️  JWT_SECRET 환경변수가 설정되지 않았습니다!');
}

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  console.warn('⚠️  ADMIN_USERNAME 또는 ADMIN_PASSWORD_HASH가 설정되지 않았습니다.');
}

// JWT Secret을 바이트 배열로 변환 (jose 라이브러리 요구사항)
const secretKey = new TextEncoder().encode(JWT_SECRET);

// ==================================================
// 타입 정의
// ==================================================

/**
 * JWT 페이로드 (토큰에 저장되는 데이터)
 */
interface SessionPayload {
  username: string;      // 관리자 아이디
  expiresAt: Date;       // 만료 시간
}

// ==================================================
// JWT 암호화/복호화 함수
// ==================================================

/**
 * JWT 토큰 생성 (암호화)
 *
 * @param payload - 토큰에 저장할 데이터
 * @returns 암호화된 JWT 토큰 문자열
 *
 * 동작 원리:
 * 1. payload를 JSON으로 직렬화
 * 2. HS256 알고리즘으로 서명
 * 3. 발급 시간(iat)과 만료 시간(exp) 자동 설정
 * 4. 암호화된 토큰 반환
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })  // HMAC SHA-256 알고리즘
    .setIssuedAt()                          // 발급 시간 설정
    .setExpirationTime('24h')               // 24시간 후 만료
    .sign(secretKey);                       // JWT_SECRET으로 서명
}

/**
 * JWT 토큰 검증 및 복호화
 *
 * @param token - 검증할 JWT 토큰
 * @returns 복호화된 페이로드 또는 null (검증 실패 시)
 *
 * 동작 원리:
 * 1. 토큰 서명 검증 (변조 여부 확인)
 * 2. 만료 시간 검증
 * 3. 검증 성공 시 페이로드 반환
 * 4. 실패 시 null 반환 (에러 숨김)
 */
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],  // 허용할 알고리즘 명시 (보안)
    });
    return payload as unknown as SessionPayload;
  } catch {
    // 토큰 검증 실패 (만료, 변조, 형식 오류 등)
    // 보안상 구체적인 에러를 노출하지 않음
    return null;
  }
}

// ==================================================
// 세션 관리 함수
// ==================================================

/**
 * 현재 세션 조회
 *
 * @returns 세션 페이로드 또는 null (로그인하지 않은 경우)
 *
 * 사용 예시:
 * const session = await getSession();
 * if (session) {
 *   console.log('로그인 사용자:', session.username);
 * }
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return await decrypt(token);
}

/**
 * 새로운 세션 생성 (로그인)
 *
 * @param username - 관리자 아이디
 *
 * 동작 원리:
 * 1. 만료 시간 계산 (현재 시간 + 24시간)
 * 2. 페이로드 생성 (username, expiresAt)
 * 3. JWT 토큰 생성
 * 4. HttpOnly 쿠키에 저장
 *
 * HttpOnly 쿠키 보안 옵션:
 * - httpOnly: true  → JavaScript로 접근 불가 (XSS 방어)
 * - secure: prod만   → HTTPS에서만 전송
 * - sameSite: lax   → CSRF 공격 방어
 * - path: /         → 모든 경로에서 전송
 */
export async function createSession(username: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간
  const token = await encrypt({ username, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,                             // XSS 방어
    secure: process.env.NODE_ENV === 'production', // HTTPS only (프로덕션)
    expires: expiresAt,                         // 쿠키 만료 시간
    sameSite: 'lax',                           // CSRF 방어
    path: '/',                                  // 모든 경로에서 유효
  });
}

/**
 * 세션 삭제 (로그아웃)
 *
 * 동작 원리:
 * - 쿠키 저장소에서 'session' 쿠키 제거
 * - 클라이언트의 토큰이 삭제되어 인증 불가
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// ==================================================
// 비밀번호 검증 함수
// ==================================================

/**
 * 관리자 자격증명 검증
 *
 * @param username - 입력받은 아이디
 * @param password - 입력받은 평문 비밀번호
 * @returns 검증 성공 여부
 *
 * 동작 원리:
 * 1. 환경변수에서 저장된 아이디/해시 가져오기
 * 2. 아이디 일치 여부 확인
 * 3. bcrypt.compare()로 비밀번호 해시 비교
 *    - 평문 비밀번호를 동일한 방식으로 해싱
 *    - 저장된 해시와 비교
 *    - 일치하면 true, 아니면 false
 *
 * 보안 장점:
 * - 평문 비밀번호를 저장하지 않음
 * - 해시는 단방향이라 원본 비밀번호 복구 불가능
 * - bcrypt는 느린 알고리즘이라 Brute Force 공격에 강함
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // 환경변수 미설정 체크
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    console.error('⚠️  관리자 자격증명이 설정되지 않았습니다.');
    return false;
  }

  // 아이디 확인
  const isValidUsername = username === ADMIN_USERNAME;
  if (!isValidUsername) {
    return false;
  }

  // 비밀번호 해시 비교
  try {
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    return isValidPassword;
  } catch (error) {
    console.error('❌ 비밀번호 검증 오류:', error);
    return false;
  }
}
