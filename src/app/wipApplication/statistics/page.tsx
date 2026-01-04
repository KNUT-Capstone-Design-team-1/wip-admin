'use client';

import { Box, Typography, Grid } from '@mui/material';
import ContentDistribution from "@/features/wipApplication/statistics/components/ContentDistribution";
import Statistics from "@/features/wipApplication/statistics/components/Statistics";
import Summation from "@/features/wipApplication/statistics/components/Summation";
import ViewsPerDay from "@/features/wipApplication/statistics/components/ViewsPerDay";
import { BarChart } from '@mui/icons-material';

export default function StatisticsPage() {

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
                    <BarChart sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        통계
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        서비스 이용 현황을 확인하세요
                    </Typography>
                </Box>
            </Box>

            <Summation />

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <ViewsPerDay />
                <ContentDistribution />
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Statistics />
            </Box>
        </Box>
    );
}
