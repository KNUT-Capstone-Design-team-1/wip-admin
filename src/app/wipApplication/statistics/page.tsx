'use client';

import { Box, Typography } from '@mui/material';
import ContentDistribution from "@/features/wipApplication/statistics/components/ContentDistribution";
import Statistics from "@/features/wipApplication/statistics/components/Statistics";
import Summation from "@/features/wipApplication/statistics/components/Summation";
import ViewsPerDay from "@/features/wipApplication/statistics/components/ViewsPerDay";

export default function StatisticsPage() {

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                통계
            </Typography>
            <ContentDistribution />
            <Statistics />
            <ViewsPerDay />
            <Summation />
        </Box>
    );
}
