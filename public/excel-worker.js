// Web Worker for Excel file processing
importScripts('https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js');

self.onmessage = function(e) {
    const { file } = e.data;

    const reader = new FileReaderSync();
    const data = reader.readAsBinaryString(file);

    try {
        const workbook = XLSX.read(data, { type: 'binary' });

        // 첫 번째 시트 읽기
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // JSON으로 변환
        const json = XLSX.utils.sheet_to_json(worksheet);

        // 결과 전송
        self.postMessage({
            success: true,
            data: json
        });
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};
