import { NextResponse } from 'next/server';

export async function GET() {
    const gcpUrl = process.env.GOOGLE_CLOUD_INIT_INFO_URL;

    console.log('[API Route] GCP URL:', gcpUrl);

    if (!gcpUrl) {
        const errorMsg = 'GCP URL이 설정되지 않았습니다. .env.local 파일에 GOOGLE_CLOUD_INIT_INFO_URL을 추가하세요.';
        console.error('[API Route]', errorMsg);
        return NextResponse.json(
            { error: errorMsg },
            { status: 500 }
        );
    }

    try {
        console.log('[API Route] Fetching from GCP...');
        const response = await fetch(gcpUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('[API Route] GCP Response Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[API Route] GCP Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('[API Route] GCP Data received successfully');

        return NextResponse.json(data);
    } catch (error) {
        console.error('[API Route] GCP fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'GCP 데이터를 가져오는데 실패했습니다.',
                details: errorMessage,
                url: gcpUrl
            },
            { status: 500 }
        );
    }
}
