import { NextResponse } from 'next/server';
import { generateCloudflareAuthToken } from '@/lib/cloudflareToken';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log(`[PUT /api/notices/${id}] Request body:`, body);

    const response = await fetch(
      `${process.env.CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': generateCloudflareAuthToken(),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[PUT /api/notices/${id}] Error response:`, errorText);
      return NextResponse.json(
        { error: 'Failed to update notice', details: errorText },
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
      console.log(`[PUT /api/notices/${id}] Text response:`, text);
      data = { message: text, success: true };
    }

    console.log(`[PUT /api/notices/${id}] Success:`, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[PUT /api/notices] Error:`, error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`[DELETE /api/notices/${id}]`);

    const response = await fetch(
      `${process.env.CLOUD_FLARE_WORKERS_NOTICES_API_URL}/notices/${id}`,
      {
        method: 'DELETE',
        headers: {
          'x-auth-token': generateCloudflareAuthToken(),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DELETE /api/notices/${id}] Error response:`, errorText);
      return NextResponse.json(
        { error: 'Failed to delete notice', details: errorText },
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
      console.log(`[DELETE /api/notices/${id}] Text response:`, text);
      data = { message: text, success: true };
    }

    console.log(`[DELETE /api/notices/${id}] Success:`, data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[DELETE /api/notices] Error:`, error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
