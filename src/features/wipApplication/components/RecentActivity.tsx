import React from 'react';
import {Box, Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, alpha} from "@mui/material";
import {
    NotificationsActive,
    Description,
    Person,
    Settings,
    TrendingUp,
    Update,
} from '@mui/icons-material';

const activities = [
    {
        id: 1,
        user: '김철수',
        action: '새 공지사항을 등록했습니다',
        time: '5분 전',
        icon: <NotificationsActive />,
        color: '#3b82f6',
        type: '공지사항',
    },
    {
        id: 2,
        user: '이영희',
        action: 'Excel 파일을 변환했습니다',
        time: '15분 전',
        icon: <Description />,
        color: '#10b981',
        type: '변환',
    },
    {
        id: 3,
        user: '박지민',
        action: '통계를 조회했습니다',
        time: '1시간 전',
        icon: <TrendingUp />,
        color: '#f59e0b',
        type: '통계',
    },
    {
        id: 4,
        user: '관리자',
        action: '시스템 설정을 업데이트했습니다',
        time: '2시간 전',
        icon: <Settings />,
        color: '#8b5cf6',
        type: '설정',
    },
    {
        id: 5,
        user: '최민수',
        action: '새 사용자가 등록되었습니다',
        time: '3시간 전',
        icon: <Person />,
        color: '#ec4899',
        type: '사용자',
    },
];

const RecentActivity = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <Paper
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Update sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" fontWeight={600}>
                            최근 활동
                        </Typography>
                    </Box>
                    <Chip
                        label="실시간"
                        size="small"
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.7 },
                            },
                        }}
                    />
                </Box>

                <List sx={{ p: 0 }}>
                    {activities.map((activity, index) => (
                        <ListItem
                            key={activity.id}
                            sx={{
                                px: 0,
                                py: 2,
                                borderBottom: index !== activities.length - 1 ? '1px solid' : 'none',
                                borderColor: 'divider',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: alpha('#6366f1', 0.03),
                                    borderRadius: 2,
                                    px: 2,
                                    '& .activity-avatar': {
                                        transform: 'scale(1.1)',
                                    },
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    className="activity-avatar"
                                    sx={{
                                        background: `linear-gradient(135deg, ${activity.color} 0%, ${alpha(activity.color, 0.7)} 100%)`,
                                        transition: 'all 0.3s ease-in-out',
                                        boxShadow: `0 4px 12px ${alpha(activity.color, 0.3)}`,
                                    }}
                                >
                                    {activity.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {activity.user}
                                        </Typography>
                                        <Chip
                                            label={activity.type}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                backgroundColor: alpha(activity.color, 0.1),
                                                color: activity.color,
                                                border: `1px solid ${alpha(activity.color, 0.2)}`,
                                            }}
                                        />
                                    </Box>
                                }
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                                            {activity.action}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                <Box
                    sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        모든 활동 보기 →
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default RecentActivity;
