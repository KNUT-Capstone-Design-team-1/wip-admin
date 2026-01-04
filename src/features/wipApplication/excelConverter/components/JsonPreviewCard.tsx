import { Box, Card, CardContent, Typography, Chip, Alert, alpha } from '@mui/material';
import { Code, Visibility } from '@mui/icons-material';

const PREVIEW_LIMIT = 10;

interface JsonPreviewCardProps {
    jsonData: any[];
}

export const JsonPreviewCard = ({ jsonData }: JsonPreviewCardProps) => {
    const previewData = jsonData.slice(0, PREVIEW_LIMIT);
    const isPreviewLimited = jsonData.length > PREVIEW_LIMIT;

    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${alpha('#6366f1', 0.1)} 0%, ${alpha('#8b5cf6', 0.1)} 100%)`,
                                color: 'primary.main',
                            }}
                        >
                            <Visibility />
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                            변환 결과 미리보기
                        </Typography>
                    </Box>
                    {isPreviewLimited && (
                        <Chip
                            label={`처음 ${PREVIEW_LIMIT}개 행만 표시`}
                            size="small"
                            sx={{
                                background: `linear-gradient(135deg, ${alpha('#f59e0b', 0.1)} 0%, ${alpha('#d97706', 0.1)} 100%)`,
                                color: 'warning.main',
                                border: `1px solid ${alpha('#f59e0b', 0.2)}`,
                                fontWeight: 600,
                            }}
                        />
                    )}
                </Box>
                <Box
                    sx={{
                        maxHeight: 600,
                        overflow: 'auto',
                        background: '#1e293b',
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha('#6366f1', 0.2),
                        boxShadow: `inset 0 2px 8px ${alpha('#000000', 0.3)}`,
                        position: 'relative',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: alpha('#ffffff', 0.1),
                            borderRadius: 1,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: alpha('#6366f1', 0.5),
                            borderRadius: 1,
                            '&:hover': {
                                background: alpha('#6366f1', 0.7),
                            },
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            background: alpha('#6366f1', 0.2),
                            border: `1px solid ${alpha('#6366f1', 0.3)}`,
                        }}
                    >
                        <Code sx={{ fontSize: 16, color: '#818cf8' }} />
                        <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 600 }}>
                            JSON
                        </Typography>
                    </Box>
                    <pre
                        style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            fontFamily: "'Fira Code', 'Courier New', monospace",
                            color: '#e2e8f0',
                            lineHeight: 1.6,
                        }}
                    >
                        {JSON.stringify(previewData, null, 2)}
                    </pre>
                </Box>
                {isPreviewLimited && (
                    <Alert
                        severity="info"
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha('#3b82f6', 0.1)} 0%, ${alpha('#2563eb', 0.1)} 100%)`,
                            border: `1px solid ${alpha('#3b82f6', 0.2)}`,
                        }}
                    >
                        전체 데이터를 보려면 'JSON 다운로드' 버튼을 클릭하세요.
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};
