import { NextResponse } from 'next/server';

import { links } from '../../data';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    const now = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        status: '400 BAD_REQUEST',
        message: 'invalid id',
        data: null,
        timestamp: now,
      },
      { status: 400 }
    );
  }

  const idx = links.findIndex(item => item.id === id);
  if (idx === -1 || links[idx].isDeleted) {
    const now = new Date().toISOString();
    return NextResponse.json(
      { success: false, status: '404 NOT_FOUND', message: 'not found', data: null, timestamp: now },
      { status: 404 }
    );
  }

  let body: { title?: string | null };
  try {
    body = (await req.json()) as { title?: string | null };
  } catch {
    const now = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        status: '400 BAD_REQUEST',
        message: 'Invalid JSON body',
        data: null,
        timestamp: now,
      },
      { status: 400 }
    );
  }

  const normalizedTitle = (body.title ?? '').trim();
  if (!normalizedTitle) {
    const now = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        status: '400 BAD_REQUEST',
        message: 'title is required',
        data: null,
        timestamp: now,
      },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const updated = {
    ...links[idx],
    title: normalizedTitle,
    updatedAt: now,
  };
  links[idx] = updated;

  return NextResponse.json(
    {
      success: true,
      status: '200 OK',
      message: 'updated',
      data: updated,
      timestamp: now,
    },
    { status: 200 }
  );
}
