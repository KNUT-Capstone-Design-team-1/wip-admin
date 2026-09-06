/**
 * 로그인 암호화 키쌍 진단 스크립트
 *
 * 사용법:
 *   node scripts/verify-login-keys.js
 *
 * 확인 항목:
 * 1. NEXT_PUBLIC_LOGIN_PUBLIC_KEY 가 .env.local 에 있고 파싱되는지
 * 2. LOGIN_PRIVATE_KEY 가 .env.local 에 있고 파싱되는지
 * 3. 공개키로 암호화한 값을 개인키로 복호화 시 원문이 복구되는지 (키쌍 일치)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local 파일이 없습니다:', envPath);
  process.exit(1);
}
const raw = fs.readFileSync(envPath, 'utf8');

/**
 * .env.local 에서 특정 KEY 의 값을 뽑아온다.
 * - 값이 큰따옴표/작은따옴표로 시작하면 닫는 따옴표까지 (여러 줄 허용) 캡처
 * - 아니면 해당 줄 끝까지 캡처
 * - 마지막에 \n 이스케이프를 실제 개행으로 복원
 */
function readEnvValue(source, key) {
  const startRegex = new RegExp(`^${key}=(.*)$`, 'm');
  const startMatch = source.match(startRegex);
  if (!startMatch) return null;

  const rest = source.slice(startMatch.index + `${key}=`.length);
  const first = rest[0];
  let value;
  if (first === '"' || first === "'") {
    const end = rest.indexOf(first, 1);
    if (end === -1) return null;
    value = rest.slice(1, end);
  } else {
    const newline = rest.indexOf('\n');
    value = newline === -1 ? rest : rest.slice(0, newline);
    value = value.trim();
  }
  return value.replace(/\\n/g, '\n');
}

const pubPem = readEnvValue(raw, 'NEXT_PUBLIC_LOGIN_PUBLIC_KEY');
const privPem = readEnvValue(raw, 'LOGIN_PRIVATE_KEY');

console.log('\n=== 환경변수 로딩 확인 ===');
console.log(
  'NEXT_PUBLIC_LOGIN_PUBLIC_KEY :',
  pubPem ? `${pubPem.length}자 (첫줄: ${pubPem.split('\n')[0]})` : '❌ 없음/파싱실패'
);
console.log(
  'LOGIN_PRIVATE_KEY           :',
  privPem ? `${privPem.length}자 (첫줄: ${privPem.split('\n')[0]})` : '❌ 없음/파싱실패'
);

if (!pubPem || !privPem) {
  console.error('\n❌ .env.local 에 키가 설정되지 않았거나 형식이 잘못되었습니다.');
  process.exit(1);
}

console.log('\n=== 키 파싱 확인 ===');
let pubKey, privKey;
try {
  pubKey = crypto.createPublicKey(pubPem);
  console.log('✅ 공개키 파싱 성공');
} catch (e) {
  console.error('❌ 공개키 파싱 실패:', e.message);
  process.exit(1);
}
try {
  privKey = crypto.createPrivateKey(privPem);
  console.log('✅ 개인키 파싱 성공');
} catch (e) {
  console.error('❌ 개인키 파싱 실패:', e.message);
  process.exit(1);
}

console.log('\n=== 키쌍 일치 확인 (암호화 → 복호화 라운드트립) ===');
const original = JSON.stringify({ username: 'test', password: 'secret', ts: Date.now() });
try {
  const ct = crypto.publicEncrypt(
    { key: pubKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    Buffer.from(original, 'utf8')
  );
  const pt = crypto.privateDecrypt(
    { key: privKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    ct
  );
  if (pt.toString('utf8') === original) {
    console.log('✅ 키쌍이 서로 일치합니다. 로그인 암호화 정상 동작 가능.');
  } else {
    console.error('❌ 복호화 결과가 원본과 다릅니다.');
    process.exit(1);
  }
} catch (e) {
  console.error('❌ 라운드트립 실패:', e.message);
  console.error('   → 공개키와 개인키가 서로 다른 쌍일 가능성 매우 높음.');
  process.exit(1);
}

console.log();
