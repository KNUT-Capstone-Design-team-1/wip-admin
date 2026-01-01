'use client';

import {
  Typography,
  Box,
} from '@mui/material';
import DashboardContent from "@/features/wipApplication/components/DashboardContent";
import RecentActivity from "@/features/wipApplication/components/RecentActivity";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      <DashboardContent />
      <RecentActivity/>
    </Box>
  );
}
