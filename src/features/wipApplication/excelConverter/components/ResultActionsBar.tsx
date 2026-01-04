import { Box, Button, Chip, Paper, alpha } from '@mui/material';
import { Download as DownloadIcon, Clear as ClearIcon, CheckCircle } from '@mui/icons-material';

interface ResultActionsBarProps {
    dataLength: number;
    handleDownload: () => void;
    handleClear: () => void;
}

export const ResultActionsBar = ({
    dataLength,
    handleDownload,
    handleClear,
}: ResultActionsBarProps) => {
    return (
        <Paper
            sx={{
                p: 2.5,
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                    px: 3,
                    boxShadow: `0 4px 12px ${alpha('#10b981', 0.3)}`,
                }}
            >
                JSON 다운로드
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<ClearIcon />}
                onClick={handleClear}
            >
                초기화
            </Button>
            <Box sx={{ flex: 1 }} />
            <Chip
                icon={<CheckCircle />}
                label={`전체 ${dataLength.toLocaleString()}개 행 변환 완료`}
                sx={{
                    background: `linear-gradient(135deg, ${alpha('#10b981', 0.1)} 0%, ${alpha('#059669', 0.1)} 100%)`,
                    color: 'success.main',
                    border: `1px solid ${alpha('#10b981', 0.2)}`,
                    fontWeight: 600,
                    px: 1.5,
                    py: 2.5,
                }}
            />
        </Paper>
    );
};
