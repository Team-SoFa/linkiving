import type { UpdateLinkPayload } from '@/types/link';
import { NextResponse } from 'next/server';

import { links } from '../data';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const link = links.find(item => item.id === id);
  if (!link || link.isDeleted) {
    const now = new Date().toISOString();
    return NextResponse.json(
      { success: false, status: '404 NOT_FOUND', message: 'not found', data: null, timestamp: now },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      status: '200 OK',
      message: 'ok',
      data: link,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  let body: UpdateLinkPayload;
  try {
    body = (await req.json()) as UpdateLinkPayload;
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

  const target = links[idx];
  const next = {
    ...target,
    ...Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== null && value !== undefined)
    ),
    updatedAt: new Date().toISOString(),
  };

  links[idx] = next;

  return NextResponse.json(
    {
      success: true,
      status: '200 OK',
      message: 'updated',
      data: next,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const now = new Date().toISOString();
  links[idx] = {
    ...links[idx],
    isDeleted: true,
    deletedAt: now,
    updatedAt: now,
  };

  return NextResponse.json(
    {
      success: true,
      status: '200 OK',
      message: 'deleted',
      data: String(id),
      timestamp: now,
    },
    { status: 200 }
  );
}
