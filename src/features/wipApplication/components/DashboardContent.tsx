import React from 'react';
import {WIP_ITEM} from "@/features/wipApplication/constants";
import {Box, Card, CardContent, Grid, Typography} from "@mui/material";

const DashboardContent = () => {
    return (
        <Grid container spacing={3}>
            {WIP_ITEM.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h5">{stat.value}</Typography>
                                </Box>
                                <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardContent;
