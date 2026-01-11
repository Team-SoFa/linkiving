import { handleApiError, parseJsonBody, safeFetch, validateRequest } from '@/hooks/util/api';
import { SignupRequestSchema, SignupResponse } from '@/types/api/authApi';
import { NextRequest } from 'next/server';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
if (!BASE_API_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_BASE_API_URL');
}
const BASE_URL = `${BASE_API_URL}/v1/member`;

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody(req);
    const data = validateRequest(SignupRequestSchema, body);

    const result = await safeFetch<SignupResponse>(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return Response.json(result, { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
