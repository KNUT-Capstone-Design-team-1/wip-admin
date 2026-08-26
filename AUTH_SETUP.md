# 🔐 관리자 로그인 설정 가이드

관리자 페이지에 로그인 기능이 추가되었습니다. 이 문서는 초기 설정 방법을 안내합니다.

---

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [환경변수 설정](#환경변수-설정)
3. [Rate Limiting 설정 (선택)](#rate-limiting-설정-선택)
4. [테스트](#테스트)
5. [배포](#배포)
6. [보안 권장사항](#보안-권장사항)
7. [트러블슈팅](#트러블슈팅)

---

## 🚀 빠른 시작

### 1. 비밀번호 해시 생성

관리자 비밀번호를 설정하려면 먼저 해시를 생성해야 합니다.

```bash
# 원하는 비밀번호로 해시 생성
node scripts/generate-credentials.js YourSecurePassword123!
```

**출력 예시:**
```
✅ 생성 완료!

======================================================================
아래 내용을 .env.local 파일에 추가하세요:
======================================================================

# 관리자 로그인 자격증명
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Secret (세션 암호화용)
JWT_SECRET=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

======================================================================
```

### 2. .env.local 파일 수정

위에서 생성된 값들을 `.env.local` 파일에 복사하여 붙여넣습니다.

```bash
# .env.local 파일 열기
vim .env.local
# 또는
code .env.local
```

**필수 환경변수:**
```bash
# 관리자 로그인 자격증명
ADMIN_USERNAME=admin                           # 원하는 아이디로 변경 가능
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxx...       # 생성된 해시 붙여넣기
JWT_SECRET=abcdef1234567890...                 # 생성된 Secret 붙여넣기
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 로그인 테스트

브라우저에서 접속:
```
http://localhost:3000
```

자동으로 로그인 페이지로 리다이렉트됩니다.

- **아이디**: `ADMIN_USERNAME`에 설정한 값 (기본: `admin`)
- **비밀번호**: 해시 생성 시 사용한 원본 비밀번호

---

## 🔧 환경변수 설정

### 필수 환경변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `ADMIN_USERNAME` | 관리자 아이디 | `admin` |
| `ADMIN_PASSWORD_HASH` | bcrypt 해시된 비밀번호 | `$2a$10$xxx...` |
| `JWT_SECRET` | JWT 토큰 암호화 키 | `abc123...` (32바이트 랜덤) |

### 선택 환경변수 (Rate Limiting)

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis 토큰 | `xxxxxxxx` |

---

## 🛡️ Rate Limiting 설정 (선택)

Rate Limiting은 무차별 대입 공격(Brute Force)을 방어합니다.

### Upstash Redis 무료 계정 생성

1. **Upstash 가입**
   - https://upstash.com 접속
   - 무료 계정 생성 (GitHub/Google 로그인 가능)

2. **Redis 데이터베이스 생성**
   - Dashboard → "Create Database" 클릭
   - Region: 가까운 지역 선택 (예: `ap-northeast-2`)
   - Type: "Regional" 선택
   - "Create" 클릭

3. **REST API 정보 복사**
   - 생성된 데이터베이스 클릭
   - "REST API" 탭 선택
   - `UPSTASH_REDIS_REST_URL` 복사
   - `UPSTASH_REDIS_REST_TOKEN` 복사

4. **.env.local에 추가**
   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx-xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxx
   ```

### Rate Limiting 효과

- **15분에 5회 로그인 시도 제한**
- 초과 시 자동으로 차단
- 차단 시간 경과 후 자동 해제

**설정하지 않으면?**
- 로그인 기능은 정상 작동
- Rate Limiting만 비활성화
- 콘솔에 경고 메시지 표시

---

## 🧪 테스트

### 1. 로그인 성공 테스트

```bash
# 서버 로그 확인
# ✅ [AUTH] Successful login { username: 'admin', ip: '::1', ... }
```

### 2. 로그인 실패 테스트

잘못된 비밀번호로 로그인 시도:
```bash
# 서버 로그 확인
# ❌ [AUTH] Failed login attempt { username: 'admin', ip: '::1', ... }
```

### 3. Rate Limiting 테스트 (Upstash 설정 시)

5회 연속 실패 시도 후:
```
너무 많은 로그인 시도가 감지되었습니다. 15분 후 다시 시도해주세요.
```

### 4. 로그아웃 테스트

1. 로그인 후 대시보드 진입
2. 사이드바 하단 프로필 섹션 → 3-dot 메뉴 클릭
3. "로그아웃" 클릭
4. 로그인 페이지로 리다이렉트 확인

### 5. 인증 보호 테스트

로그아웃 상태에서 직접 URL 접속 시도:
```
http://localhost:3000/wipApplication
```

자동으로 로그인 페이지로 리다이렉트되어야 합니다.

---

## 🚢 배포

### Vercel 배포

1. **환경변수 설정**
   ```bash
   # Vercel CLI 설치 (선택)
   npm i -g vercel

   # 환경변수 추가
   vercel env add ADMIN_USERNAME
   # 입력: admin

   vercel env add ADMIN_PASSWORD_HASH
   # 입력: $2a$10$xxxxxxxx...

   vercel env add JWT_SECRET
   # 입력: abcdef123456...

   # Rate Limiting 사용 시
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN
   ```

2. **Vercel Dashboard에서 설정**
   - Project Settings → Environment Variables
   - 위 환경변수들을 Production/Preview/Development에 추가

3. **배포**
   ```bash
   vercel --prod
   ```

### 기타 플랫폼

**Netlify:**
- Site settings → Environment variables → Add variable

**AWS Amplify:**
- App settings → Environment variables → Manage variables

**Docker:**
```dockerfile
# .env 파일 생성 (절대 Git에 커밋하지 마세요!)
ENV ADMIN_USERNAME=admin
ENV ADMIN_PASSWORD_HASH=$2a$10$xxx...
ENV JWT_SECRET=abc123...
```

---

## 🔒 보안 권장사항

### ✅ 필수 사항

1. **강력한 비밀번호 사용**
   - 최소 12자 이상
   - 대소문자, 숫자, 특수문자 조합
   - 예: `Adm!nP@ssw0rd2024!`

2. **JWT Secret 보안**
   - 최소 32바이트 랜덤 문자열
   - 주기적으로 변경 (3-6개월)
   - 절대 Git에 커밋하지 않기

3. **환경변수 관리**
   - `.env.local`은 `.gitignore`에 포함 (✅ 이미 포함됨)
   - 배포 환경마다 다른 비밀번호 사용
   - 팀원과 비밀번호 공유 시 안전한 채널 사용 (1Password, Bitwarden 등)

4. **HTTPS 사용**
   - 프로덕션 환경에서는 반드시 HTTPS
   - Vercel/Netlify는 자동으로 HTTPS 제공

### 🔐 권장 사항

5. **Rate Limiting 활성화**
   - Upstash Redis 설정 (무료)
   - Brute Force 공격 방어

6. **로그 모니터링**
   - 실패한 로그인 시도 추적
   - Vercel Logs 또는 서버 로그 확인
   - 의심스러운 IP 차단 고려

7. **정기적인 비밀번호 변경**
   - 3-6개월마다 변경
   - 변경 방법:
     ```bash
     node scripts/generate-credentials.js NewPassword123!
     # 새 해시를 .env.local에 업데이트
     ```

8. **2FA 고려 (향후)**
   - Google Authenticator
   - SMS 인증
   - 이메일 인증

### ⚠️ 절대 하지 말아야 할 것

- ❌ 평문 비밀번호를 코드에 하드코딩
- ❌ `.env.local`을 Git에 커밋
- ❌ 비밀번호를 Slack/Discord/이메일로 전송
- ❌ `admin`, `password`, `123456` 같은 약한 비밀번호 사용
- ❌ JWT_SECRET을 공개 저장소에 노출

---

## 🐛 트러블슈팅

### 문제 1: "JWT_SECRET 환경변수가 설정되지 않았습니다"

**원인:** `.env.local`에 `JWT_SECRET`이 없거나 비어있음

**해결:**
```bash
# 1. 새 JWT Secret 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. .env.local에 추가
JWT_SECRET=<생성된 값>

# 3. 서버 재시작
npm run dev
```

---

### 문제 2: "아이디 또는 비밀번호가 올바르지 않습니다"

**원인 1:** 비밀번호 해시가 잘못됨

**해결:**
```bash
# 1. 비밀번호 해시 재생성
node scripts/generate-credentials.js YourPassword123!

# 2. 새 해시를 .env.local에 복사

# 3. 서버 재시작
```

**원인 2:** 아이디가 다름

**해결:**
```bash
# .env.local 확인
cat .env.local | grep ADMIN_USERNAME
# ADMIN_USERNAME=admin

# 로그인 시 정확히 동일한 아이디 입력
```

---

### 문제 3: Rate Limiting 경고 메시지

**메시지:**
```
⚠️  Rate Limiting이 비활성화되었습니다.
   Upstash Redis 환경변수를 설정하면 Brute Force 공격 방어가 활성화됩니다.
```

**원인:** Upstash Redis가 설정되지 않음

**해결:**
- 선택사항입니다. 무시해도 로그인 기능은 정상 작동합니다.
- Rate Limiting을 활성화하려면 위의 [Rate Limiting 설정](#rate-limiting-설정-선택) 참고

---

### 문제 4: 로그인 후 계속 로그인 페이지로 리다이렉트

**원인:** 쿠키가 저장되지 않음 (브라우저 설정)

**해결:**
1. 브라우저 쿠키 설정 확인 (차단 해제)
2. 시크릿 모드/프라이빗 모드 해제
3. 다른 브라우저에서 테스트

---

### 문제 5: 배포 후 500 에러

**원인:** 배포 환경에 환경변수가 설정되지 않음

**해결:**
```bash
# Vercel 예시
vercel env ls  # 환경변수 목록 확인

# 누락된 변수 추가
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD_HASH
vercel env add JWT_SECRET

# 재배포
vercel --prod
```

---

## 📚 추가 정보

### 구현된 보안 기능

| 기능 | 설명 | 상태 |
|------|------|------|
| 비밀번호 해싱 | bcrypt (salt rounds = 10) | ✅ |
| JWT 토큰 | HS256, 24시간 유효 | ✅ |
| HttpOnly 쿠키 | XSS 공격 방어 | ✅ |
| SameSite 쿠키 | CSRF 공격 방어 | ✅ |
| Rate Limiting | 15분에 5회 제한 | ✅ (선택) |
| Middleware 인증 | 자동 경로 보호 | ✅ |
| 로그 기록 | 성공/실패 추적 | ✅ |
| HTTPS | 프로덕션 필수 | ⚠️ (배포 시) |

### 파일 구조

```
wip-application-admin/
├── src/
│   ├── lib/
│   │   ├── auth.ts              # 인증 라이브러리
│   │   └── rate-limit.ts        # Rate Limiting
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx         # 로그인 페이지
│   │   └── api/
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts # 로그인 API
│   │           └── logout/
│   │               └── route.ts # 로그아웃 API
│   └── shared/
│       └── components/
│           └── DashboardLayout.tsx  # 로그아웃 버튼
├── middleware.ts                # 인증 Middleware
├── scripts/
│   └── generate-credentials.js  # 비밀번호 해시 생성
└── .env.local                   # 환경변수 (Git 제외)
```

### 도움이 필요하신가요?

문제가 해결되지 않으면 다음을 확인하세요:

1. **서버 로그 확인**
   ```bash
   npm run dev
   # 콘솔에 출력되는 에러 메시지 확인
   ```

2. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - Network 탭에서 API 응답 확인

3. **환경변수 확인**
   ```bash
   # Node.js에서 환경변수 읽기 테스트
   node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.ADMIN_USERNAME)"
   ```

---

## ✨ 완료!

이제 관리자 페이지가 안전하게 보호되었습니다. 🎉

**다음 단계:**
1. 강력한 비밀번호로 `.env.local` 설정
2. Rate Limiting 활성화 (권장)
3. 배포 환경에 환경변수 설정
4. 정기적인 비밀번호 변경

**보안 유지:**
- 비밀번호를 정기적으로 변경하세요 (3-6개월)
- 로그를 주기적으로 확인하세요
- HTTPS를 반드시 사용하세요
- Rate Limiting을 활성화하세요
