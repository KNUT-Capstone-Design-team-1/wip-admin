import React from 'react';
import {Box, Paper, Typography} from "@mui/material";

const RecentActivity = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    최근 활동
                </Typography>
                <Typography color="textSecondary">
                    최근 활동 내역이 여기에 표시됩니다.
                </Typography>
            </Paper>
        </Box>
    );
};

export default RecentActivity;
