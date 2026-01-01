import React from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {BarChart} from "@mui/x-charts/BarChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";

const Statistics = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    주간 통계
                </Typography>
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
                            color: '#2e7d32',
                        },
                    ]}
                    height={300}
                />
            </Paper>
        </Grid>
    );
};

export default Statistics;
