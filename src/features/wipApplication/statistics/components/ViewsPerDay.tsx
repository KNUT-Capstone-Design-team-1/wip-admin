import React from 'react';
import {Grid, Paper, Typography, Box} from "@mui/material";
import {LineChart} from "@mui/x-charts/LineChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";
import { ShowChart } from '@mui/icons-material';

const ViewsPerDay = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Grid item xs={12} md={8}>
            <Paper
                sx={{
                    p: 3,
                    height: '100%',
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
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                            color: 'info.main',
                        }}
                    >
                        <ShowChart />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        일별 조회수
                    </Typography>
                </Box>
                <LineChart
                    xAxis={[
                        {
                            data: statistics.dailyViews.map((_, index) => index),
                            label: '날짜',
                            scaleType: 'point',
                        },
                    ]}
                    series={[
                        {
                            data: statistics.dailyViews.map((d) => d.views),
                            label: '조회수',
                            color: '#3b82f6',
                            curve: 'natural',
                            area: true,
                            showMark: true,
                        },
                    ]}
                    height={300}
                    grid={{ vertical: true, horizontal: true }}
                />
            </Paper>
        </Grid>
    );
};

export default ViewsPerDay;
