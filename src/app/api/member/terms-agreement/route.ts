import { handleApiError, parseJsonBody, validateRequest } from '@/hooks/util/api';
import { createFetchError, createParseError } from '@/hooks/util/api/error/errors';
import { extractAuthTokens, getAuthCookieOptions } from '@/lib/auth/token';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import type { TermsAgreementResponse } from '@/types/api/termsApi';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
if (!BASE_API_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}

const TermsAgreementRequestSchema = z.object({
  termsAgreed: z.literal(true),
  privacyAgreed: z.literal(true),
  termsVersion: z.string().min(1),
  privacyVersion: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody(req);
    const data = validateRequest(TermsAgreementRequestSchema, body);
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIES_KEYS.REFRESH_TOKEN)?.value;

    const upstreamResponse = await fetch(`${BASE_API_URL}/v1/member/terms-agreement`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: [
          accessToken && `${COOKIES_KEYS.ACCESS_TOKEN}=${encodeURIComponent(accessToken)}`,
          refreshToken && `${COOKIES_KEYS.REFRESH_TOKEN}=${encodeURIComponent(refreshToken)}`,
        ]
          .filter(Boolean)
          .join('; '),
      },
      body: JSON.stringify(data),
    });

    if (!upstreamResponse.ok) {
      const rawBody = await upstreamResponse.text().catch(() => undefined);
      throw createFetchError(`Request failed with status ${upstreamResponse.status}`, {
        status: upstreamResponse.status,
        body: rawBody,
        contentType: upstreamResponse.headers.get('content-type'),
      });
    }

    const result = (await upstreamResponse.json().catch(() => {
      throw createParseError('Failed to parse terms agreement response');
    })) as TermsAgreementResponse;

    const response = NextResponse.json(result, { status: 200 });
    const tokens = extractAuthTokens({ data: result.data ?? undefined }, upstreamResponse.headers);

    if (tokens?.accessToken) {
      response.cookies.set(
        COOKIES_KEYS.ACCESS_TOKEN,
        tokens.accessToken,
        getAuthCookieOptions(tokens.accessToken)
      );
    }

    if (tokens?.refreshToken) {
      response.cookies.set(
        COOKIES_KEYS.REFRESH_TOKEN,
        tokens.refreshToken,
        getAuthCookieOptions(tokens.refreshToken)
      );
    }

    return response;
  } catch (err) {
    return handleApiError(err);
  }
}
