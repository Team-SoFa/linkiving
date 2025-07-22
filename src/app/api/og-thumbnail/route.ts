import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

// cache
const cache = new Map<string, { image: string | null; expires: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24 * 14; // 14일

// 내부망 차단용 정규식
const PRIVATE_IP_REGEX = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/;

// fetch 타임아웃
function timeoutFetch(url: string, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  let urlObj: URL;

  try {
    urlObj = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  // 프로토콜 검증
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    return NextResponse.json({ error: 'invalid protocol' }, { status: 400 });
  }

  // 내부망 접근 차단
  if (PRIVATE_IP_REGEX.test(urlObj.hostname)) {
    return NextResponse.json({ error: 'private ip blocked' }, { status: 400 });
  }

  const cached = cache.get(targetUrl);
  const now = Date.now();
  if (cached && cached.expires > now) {
    return NextResponse.json(
      { image: cached.image },
      {
        headers: {
          'Cache-Control': 'public, max-age=1209600',
        },
      }
    );
  }

  try {
    const html = await timeoutFetch(targetUrl, 5000).then(res => {
      if (!res.ok) throw new Error();

      const contentLength = res.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
        throw new Error('Response too large');
      }
      return res.text();
    });

    const $ = cheerio.load(html);

    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      null;

    cache.set(targetUrl, { image: ogImage, expires: now + CACHE_TTL });

    return NextResponse.json(
      { image: ogImage },
      {
        headers: {
          'Cache-Control': 'public, max-age=1209600',
        },
      }
    );
  } catch {
    return NextResponse.json({ image: null });
  }
}
