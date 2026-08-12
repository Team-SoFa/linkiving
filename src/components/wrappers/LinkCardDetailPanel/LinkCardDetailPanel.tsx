'use client';

import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useModalStore } from '@/stores/modalStore';
import type { EntityId } from '@/types/id';
import { useMediaQuery, useScrollLock } from '@reactuses/core';
import { useCallback, useEffect } from 'react';

import ReSummaryModal from '../ReSummaryModal/ReSummaryModal';
import DetailPanelShell from './DetailPanelShell';
import HeaderSection from './Sections/HeaderSection';
import ImageSection from './Sections/ImageSection';
import MemoSection from './Sections/MemoSection';
import SummarySection from './Sections/SummarySection';
import TitleSection from './Sections/TitleSection';

export type SummaryState = 'idle' | 'loading' | 'writing' | 'error' | 'ready';

interface LinkCardDetailPanelProps {
  id: EntityId;
  url: string;
  title: string;
  summary: string;
  memo?: string;
  imageUrl?: string;
  summaryState?: SummaryState;
  summaryErrorMessage?: string;
  onClose?: () => void;
}

const LinkCardDetailPanel = ({
  id,
  url,
  title,
  summary,
  memo = '',
  imageUrl,
  summaryState: summaryStateProp = 'idle',
  summaryErrorMessage,
  onClose,
}: LinkCardDetailPanelProps) => {
  const safeUrl = getSafeUrl(url);
  const { modal } = useModalStore();

  // xl 미만에서는 패널이 전체 화면 오버레이(fixed inset-0)라 뒤 배경이 같이 스크롤되면 안 된다.
  const isOverlay = useMediaQuery('(max-width: 1279px)');

  // useScrollLock의 내부 effect는 [locked, target]에 의존하며 실행될 때마다 "복원할 원래
  // overflow"를 현재 값으로 다시 캡처한다. 매 렌더마다 새 함수를 넘기면 잠긴 상태의
  // 'hidden'이 복원 값으로 덮어써져 패널을 닫아도 스크롤이 살아나지 않으므로 참조를 고정한다.
  const getBody = useCallback(() => document.body, []);
  const [, setScrollLocked] = useScrollLock(getBody);

  useEffect(() => {
    setScrollLocked(isOverlay);
    return () => setScrollLocked(false);
  }, [isOverlay, setScrollLocked]);

  return (
    <>
      <DetailPanelShell>
        {/* Header */}
        <HeaderSection safeUrl={safeUrl} onClose={onClose} />
        {/* Title */}
        <TitleSection linkId={id} title={title} />

        {/* Image */}
        <ImageSection imageUrl={imageUrl} title={title} />

        {/* Summary */}
        <SummarySection
          linkId={id}
          summary={summary}
          summaryState={summaryStateProp}
          summaryErrorMessage={summaryErrorMessage}
        />

        {/* Memo */}
        <MemoSection linkId={id} memo={memo} />
      </DetailPanelShell>
      {modal.type === 'RE_SUMMARY' && <ReSummaryModal linkId={modal.props.linkId} />}
    </>
  );
};

export default LinkCardDetailPanel;
