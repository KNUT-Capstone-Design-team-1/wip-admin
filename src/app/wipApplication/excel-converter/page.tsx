'use client';

import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Download as DownloadIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { applyMapping } from '@/shared/config/excelMapping';

const PREVIEW_LIMIT = 10;

export default function ExcelConverterPage() {
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [enableMapping, setEnableMapping] = useState<boolean>(true);
    const workerRef = useRef<Worker | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 확장자 확인
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
            setError('Excel 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.');
            return;
        }

        setError('');
        setFileName(file.name);
        setLoading(true);

        // Web Worker 생성
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        const worker = new Worker('/excel-worker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const { success, data, error: workerError } = e.data;

            if (success) {
                // 매핑 적용 여부에 따라 데이터 처리
                const processedData = enableMapping ? applyMapping(data) : data;
                setJsonData(processedData);
                setLoading(false);
            } else {
                setError(`파일 변환 중 오류가 발생했습니다: ${workerError}`);
                setLoading(false);
            }

            worker.terminate();
            workerRef.current = null;
        };

        worker.onerror = (error) => {
            setError('파일 처리 중 오류가 발생했습니다.');
            setLoading(false);
            console.error(error);
            worker.terminate();
            workerRef.current = null;
        };

        // Worker에 파일 전송
        worker.postMessage({ file });
    };

    const handleDownload = () => {
        if (jsonData.length === 0) return;

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName.replace(/\.[^/.]+$/, '') + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setJsonData([]);
        setFileName('');
        setError('');

        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    };

    const previewData = jsonData.slice(0, PREVIEW_LIMIT);
    const isPreviewLimited = jsonData.length > PREVIEW_LIMIT;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Excel to JSON 변환기
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                        size="large"
                        disabled={loading}
                    >
                        {loading ? '변환 중...' : 'Excel 파일 업로드'}
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
                        label="컬럼명 매핑 활성화"
                    />

                    {enableMapping && (
                        <Alert severity="info" sx={{ width: '100%' }}>
                            매핑 활성화: 한글 컬럼명이 영문으로 변환됩니다. (예: 품목명 → itemName)
                            <br />
                            설정 변경: <code>src/shared/config/excelMapping.ts</code>
                        </Alert>
                    )}

                    {fileName && !loading && (
                        <Typography variant="body2" color="text.secondary">
                            업로드된 파일: {fileName}
                        </Typography>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </Paper>

            {jsonData.length > 0 && !loading && (
                <>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
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
                        <Chip
                            label={`전체 ${jsonData.length.toLocaleString()}개 행`}
                            color="primary"
                            variant="outlined"
                        />
                    </Box>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    변환 결과 미리보기
                                </Typography>
                                {isPreviewLimited && (
                                    <Chip
                                        label={`처음 ${PREVIEW_LIMIT}개 행만 표시`}
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    maxHeight: 600,
                                    overflow: 'auto',
                                    backgroundColor: '#f5f5f5',
                                    p: 2,
                                    borderRadius: 1,
                                }}
                            >
                                <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                                    {JSON.stringify(previewData, null, 2)}
                                </pre>
                            </Box>
                            {isPreviewLimited && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    전체 데이터를 보려면 'JSON 다운로드' 버튼을 클릭하세요.
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </Box>
    );
}
