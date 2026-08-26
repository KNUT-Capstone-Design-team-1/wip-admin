'use client';

import {
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import DashboardContent from "@/features/wipApplication/components/DashboardContent";
import RecentActivity from "@/features/wipApplication/components/RecentActivity";
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import {useEffect, useState} from "react";

interface AppMetrics {
  dailyMetrics: any[];
  totalUsers: number;             // 전체 누적 사용자 수
  totalApiCalls: number;          // 전체 API 호출 수
  totalDownloads: number;         // 전체 다운로드 수
  averageDAU: number;             // 평균 일일 활성 사용자
  growthRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<AppMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/gcp/metrics?days=30");
                const data = await res.json();

                if (data.success) {
                    setMetrics(data.data);
                } else {
                    setError(data.error || '데이터를 불러올 수 없습니다.');
                }
            } catch (err) {
                console.error('메트릭 로드 실패:', err);
                setError('메트릭 데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <DashboardIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            대시보드
          </Typography>
          <Typography variant="body2" color="text.secondary">
            전체 현황을 한눈에 확인하세요
          </Typography>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} Mock 데이터로 표시됩니다.
        </Alert>
      )}

      {!loading && (
        <>
          <DashboardContent metrics={metrics} />
          <RecentActivity/>
        </>
      )}
    </Box>
  );
}
