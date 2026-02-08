import { Suspense } from 'react';

import Landing from './LandingPage';

export default function page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Landing />
    </Suspense>
  );
}
