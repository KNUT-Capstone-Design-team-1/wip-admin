import { NextResponse } from 'next/server';
import { generateCloudflareAuthToken } from '@/lib/cloudflareToken';

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices`,
      {
        headers: {
          'x-auth-token': generateCloudflareAuthToken(),
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch notices' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[POST /api/notices] Request body:', body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': generateCloudflareAuthToken(),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[POST /api/notices] Error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to create notice', details: errorText },
        { status: response.status }
      );
    }

    // 응답이 JSON인지 텍스트인지 확인
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('[POST /api/notices] Text response:', text);
      data = { message: text, success: true };
    }

    console.log('[POST /api/notices] Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[POST /api/notices] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
