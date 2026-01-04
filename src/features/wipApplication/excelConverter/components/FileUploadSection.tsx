import {
    Box,
    Button,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    FormControlLabel,
    Switch,
    alpha,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Description } from '@mui/icons-material';

interface FileUploadSectionProps {
    loading: boolean;
    enableMapping: boolean;
    setEnableMapping: (value: boolean) => void;
    fileName: string;
    error: string;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadSection = ({
    loading,
    enableMapping,
    setEnableMapping,
    fileName,
    error,
    handleFileUpload,
}: FileUploadSectionProps) => {
    return (
        <Paper
            sx={{
                p: 4,
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '2px dashed',
                borderColor: loading ? 'primary.main' : 'divider',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: `0 8px 24px ${alpha('#6366f1', 0.15)}`,
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${alpha('#6366f1', 0.1)} 0%, ${alpha('#8b5cf6', 0.1)} 100%)`,
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        파일을 업로드하세요
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Excel 파일(.xlsx, .xls, .csv)을 선택하면 자동으로 JSON으로 변환됩니다
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    component="label"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    size="large"
                    disabled={loading}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                    }}
                >
                    {loading ? '변환 중...' : '파일 선택'}
                    <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                        onChange={handleFileUpload}
                        disabled={loading}
                    />
                </Button>

                <FormControlLabel
                    control={
                        <Switch
                            checked={enableMapping}
                            onChange={(e) => setEnableMapping(e.target.checked)}
                            disabled={loading}
                        />
                    }
                    label={
                        <Typography variant="body2" fontWeight={500}>
                            컬럼명 매핑 활성화
                        </Typography>
                    }
                />

                {enableMapping && (
                    <Alert
                        severity="info"
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                width: '100%',
                            },
                        }}
                    >
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                            매핑 활성화: 한글 컬럼명이 영문으로 변환됩니다
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            예: 품목명 → itemName
                            <br />
                            설정 변경: <code>src/shared/config/excelMapping.ts</code>
                        </Typography>
                    </Alert>
                )}

                {fileName && !loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: alpha('#10b981', 0.1),
                            border: `1px solid ${alpha('#10b981', 0.2)}`,
                        }}
                    >
                        <Description sx={{ color: 'success.main' }} />
                        <Typography variant="body2" fontWeight={500} color="success.main">
                            업로드 완료: {fileName}
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Paper>
    );
};
