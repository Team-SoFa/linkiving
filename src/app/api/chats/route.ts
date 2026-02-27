// app/api/chats/route.ts
import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await serverApiClient('/v1/chats');
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json(); // req.json() 파싱 실패 메세지
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    if (!body.firstChat || typeof body.firstChat !== 'string' || !body.firstChat.trim()) {
      return NextResponse.json(
        { success: false, message: '첫 채팅 메시지가 필요합니다.' },
        { status: 400 }
      );
    }
    const data = await serverApiClient('/v1/chats', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
