import crypto from 'crypto';

function encodeBase64URL(base64String: string): string {
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Cloudflare Worker 인증 토큰 생성
 *
 * 형식: base64(timestamp).base64URL(HMAC-SHA256(timestamp, SECRET_KEY))
 * 유효기간: 10분 (Worker 측에서 검증)
 *
 * 참고: wip-serverless/src/cloud_flare/wip-notice/src/authentication.js 의 verifyToken 로직과 일치해야 함.
 */
export function generateCloudflareAuthToken(): string {
  const secretKey = process.env.CLOUD_FLARE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('CLOUD_FLARE_SECRET_KEY 환경변수가 설정되지 않았습니다.');
  }

  const timestamp = Date.now().toString();

  const timestampBase64 = Buffer.from(timestamp, 'utf-8').toString('base64');

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(timestamp)
    .digest('base64');

  return `${timestampBase64}.${encodeBase64URL(signature)}`;
}
