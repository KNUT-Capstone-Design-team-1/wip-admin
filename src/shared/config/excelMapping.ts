/**
 * Excel 컬럼명을 JSON 키로 매핑하는 설정
 *
 * @example
 * Excel: "품목명" → JSON: "itemName"
 */
export const COLUMN_MAPPING: Record<string, string> = {
    '품목일련번호': 'ITEM_SEQ',
    '품목명': 'ITEM_NAME',
    '업소일련번호': 'ENTP_SEQ',
    '업소명': 'ENTP_NAME',
    '큰제품이미지': 'ITEM_IMAGE',
    '표시앞': 'PRINT_FRONT',
    '표시뒤': 'PRINT_BACK',
    '의약품제형': 'DRUG_SHAPE',
    '색상앞': 'COLOR_CLASS1',
    '색상뒤': 'COLOR_CLASS2',
    '분할선앞': 'LINE_FRONT',
    '분할선뒤': 'LINE_BACK',
    '이미지생성일자(약학정보원)': 'IMG_REGIST_TS',
    '분류명': 'CLASS_NAME',
    '전문일반구분': 'ETC_OTC_CODE',
    '품목허가일자': 'ITEM_PERMIT_DATE',
    '표기코드앞': 'MARK_CODE_FRONT',
    '표기코드뒤': 'MARK_CODE_BACK',
    '제형코드명': 'FORM_CODE',

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
 * 헤더 정규화: 앞뒤 공백/개행 제거 + 연속 공백을 단일 공백으로 축소 + NBSP 처리
 */
function normalizeHeader(key: string): string {
    return key.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

const NORMALIZED_MAPPING: Record<string, string> = Object.fromEntries(
    Object.entries(COLUMN_MAPPING).map(([k, v]) => [normalizeHeader(k), v])
);

/**
 * 매핑 적용 함수
 * COLUMN_MAPPING에 정의된 키만 변환하고, 나머지는 제외
 */
export function applyMapping(data: any[]): any[] {
    const unmatchedKeys = new Set<string>();

    const result = data.map(row => {
        const mappedRow: Record<string, any> = {};

        for (const [originalKey, value] of Object.entries(row)) {
            const normalized = normalizeHeader(originalKey);
            const mappedKey = NORMALIZED_MAPPING[normalized];

            if (mappedKey) {
                if (INCLUDED_KEYS === null || INCLUDED_KEYS.includes(mappedKey)) {
                    mappedRow[mappedKey] = value;
                }
            } else {
                unmatchedKeys.add(originalKey);
            }
        }

        return mappedRow;
    });

    if (unmatchedKeys.size > 0) {
        console.warn(
            '[excelMapping] COLUMN_MAPPING 에 없는 헤더 (제외됨):',
            Array.from(unmatchedKeys)
        );
    }

    return result;
}
