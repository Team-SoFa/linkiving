import { handleApiError } from '@/hooks/util/api';
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/* TODO: 백 유저 정보 추가 이후 수정 필요
const res = await fetch(`${API_BASE}/v1/member/me`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});
const user = await res.json();
return NextResponse.json({ success: true, data: user });
*/
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN)?.value;

    if (!token) {
      return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }
    const decoded = Buffer.from(parts[1], 'base64').toString();
    const payload = JSON.parse(decoded);

    const user: User = {
      id: payload.sub,
      name: '',
    };

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    return handleApiError(err);
  }
}
