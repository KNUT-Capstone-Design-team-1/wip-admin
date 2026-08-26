/**
 * 관리자 로그인 자격증명 생성 스크립트
 *
 * 사용법:
 * node scripts/generate-credentials.js <비밀번호>
 *
 * 예시:
 * node scripts/generate-credentials.js MySecurePassword123!
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ 에러: 비밀번호를 입력해주세요.');
  console.log('\n사용법: node scripts/generate-credentials.js <비밀번호>\n');
  console.log('예시: node scripts/generate-credentials.js MySecurePassword123!\n');
  process.exit(1);
}

const password = args[0];

// 비밀번호 강도 체크
if (password.length < 8) {
  console.warn('⚠️  경고: 비밀번호가 너무 짧습니다. 최소 8자 이상 권장합니다.');
}

console.log('\n🔐 로그인 자격증명 생성 중...\n');

// 1. 비밀번호 해시 생성 (bcrypt, salt rounds = 10)
const passwordHash = bcrypt.hashSync(password, 10);

// 2. JWT Secret 생성 (32바이트 랜덤)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('✅ 생성 완료!\n');
console.log('='.repeat(70));
console.log('아래 내용을 .env.local 파일에 추가하세요:');
console.log('='.repeat(70));
console.log();
console.log('# 관리자 로그인 자격증명');
console.log('ADMIN_USERNAME=admin');
console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
console.log();
console.log('# JWT Secret (세션 암호화용)');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log();
console.log('='.repeat(70));
console.log();
console.log('📝 참고사항:');
console.log('- ADMIN_USERNAME은 원하는 아이디로 변경 가능합니다.');
console.log('- 이 값들을 절대 Git에 커밋하지 마세요!');
console.log('- 배포 시에는 Vercel/Netlify 환경변수에 동일하게 설정하세요.');
console.log();
