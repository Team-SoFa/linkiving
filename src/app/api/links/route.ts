import type { CreateLinkPayload, Link, PageResponse, PageSort, Pageable } from '@/types/link';
import { NextResponse } from 'next/server';

import { links } from './data';

function parseSort(sortParams: string[]): { field: keyof Link; direction: 'asc' | 'desc' } | null {
  if (!sortParams.length) return null;
  const raw = sortParams[0];
  const [field, direction] = raw.split(',');
  if (!field) return null;
  const dir = direction?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const allowed: (keyof Link)[] = ['createdAt', 'updatedAt', 'title', 'url', 'isImportant'];
  if (!allowed.includes(field as keyof Link)) return null;
  return { field: field as keyof Link, direction: dir };
}

function buildSortMeta(hasSort: boolean): PageSort {
  return {
    unsorted: !hasSort,
    sorted: hasSort,
    empty: !hasSort,
  };
}

function buildPageable(page: number, size: number, sortMeta: PageSort): Pageable {
  return {
    pageNumber: page,
    pageSize: size,
    offset: page * size,
    paged: true,
    unpaged: false,
    sort: sortMeta,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(0, Number(searchParams.get('page') ?? '0') || 0);
  const size = Math.max(1, Number(searchParams.get('size') ?? '10') || 10);
  const sortParams = searchParams.getAll('sort');
  const sortOption = parseSort(sortParams);
  const hasSort = Boolean(sortOption);

  const visible = links.filter(link => !link.isDeleted);

  if (sortOption) {
    visible.sort((a, b) => {
      const { field, direction } = sortOption;
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        // Fallback: string compare
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  } else {
    visible.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  const totalElements = visible.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const end = start + size;
  const content = visible.slice(start, end);
  const numberOfElements = content.length;

  const sortMeta = buildSortMeta(hasSort);
  const pageable = buildPageable(page, size, sortMeta);

  const response: PageResponse<Link> = {
    totalPages,
    totalElements,
    pageable,
    numberOfElements,
    size,
    content,
    number: page,
    sort: sortMeta,
    first: page === 0,
    last: totalPages === 0 ? true : page + 1 >= totalPages,
    empty: numberOfElements === 0,
  };

  return NextResponse.json(
    {
      success: true,
      status: '200 OK',
      message: 'ok',
      data: response,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  let body: CreateLinkPayload;

  try {
    body = (await req.json()) as CreateLinkPayload;
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

  const { url, title, memo, summary, imageUrl, metadataJson, tags, isImportant } = body;

  if (!url || !title) {
    const now = new Date().toISOString();
    return NextResponse.json(
      {
        success: false,
        status: '400 BAD_REQUEST',
        message: 'url and title are required',
        data: null,
        timestamp: now,
      },
      { status: 400 }
    );
  }

  const timestamp = new Date().toISOString();
  const nextId = links.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const newLink: Link = {
    id: nextId,
    url,
    title,
    memo,
    summary: summary ?? '',
    imageUrl,
    metadataJson: metadataJson ?? '{}',
    tags: tags ?? '',
    isImportant: isImportant ?? false,
    isDeleted: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  links.unshift(newLink);

  return NextResponse.json(
    {
      success: true,
      status: '201 CREATED',
      message: 'created',
      data: newLink,
      timestamp,
    },
    { status: 201 }
  );
}
