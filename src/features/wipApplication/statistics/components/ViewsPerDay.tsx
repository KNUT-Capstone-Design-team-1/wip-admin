import React from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {LineChart} from "@mui/x-charts/LineChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";

const ViewsPerDay = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        일별 조회수
                    </Typography>
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
                                color: '#1976d2',
                            },
                        ]}
                        height={300}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ViewsPerDay;
