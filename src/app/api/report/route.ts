import { handleApiError } from '@/hooks/util/api';
import { MIN_REPORT_LENGTH } from '@/lib/constants/report';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json(); // JSON 파싱 시도
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const content =
      body && typeof body === 'object' ? (body as { content?: unknown }).content : undefined;
    if (typeof content !== 'string' || content.trim().length < MIN_REPORT_LENGTH) {
      return NextResponse.json(
        { success: false, message: `최소 ${MIN_REPORT_LENGTH}자 이상 입력해주세요.` },
        { status: 400 }
      );
    }

    const data = await serverApiClient('/v1/report', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
