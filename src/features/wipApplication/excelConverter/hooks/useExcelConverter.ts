import { useState } from 'react';
import { applyMapping } from '@/shared/config/excelMapping';
import { useExcelWorker } from './useExcelWorker';

type ExcelRow = Record<string, unknown>;

interface UseExcelConverterReturn {
    jsonData: ExcelRow[];
    fileName: string;
    error: string;
    loading: boolean;
    enableMapping: boolean;
    isDragging: boolean;
    setEnableMapping: (value: boolean) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileDrop: (file: File) => void;
    handleDownload: () => void;
    handleClear: () => void;
    setIsDragging: (value: boolean) => void;
}

export const useExcelConverter = (): UseExcelConverterReturn => {
    const [jsonData, setJsonData] = useState<ExcelRow[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [enableMapping, setEnableMapping] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const { processFile, terminate } = useExcelWorker();

    const validateAndProcessFile = (file: File) => {
        // 파일 확장자 확인
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
            setError('Excel 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.');
            return;
        }

        setError('');
        setFileName(file.name);
        setLoading(true);

        processFile(
            file,
            (data) => {
                // 매핑 적용 여부에 따라 데이터 처리
                const processedData = enableMapping ? applyMapping(data) : data;
                setJsonData(processedData);
                setLoading(false);
            },
            (errorMessage) => {
                setError(errorMessage);
                setLoading(false);
            }
        );
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        validateAndProcessFile(file);
    };

    const handleFileDrop = (file: File) => {
        validateAndProcessFile(file);
    };

    const handleDownload = () => {
        if (jsonData.length === 0) return;

        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = fileName.replace(/\.[^/.]+$/, '') + '.json';
        link.click();

        document.body.appendChild(link);
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setJsonData([]);
        setFileName('');
        setError('');
        terminate();
    };

    return {
        jsonData,
        fileName,
        error,
        loading,
        enableMapping,
        isDragging,
        setEnableMapping,
        handleFileUpload,
        handleFileDrop,
        handleDownload,
        handleClear,
        setIsDragging,
    };
};
