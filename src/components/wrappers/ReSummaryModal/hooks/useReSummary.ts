'use client';

import { useEffect, useState } from 'react';

export default function useReSummary() {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [writing] = useState(false);

  useEffect(() => {
    const reSummary = () => {
      // TODO: API 연결 시 구현
      //   try {
      //     setLoading(true);
      //     setError(null);
      //     // 재생성한 요약 데이터 받아오기
      //     setWriting(false);
      //   } catch (err) {
      //     if (err instanceof Error) {
      //       setError(err.message);
      //     } else {
      //       setError('알 수 없는 오류가 발생했습니다.');
      //     }
      //   } finally {
      //     setLoading(false);
      //   }
      // };
    };
    reSummary();
  });
  return { loading, writing, error };
}
