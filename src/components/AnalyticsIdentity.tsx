'use client';

import { useUserInfo } from '@/hooks/useUserInfo';
import { setGaUserId } from '@/lib/client/analytics';
import { useEffect } from 'react';

export default function AnalyticsIdentity() {
  const { data: user } = useUserInfo();

  useEffect(() => {
    setGaUserId(user?.id);
  }, [user?.id]);

  return null;
}
