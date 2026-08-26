import { NextResponse } from "next/server";

/**
 * 메트릭 정보 설명 API
 * GET /api/gcp/metrics-info
 */
export async function GET() {
    return NextResponse.json({
        metrics: {
            apiCalls: {
                name: "API 호출 수",
                source: "Cloud Run request_count",
                description: "백엔드 서버로 들어오는 모든 HTTP 요청",
                includes: [
                    "알약 검색 API (예: GET /api/pills?search=타이레놀)",
                    "알약 상세 조회 (예: GET /api/pills/123)",
                    "이미지/리소스 요청",
                    "사용자 인증/인가",
                    "모든 REST API 엔드포인트 호출"
                ],
                isRealData: true,
                note: "실시간 GCP Cloud Run 데이터"
            },
            avgResponseTime: {
                name: "평균 응답시간",
                source: "Cloud Run request_latencies",
                description: "API 요청의 평균 응답 시간 (밀리초)",
                isRealData: true,
                note: "실시간 GCP Cloud Run 데이터"
            },
            activeUsers: {
                name: "일일 활성 사용자 (DAU)",
                source: "Mock 데이터",
                description: "앱을 실행한 고유 사용자 수",
                isRealData: false,
                howToCollect: [
                    "Firebase Analytics 연동",
                    "앱에서 user_engagement 이벤트 전송",
                    "BigQuery로 데이터 추출"
                ],
                note: "⚠️ 현재는 Mock 데이터 - 실제 수집 필요"
            },
            appSessions: {
                name: "앱 세션 수",
                source: "Mock 데이터",
                description: "앱이 시작된 횟수 (백그라운드 → 포그라운드 포함)",
                isRealData: false,
                howToCollect: [
                    "Firebase Analytics 자동 수집",
                    "session_start 이벤트 추적"
                ],
                note: "⚠️ 현재는 Mock 데이터 - 실제 수집 필요"
            },
            downloads: {
                name: "앱 다운로드 수",
                source: "Mock 데이터",
                description: "Google Play Store / Apple App Store에서의 다운로드 수",
                isRealData: false,
                howToCollect: [
                    "Google Play Console API 연동",
                    "Apple App Store Connect API 연동",
                    "매일 자동으로 다운로드 수 조회"
                ],
                note: "⚠️ 현재는 Mock 데이터 - Play Console/App Store API 연동 필요"
            }
        },
        summary: {
            realDataCount: 2,
            mockDataCount: 3,
            recommendation: "Firebase Analytics를 앱에 연동하면 activeUsers, appSessions를 실시간으로 수집할 수 있습니다."
        }
    });
}
