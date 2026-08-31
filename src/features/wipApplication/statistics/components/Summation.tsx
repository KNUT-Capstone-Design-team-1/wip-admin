import React from 'react';
import {Box, Grid, Paper, Typography} from "@mui/material";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";

const Summation = () => {
    const { statistics } = useStatisticsStore();

    return (
        <>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        주요 지표
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            총 사용자: <strong>{statistics.totalUsers.toLocaleString()}</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            총 콘텐츠: <strong>{statistics.totalContent.toLocaleString()}</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            월간 조회수: <strong>{statistics.monthlyViews.toLocaleString()}</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            성장률: <strong>+{statistics.growthRate}%</strong>
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        통계 요약
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            평균 일일 조회수:{' '}
                            <strong>
                                {(
                                    statistics.dailyViews.reduce((sum, d) => sum + d.views, 0) /
                                    statistics.dailyViews.length
                                ).toFixed(0)}
                            </strong>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            게시된 콘텐츠 비율:{' '}
                            <strong>
                                {(
                                    (statistics.contentByStatus[0].count /
                                        statistics.contentByStatus.reduce(
                                            (sum, s) => sum + s.count,
                                            0
                                        )) *
                                    100
                                ).toFixed(1)}
                                %
                            </strong>
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </>
    );
};

export default Summation;
