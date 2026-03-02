import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.toString();

    const data = await serverApiClient(`/v1/links${query ? `?${query}` : ''}`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    // 필드 검증 전 객체 형태 확인 (body === null로 인한 TypeError 500 방지)
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    // title, url 포함 여부 백엔드 도달 전 조기 검증
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ success: false, message: '제목이 필요합니다.' }, { status: 400 });
    }
    if (!body.url || typeof body.url !== 'string' || !body.url.trim()) {
      return NextResponse.json({ success: false, message: 'URL이 필요합니다.' }, { status: 400 });
    }

    const sanitizedBody = {
      ...body,
      title: body.title.trim(),
      url: body.url.trim(),
    };

    const data = await serverApiClient('/v1/links', {
      method: 'POST',
      body: JSON.stringify(sanitizedBody),
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
