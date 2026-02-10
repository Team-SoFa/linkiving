// app/home/page.tsx
import { cookies } from 'next/headers';

import Home from './HomePage';

export const dynamic = 'force-dynamic';

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

  console.log('🔥 Server side - Token exists:', !!token);

  return (
    <main>
      <Home />
    </main>
  );
}
