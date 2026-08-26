# 📊 메트릭 수집 가이드

## 현재 상태

현재 대시보드는 **Cloud Run의 API 호출 수**만 실제로 수집하고 있습니다.
나머지 메트릭(DAU, 다운로드 수 등)은 **Mock 데이터**로 표시됩니다.

## 수집 가능한 메트릭

### 1. ✅ 이미 수집 중
- **API 호출 수** (`apiCalls`) - Cloud Run `request_count`
- **평균 응답시간** (`avgResponseTime`) - Cloud Run `request_latencies`

### 2. ❌ 아직 미구현 (Mock 데이터)
- **일일 활성 사용자** (`activeUsers`) - DAU
- **앱 세션 수** (`appSessions`)
- **앱 다운로드 수** (`downloads`)

---

## 실제 데이터 수집 방법

### 옵션 A: Firebase Analytics (추천) 🔥

Firebase Analytics를 앱에 연동하면 자동으로 수집됩니다.

#### 1. Firebase 설정
```bash
# React Native/Flutter
npm install @react-native-firebase/analytics
# 또는
flutter pub add firebase_analytics
```

#### 2. 앱에서 이벤트 전송
```typescript
// 앱 실행 시
await analytics().logEvent('app_open', {
  userId: user.id,
  timestamp: Date.now(),
});

// 화면 조회 시
await analytics().logScreenView({
  screen_name: 'HomeScreen',
  screen_class: 'HomeScreen',
});
```

#### 3. BigQuery 연동
Firebase Console → Analytics → BigQuery 연결

#### 4. 관리자 페이지에서 데이터 가져오기
```typescript
// src/lib/firebase-analytics.ts
import { BigQuery } from '@google-cloud/bigquery';

export async function getDailyActiveUsers(date: string) {
  const bigquery = new BigQuery();
  const query = `
    SELECT
      COUNT(DISTINCT user_pseudo_id) as dau
    FROM \`what-is-pill.analytics_XXXXX.events_*\`
    WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', DATE '${date}')
    AND event_name = 'app_open'
  `;

  const [rows] = await bigquery.query(query);
  return rows[0].dau;
}
```

---

### 옵션 B: 커스텀 메트릭 전송

#### 1. 앱에서 백엔드로 이벤트 전송
```typescript
// 앱 시작 시
fetch('https://api.what-is-pill.com/track', {
  method: 'POST',
  body: JSON.stringify({
    event: 'app_open',
    userId: user.id,
    timestamp: Date.now(),
  }),
});
```

#### 2. 백엔드에서 Cloud Monitoring에 기록
```typescript
// src/lib/track-metrics.ts
import { MetricServiceClient } from '@google-cloud/monitoring';

const client = new MetricServiceClient();

export async function trackAppOpen(userId: string) {
  const dataPoint = {
    interval: {
      endTime: { seconds: Math.floor(Date.now() / 1000) },
    },
    value: { int64Value: 1 },
  };

  await client.createTimeSeries({
    name: `projects/what-is-pill`,
    timeSeries: [{
      metric: {
        type: 'custom.googleapis.com/app/active_users',
      },
      resource: {
        type: 'global',
      },
      points: [dataPoint],
    }],
  });
}
```

#### 3. API 엔드포인트 생성
```typescript
// src/app/api/track/route.ts
export async function POST(request: Request) {
  const { event, userId } = await request.json();

  if (event === 'app_open') {
    await trackAppOpen(userId);
  }

  return Response.json({ success: true });
}
```

---

### 옵션 C: Play Store/App Store 데이터

#### Play Console API
```typescript
import { google } from 'googleapis';

const androidPublisher = google.androidpublisher('v3');

export async function getPlayStoreMetrics() {
  const res = await androidPublisher.stats.get({
    packageName: 'com.whatispill.app',
    // ... 인증 정보
  });

  return {
    downloads: res.data.downloads,
    activeUsers: res.data.activeUsers,
  };
}
```

#### App Store Connect API
```typescript
import fetch from 'node-fetch';

export async function getAppStoreMetrics() {
  const response = await fetch('https://api.appstoreconnect.apple.com/v1/apps/{id}/metrics', {
    headers: {
      'Authorization': `Bearer ${appStoreToken}`,
    },
  });

  return await response.json();
}
```

---

## 현재 코드 구조

```
src/
├── lib/
│   └── metrics.ts              # 메트릭 수집 로직
├── app/
│   └── api/
│       └── gcp/
│           ├── metrics/        # 종합 메트릭 API
│           └── daily-metrics/  # 일별 메트릭 API
└── features/
    └── wipApplication/
        └── components/
            └── DashboardContent.tsx  # 대시보드 표시
```

## 메트릭 타입 정의

```typescript
interface DailyMetrics {
  date: string;
  activeUsers: number;      // DAU - Firebase/커스텀 트래킹 필요
  appSessions: number;      // 세션 수 - Firebase/커스텀 트래킹 필요
  apiCalls: number;         // ✅ Cloud Run에서 수집 중
  downloads: number;        // Play Store/App Store API 필요
  avgResponseTime: number;  // ✅ Cloud Run에서 수집 중
}
```

## 다음 단계

1. **Firebase Analytics 연동** (가장 간단)
2. **BigQuery 연결**
3. **관리자 페이지에서 BigQuery 쿼리**
4. Mock 데이터를 실제 데이터로 교체

---

## 참고 링크

- [Firebase Analytics 문서](https://firebase.google.com/docs/analytics)
- [BigQuery 연동](https://firebase.google.com/docs/analytics/bigquery-export)
- [Cloud Monitoring 커스텀 메트릭](https://cloud.google.com/monitoring/custom-metrics)
- [Play Console API](https://developers.google.com/android-publisher)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
