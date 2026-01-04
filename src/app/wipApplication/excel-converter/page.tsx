'use client';

import { Box, Typography } from '@mui/material';
import { useExcelConverter } from '@/features/wipApplication/excelConverter/hooks/useExcelConverter';
import { FileUploadSection } from '@/features/wipApplication/excelConverter/components/FileUploadSection';
import { ResultActionsBar } from '@/features/wipApplication/excelConverter/components/ResultActionsBar';
import { JsonPreviewCard } from '@/features/wipApplication/excelConverter/components/JsonPreviewCard';
import { SwapHoriz } from '@mui/icons-material';

export default function ExcelConverterPage() {
    const {
        jsonData,
        fileName,
        error,
        loading,
        enableMapping,
        setEnableMapping,
        handleFileUpload,
        handleDownload,
        handleClear,
    } = useExcelConverter();

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
                    <SwapHoriz sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Excel to JSON 변환기
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Excel 파일을 JSON 형식으로 변환하세요
                    </Typography>
                </Box>
            </Box>

            <FileUploadSection
                loading={loading}
                enableMapping={enableMapping}
                setEnableMapping={setEnableMapping}
                fileName={fileName}
                error={error}
                handleFileUpload={handleFileUpload}
            />

            {jsonData.length > 0 && !loading && (
                <>
                    <ResultActionsBar
                        dataLength={jsonData.length}
                        handleDownload={handleDownload}
                        handleClear={handleClear}
                    />

                    <JsonPreviewCard jsonData={jsonData} />
                </>
            )}
        </Box>
    );
}
