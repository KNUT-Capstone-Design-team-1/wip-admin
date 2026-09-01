const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('사용법: node scripts/verify-password.js <입력한_비번>');
  process.exit(1);
}
const password = args[0];

const envPath = path.join(__dirname, '..', '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const match = env.match(/^ADMIN_PASSWORD_HASH=(.*)$/m);
if (!match) {
  console.error('ADMIN_PASSWORD_HASH 못 찾음');
  process.exit(1);
}
let hash = match[1].trim();
if ((hash.startsWith("'") && hash.endsWith("'")) || (hash.startsWith('"') && hash.endsWith('"'))) {
  hash = hash.slice(1, -1);
}

console.log('입력한 비번:', JSON.stringify(password));
console.log('해시:', hash);
console.log('해시 길이:', hash.length);
console.log('매치 결과:', bcrypt.compareSync(password, hash));
