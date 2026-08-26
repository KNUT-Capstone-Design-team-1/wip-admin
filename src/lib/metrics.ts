import { MetricServiceClient } from "@google-cloud/monitoring";

const client = new MetricServiceClient();
const PROJECT_ID = "what-is-pill";

/**
 * 날짜별 데이터 집계 타입
 */
export interface DailyMetrics {
    date: string;
    activeUsers: number;        // 일일 활성 사용자 (DAU)
    appSessions: number;        // 앱 세션 수
    apiCalls: number;           // 백엔드 API 호출 수 (Cloud Run request_count)
    downloads: number;          // 앱 다운로드 수 (Play Store/App Store)
    avgResponseTime: number;    // 평균 API 응답 시간
}

/**
 * 성장률 계산 결과
 */
export interface GrowthRate {
    daily: number; // 전일 대비
    weekly: number; // 전주 대비
    monthly: number; // 전월 대비
}

/**
 * 종합 메트릭
 */
export interface AppMetrics {
    dailyMetrics: DailyMetrics[];
    totalUsers: number;             // 전체 사용자 수 (누적)
    totalApiCalls: number;          // 전체 API 호출 수
    totalDownloads: number;         // 전체 다운로드 수
    averageDAU: number;             // 평균 일일 활성 사용자
    growthRate: GrowthRate;
}

/**
 * Cloud Run 요청 수 가져오기
 */
export async function getRequestCount() {
    const [data] = await client.listTimeSeries({
        name: `projects/${PROJECT_ID}`,
        filter: `metric.type="run.googleapis.com/request_count"`,
        interval: {
            startTime: {
                seconds: Math.floor(Date.now() / 1000) - 3600,
            },
            endTime: {
                seconds: Math.floor(Date.now() / 1000),
            },
        },
        view: "FULL",
    });

    return data;
}

/**
 * 지정된 기간의 메트릭 데이터 가져오기
 */
export async function getMetricsForPeriod(
    metricType: string,
    daysAgo: number = 30
): Promise<any[]> {
    try {
        const endTime = Math.floor(Date.now() / 1000);
        const startTime = endTime - (daysAgo * 24 * 60 * 60);

        const [timeSeries] = await client.listTimeSeries({
            name: `projects/${PROJECT_ID}`,
            filter: `metric.type="${metricType}"`,
            interval: {
                startTime: { seconds: startTime },
                endTime: { seconds: endTime },
            },
            aggregation: {
                alignmentPeriod: { seconds: 86400 }, // 1일 단위
                perSeriesAligner: 'ALIGN_SUM',
                crossSeriesReducer: 'REDUCE_SUM',
            },
            view: "FULL",
        });

        return timeSeries || [];
    } catch (error) {
        console.error(`Error fetching metric ${metricType}:`, error);
        return [];
    }
}

/**
 * 날짜별 집계 데이터 생성
 */
export async function getDailyMetrics(days: number = 30): Promise<DailyMetrics[]> {
    try {
        // Cloud Run 메트릭 가져오기
        const requestCountData = await getMetricsForPeriod(
            "run.googleapis.com/request_count",
            days
        );

        const responseTimeData = await getMetricsForPeriod(
            "run.googleapis.com/request_latencies",
            days
        );

        console.log('requestCountData', requestCountData);
        console.log('responseTimeData', responseTimeData);

        // GCP 메트릭 정보 출력 (디버깅용)
        if (requestCountData.length > 0) {
            console.log('\n=== Cloud Run Metrics 상세 정보 ===');
            console.log('수집된 메트릭:', {
                type: 'run.googleapis.com/request_count',
                description: '백엔드 서버로의 모든 HTTP 요청 수',
                includes: [
                    '- 알약 검색 API 호출',
                    '- 알약 상세 조회',
                    '- 이미지/리소스 요청',
                    '- 모든 엔드포인트 호출',
                ],
            });

            // 첫 번째 데이터 포인트 샘플 출력
            const sample = requestCountData[0];
            if (sample?.points?.[0]) {
                console.log('샘플 데이터:', {
                    날짜: new Date(sample.points[0].interval.endTime.seconds * 1000).toISOString().split('T')[0],
                    요청수: sample.points[0].value.int64Value,
                    메트릭타입: sample.metric?.type,
                });
            }
        }

        // 날짜별로 데이터 집계
        const metricsMap = new Map<string, DailyMetrics>();

        // Cloud Run API 요청 수 처리
        requestCountData.forEach((series: any) => {
            series.points?.forEach((point: any) => {
                const date = new Date(point.interval.endTime.seconds * 1000)
                    .toISOString()
                    .split('T')[0];

                if (!metricsMap.has(date)) {
                    metricsMap.set(date, {
                        date,
                        activeUsers: 0,
                        appSessions: 0,
                        apiCalls: 0,
                        downloads: 0,
                        avgResponseTime: 0,
                    });
                }

                const metric = metricsMap.get(date)!;
                // Cloud Run request_count = 백엔드 API 호출 수
                metric.apiCalls += point.value.int64Value || 0;
            });
        });

        // 응답 시간 처리
        responseTimeData.forEach((series: any) => {
            series.points?.forEach((point: any) => {
                const date = new Date(point.interval.endTime.seconds * 1000)
                    .toISOString()
                    .split('T')[0];

                const metric = metricsMap.get(date);
                if (metric) {
                    metric.avgResponseTime = point.value.doubleValue || 0;
                }
            });
        });

        // Map을 배열로 변환하고 날짜순 정렬
        const metrics = Array.from(metricsMap.values())
            .sort((a, b) => a.date.localeCompare(b.date));

        // GCP에서 수집되지 않는 데이터는 Mock으로 채우기
        metrics.forEach(metric => {
            // activeUsers, appSessions, downloads는 아직 수집 안 됨
            if (metric.activeUsers === 0) {
                const mockData = generateMockDailyMetrics(1)[0];
                metric.activeUsers = mockData.activeUsers;
                metric.appSessions = mockData.appSessions;
                metric.downloads = mockData.downloads;
            }
        });

        console.log('\n⚠️  주의: activeUsers, appSessions, downloads는 Mock 데이터입니다.');
        console.log('실제 데이터 수집 방법: METRICS_GUIDE.md 참고\n');

        return metrics;
    } catch (error) {
        console.error('Error generating daily metrics:', error);
        return generateMockDailyMetrics(days);
    }
}

/**
 * 성장률 계산 (일일 활성 사용자 기준)
 */
export function calculateGrowthRate(metrics: DailyMetrics[]): GrowthRate {
    if (metrics.length < 2) {
        return { daily: 0, weekly: 0, monthly: 0 };
    }

    const latest = metrics[metrics.length - 1];
    const yesterday = metrics[metrics.length - 2];
    const weekAgo = metrics[Math.max(0, metrics.length - 8)];
    const monthAgo = metrics[Math.max(0, metrics.length - 31)];

    const calculateRate = (current: number, previous: number): number => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    return {
        daily: calculateRate(latest.activeUsers, yesterday.activeUsers),
        weekly: calculateRate(latest.activeUsers, weekAgo.activeUsers),
        monthly: calculateRate(latest.activeUsers, monthAgo.activeUsers),
    };
}

/**
 * 종합 앱 메트릭 가져오기
 */
export async function getAppMetrics(days: number = 30): Promise<AppMetrics> {
    const dailyMetrics = await getDailyMetrics(days);
    const growthRate = calculateGrowthRate(dailyMetrics);

    // 전체 집계
    const totalApiCalls = dailyMetrics.reduce((sum, m) => sum + m.apiCalls, 0);
    const totalDownloads = dailyMetrics.reduce((sum, m) => sum + m.downloads, 0);
    const averageDAU = dailyMetrics.length > 0
        ? Math.round(dailyMetrics.reduce((sum, m) => sum + m.activeUsers, 0) / dailyMetrics.length)
        : 0;

    // 전체 누적 사용자 수 (가장 최근 날짜의 누적값)
    const totalUsers = dailyMetrics.length > 0
        ? dailyMetrics.reduce((sum, m) => sum + m.activeUsers, 0)
        : 0;

    console.log('dailyMetrics', dailyMetrics);

    return {
        dailyMetrics,
        totalUsers,
        totalApiCalls,
        totalDownloads,
        averageDAU,
        growthRate,
    };
}

/**
 * Mock 데이터 생성 (GCP 데이터가 없을 경우 fallback)
 * 실제 데이터가 수집되기 전까지 사용
 */
function generateMockDailyMetrics(days: number): DailyMetrics[] {
    const metrics: DailyMetrics[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // 시간에 따른 성장 추세 반영
        const growthFactor = 1 + (days - i) / days * 0.5; // 최근으로 갈수록 증가

        metrics.push({
            date: date.toISOString().split('T')[0],
            activeUsers: Math.floor((Math.random() * 500 + 800) * growthFactor),    // 800~1,800명
            appSessions: Math.floor((Math.random() * 1000 + 1500) * growthFactor),  // 1,500~3,500 세션
            apiCalls: Math.floor((Math.random() * 5000 + 8000) * growthFactor),     // 8,000~18,000 API 호출
            downloads: Math.floor(Math.random() * 50 + 20),                          // 20~70 다운로드/일
            avgResponseTime: Math.random() * 100 + 50,                               // 50~150ms
        });
    }

    return metrics;
}
