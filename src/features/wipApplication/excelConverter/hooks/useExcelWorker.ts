import { useRef, useCallback } from 'react';

interface WorkerMessage {
    success: boolean;
    data?: any[];
    error?: string;
}

interface UseExcelWorkerReturn {
    processFile: (file: File, onSuccess: (data: any[]) => void, onError: (error: string) => void) => void;
    terminate: () => void;
}

export const useExcelWorker = (): UseExcelWorkerReturn => {
    const workerRef = useRef<Worker | null>(null);

    const processFile = useCallback((
        file: File,
        onSuccess: (data: any[]) => void,
        onError: (error: string) => void
    ) => {
        // 기존 Worker 종료
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        // 새 Worker 생성
        const worker = new Worker('/excel-worker.js');
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
            const { success, data, error: workerError } = e.data;

            if (success && data) {
                onSuccess(data);
            } else {
                onError(`파일 변환 중 오류가 발생했습니다: ${workerError}`);
            }

            worker.terminate();
            workerRef.current = null;
        };

        worker.onerror = (error) => {
            onError('파일 처리 중 오류가 발생했습니다.');
            console.error(error);
            worker.terminate();
            workerRef.current = null;
        };

        // Worker에 파일 전송
        worker.postMessage({ file });
    }, []);

    const terminate = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);

    return { processFile, terminate };
};
