import React from 'react';
import {Grid, Paper, Typography, Box} from "@mui/material";
import {PieChart} from "@mui/x-charts/PieChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";
import { DonutLarge } from '@mui/icons-material';

const ContentDistribution = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Grid size={{ xs: 12, md: 4 }}>
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
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            color: 'primary.main',
                        }}
                    >
                        <DonutLarge />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        콘텐츠 상태별 분포
                    </Typography>
                </Box>
                <PieChart
                    series={[
                        {
                            data: statistics.contentByStatus.map((item, index) => ({
                                id: index,
                                value: item.count,
                                label: item.status,
                            })),
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                        },
                    ]}
                    height={300}
                    slotProps={{
                        legend: {
                            direction: 'vertical',
                            position: { vertical: 'middle', horizontal: 'end' },
                        },
                    }}
                />
            </Paper>
        </Grid>
    );
};

export default ContentDistribution;
