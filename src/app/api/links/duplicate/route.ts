import { NextResponse } from 'next/server';

import { links } from '../data';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    const now = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        status: '400 BAD_REQUEST',
        message: 'url is required',
        data: null,
        timestamp: now,
      },
      { status: 400 }
    );
  }

  const isDuplicate = links.some(link => !link.isDeleted && link.url === url);
  const timestamp = new Date().toISOString();

  return NextResponse.json({
    success: true,
    status: '200 OK',
    message: 'ok',
    data: isDuplicate,
    timestamp,
  });
}
