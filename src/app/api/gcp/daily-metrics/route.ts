import { getDailyMetrics } from "@/lib/metrics";
import { NextRequest } from "next/server";

/**
 * 일별 메트릭 API
 * GET /api/gcp/daily-metrics?days=7
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '7');

        if (days < 1 || days > 365) {
            return Response.json(
                { error: 'days는 1~365 사이의 값이어야 합니다.' },
                { status: 400 }
            );
        }

        const dailyMetrics = await getDailyMetrics(days);

        return Response.json({
            success: true,
            data: dailyMetrics,
        });
    } catch (error) {
        console.error('Error fetching daily metrics:', error);
        return Response.json(
            {
                success: false,
                error: 'Failed to fetch daily metrics',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
