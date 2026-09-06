/**
 * public.pem / private.pem 을 읽어 .env.local 에 붙여넣을 형식으로 출력합니다.
 *
 * 사용법:
 *   node scripts/print-login-keys-env.js
 *
 * 그대로 .env.local 파일 끝에 붙여넣으면 됩니다.
 * (이미 NEXT_PUBLIC_LOGIN_PUBLIC_KEY / LOGIN_PRIVATE_KEY 항목이 있다면 먼저 지우세요)
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pubPath = path.join(root, 'public.pem');
const privPath = path.join(root, 'private.pem');

if (!fs.existsSync(pubPath) || !fs.existsSync(privPath)) {
  console.error('❌ public.pem 또는 private.pem 이 프로젝트 루트에 없습니다.');
  console.error('   먼저 아래 명령으로 키를 생성하세요:');
  console.error('     openssl genrsa -out private.pem 2048');
  console.error('     openssl rsa -in private.pem -pubout -out public.pem');
  process.exit(1);
}

const pub = fs.readFileSync(pubPath, 'utf8').trim();
const priv = fs.readFileSync(privPath, 'utf8').trim();

console.log('\n===== 아래를 .env.local 파일 끝에 그대로 붙여넣으세요 =====\n');
console.log(`NEXT_PUBLIC_LOGIN_PUBLIC_KEY="${pub}"`);
console.log();
console.log(`LOGIN_PRIVATE_KEY="${priv}"`);
console.log('\n===== 여기까지 =====\n');
console.log('※ 큰따옴표(") 포함해서 통째로 복사하세요.');
console.log('※ .env.local 에 이미 같은 이름의 키가 있다면 먼저 지우세요.');
console.log('※ 붙여넣은 뒤 dev 서버를 재시작하세요.\n');
