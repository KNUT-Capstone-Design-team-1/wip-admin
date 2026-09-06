/**
 * 로그인 페이로드 서버 복호화 유틸
 *
 * - Node crypto 기반 RSA-OAEP (SHA-256)
 * - 개인키는 LOGIN_PRIVATE_KEY 에서 로드 (PEM PKCS#8/PKCS#1)
 * - 복호화 후 timestamp 유효성(±5분)까지 검증한다.
 */

import { createPrivateKey, privateDecrypt, constants, type KeyObject } from 'crypto';

const PRIVATE_KEY_PEM = (process.env.LOGIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');

const MAX_SKEW_MS = 5 * 60 * 1000; // 5분

let cachedKey: KeyObject | null = null;

function getPrivateKey(): KeyObject {
  if (cachedKey) return cachedKey;
  if (!PRIVATE_KEY_PEM) {
    throw new Error('LOGIN_PRIVATE_KEY 가 설정되지 않았습니다.');
  }
  cachedKey = createPrivateKey(PRIVATE_KEY_PEM);
  return cachedKey;
}

export type LoginDecryptError = 'malformed' | 'expired';

export interface DecryptedLoginPayload {
  username: string;
  password: string;
  ts: number;
}

export interface LoginDecryptResult {
  ok: boolean;
  error?: LoginDecryptError;
  payload?: DecryptedLoginPayload;
}

export function decryptLoginPayload(payloadB64: string): LoginDecryptResult {
  let json: string;
  try {
    const key = getPrivateKey();
    const plaintext = privateDecrypt(
      {
        key,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(payloadB64, 'base64')
    );
    json = plaintext.toString('utf8');
  } catch (e) {
    console.error('[LOGIN_CRYPTO] decrypt failed:', (e as Error).message);
    return { ok: false, error: 'malformed' };
  }

  let parsed: DecryptedLoginPayload;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    console.error('[LOGIN_CRYPTO] JSON parse failed:', (e as Error).message);
    return { ok: false, error: 'malformed' };
  }

  if (
    typeof parsed?.username !== 'string' ||
    typeof parsed?.password !== 'string' ||
    typeof parsed?.ts !== 'number'
  ) {
    return { ok: false, error: 'malformed' };
  }

  if (Math.abs(Date.now() - parsed.ts) > MAX_SKEW_MS) {
    return { ok: false, error: 'expired' };
  }

  return { ok: true, payload: parsed };
}
