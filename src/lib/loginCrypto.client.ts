/**
 * 로그인 페이로드 클라이언트 암호화 유틸
 *
 * - Web Crypto (SubtleCrypto) 기반 RSA-OAEP (SHA-256)
 * - 공개키는 NEXT_PUBLIC_LOGIN_PUBLIC_KEY 에서 로드 (PEM SPKI)
 * - payload 에 timestamp 를 포함시켜 매 요청마다 ciphertext 가 달라지고,
 *   서버측에서 replay attack 을 차단할 수 있게 한다.
 */

const PUBLIC_KEY_PEM = (process.env.NEXT_PUBLIC_LOGIN_PUBLIC_KEY ?? '').replace(/\\n/g, '\n');

export interface LoginPlainPayload {
  username: string;
  password: string;
  ts: number;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

let cachedKey: CryptoKey | null = null;

async function getPublicKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  if (!PUBLIC_KEY_PEM) {
    throw new Error('NEXT_PUBLIC_LOGIN_PUBLIC_KEY 가 설정되지 않았습니다.');
  }
  cachedKey = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(PUBLIC_KEY_PEM),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
  return cachedKey;
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.byteLength; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export async function encryptLoginPayload(
  input: Omit<LoginPlainPayload, 'ts'>
): Promise<string> {
  const key = await getPublicKey();
  const payload: LoginPlainPayload = { ...input, ts: Date.now() };
  const ct = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    new TextEncoder().encode(JSON.stringify(payload))
  );
  return bufferToBase64(ct);
}
