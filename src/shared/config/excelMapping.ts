/**
 * Excel 컬럼명을 JSON 키로 매핑하는 설정
 *
 * @example
 * Excel: "품목명" → JSON: "itemName"
 */
export const COLUMN_MAPPING: Record<string, string> = {
    '품목명': 'itemName',
    '수량': 'quantity',
    '가격': 'price',
    '날짜': 'date',
    '설명': 'description',
    '카테고리': 'category',
    '상태': 'status',
    // 필요한 매핑 추가
};

/**
 * JSON 변환 시 포함할 키 목록
 * null이면 모든 키 포함 (매핑된 키만)
 * 배열이면 해당 키만 포함
 */
export const INCLUDED_KEYS: string[] | null = null;

// 예시: 특정 키만 포함하려면
// export const INCLUDED_KEYS: string[] = ['itemName', 'quantity', 'price'];

/**
 * 매핑 적용 함수
 */
export function applyMapping(data: any[]): any[] {
    return data.map(row => {
        const mappedRow: Record<string, any> = {};

        for (const [originalKey, value] of Object.entries(row)) {
            // 매핑된 키 이름 가져오기 (없으면 원본 키 사용)
            const mappedKey = COLUMN_MAPPING[originalKey] || originalKey;

            // 포함할 키 필터링
            if (INCLUDED_KEYS === null || INCLUDED_KEYS.includes(mappedKey)) {
                mappedRow[mappedKey] = value;
            }
        }

        return mappedRow;
    });
}
