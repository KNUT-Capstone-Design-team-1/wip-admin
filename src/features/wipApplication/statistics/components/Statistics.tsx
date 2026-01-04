import React from 'react';
import {Paper, Typography, Box} from "@mui/material";
import {BarChart} from "@mui/x-charts/BarChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";
import { BarChart as BarChartIcon } from '@mui/icons-material';

const Statistics = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Paper
            sx={{
                p: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                    transform: 'translateY(-4px)',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                        color: 'success.main',
                    }}
                >
                    <BarChartIcon />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                    주간 통계
                </Typography>
            </Box>
            <BarChart
                xAxis={[
                    {
                        data: statistics.dailyViews.map((d) => d.date),
                        scaleType: 'band',
                    },
                ]}
                series={[
                    {
                        data: statistics.dailyViews.map((d) => d.views),
                        label: '조회수',
                        color: '#10b981',
                    },
                ]}
                height={300}
                grid={{ horizontal: true }}
            />
        </Paper>
    );
};

export default Statistics;
