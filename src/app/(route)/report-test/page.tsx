'use client';

import Button from '@/components/basics/Button/Button';
import ReportModal from '@/components/wrappers/ReportModal/ReportModal';
import { useModalStore } from '@/stores/modalStore';

export default function ReportTestPage() {
  const { type, open } = useModalStore();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-title-lg">Report Modal 테스트</h1>
        <Button label="신고 모달 열기" variant="primary" onClick={() => open('REPORT')} />
      </div>

      {type === 'REPORT' && <ReportModal />}
    </main>
  );
}
