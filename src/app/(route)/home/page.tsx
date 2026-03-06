// app/home/page.tsx
import { COOKIES_KEYS } from '@/lib/constants/cookies';
import { cookies } from 'next/headers';

import Home from './HomePage';

export const dynamic = 'force-dynamic';

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIES_KEYS.ACCESS_TOKEN);

  console.log('🔥 Server side - Token exists:', !!token);

  return (
    <main>
      <Home />
    </main>
  );
}
