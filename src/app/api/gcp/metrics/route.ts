import { getAppMetrics, getDailyMetrics } from "@/lib/metrics";
import { NextRequest } from "next/server";

/**
 * 앱 메트릭 API
 * GET /api/gcp/metrics?days=30
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '30');

        // 날짜 범위 검증
        if (days < 1 || days > 365) {
            return Response.json(
                { error: 'days는 1~365 사이의 값이어야 합니다.' },
                { status: 400 }
            );
        }

        const metrics = await getAppMetrics(days);

        return Response.json({
            success: true,
            data: metrics,
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return Response.json(
            {
                success: false,
                error: 'Failed to fetch metrics',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
