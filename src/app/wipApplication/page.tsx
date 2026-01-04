'use client';

import {
  Typography,
  Box,
} from '@mui/material';
import DashboardContent from "@/features/wipApplication/components/DashboardContent";
import RecentActivity from "@/features/wipApplication/components/RecentActivity";
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import {useEffect} from "react";

export default function DashboardPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          <DashboardIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            대시보드
          </Typography>
          <Typography variant="body2" color="text.secondary">
            전체 현황을 한눈에 확인하세요
          </Typography>
        </Box>
      </Box>
      <DashboardContent />
      <RecentActivity/>
    </Box>
  );
}
