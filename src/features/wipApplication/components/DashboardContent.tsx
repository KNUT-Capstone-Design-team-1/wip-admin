import React from 'react';
import {WIP_ITEM} from "@/features/wipApplication/constants";
import {Box, Card, CardContent, Grid, Typography, alpha} from "@mui/material";
import { TrendingUp } from '@mui/icons-material';

const DashboardContent = () => {
    return (
        <Grid container spacing={3}>
            {WIP_ITEM.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                        sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                borderColor: stat.color,
                                boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                                transform: 'translateY(-4px)',
                                '& .icon-container': {
                                    transform: 'scale(1.1) rotate(5deg)',
                                },
                                '& .background-icon': {
                                    transform: 'scale(1.2) rotate(-15deg)',
                                    opacity: 0.15,
                                }
                            },
                        }}
                    >
                        <Box
                            className="background-icon"
                            sx={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                fontSize: '120px',
                                color: stat.color,
                                opacity: 0.08,
                                transform: 'rotate(-10deg)',
                                transition: 'all 0.4s ease-in-out',
                                pointerEvents: 'none',
                            }}
                        >
                            {stat.icon}
                        </Box>
                        <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            mb: 1,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                                            +12.5%
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            vs 지난달
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    className="icon-container"
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                                        color: stat.color,
                                        fontSize: 28,
                                        transition: 'all 0.3s ease-in-out',
                                        boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`,
                                    }}
                                >
                                    {stat.icon}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardContent;
