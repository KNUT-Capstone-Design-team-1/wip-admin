import React from 'react';
import {Grid, Paper, Typography} from "@mui/material";
import {PieChart} from "@mui/x-charts/PieChart";
import {useStatisticsStore} from "@/features/wipApplication/statistics/store/useStatisticsStore";

const ContentDistribution = () => {
    const { statistics } = useStatisticsStore();

    return (
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    콘텐츠 상태별 분포
                </Typography>
                <PieChart
                    series={[
                        {
                            data: statistics.contentByStatus.map((item, index) => ({
                                id: index,
                                value: item.count,
                                label: item.status,
                            })),
                        },
                    ]}
                    height={300}
                />
            </Paper>
        </Grid>
    );
};

export default ContentDistribution;
