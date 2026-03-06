'use client';

import { styles } from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel.style';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useModalStore } from '@/stores/modalStore';

import ReSummaryModal from '../ReSummaryModal/ReSummaryModal';
import HeaderSection from './Sections/HeaderSection';
import ImageSection from './Sections/ImageSection';
import MemoSection from './Sections/MemoSection';
import SummarySection from './Sections/SummarySection';
import TitleSection from './Sections/TitleSection';

export type SummaryState = 'idle' | 'loading' | 'writing' | 'error' | 'ready';

interface LinkCardDetailPanelProps {
  id: number;
  url: string;
  title: string;
  summary: string;
  memo?: string;
  imageUrl?: string;
  memoEditable?: boolean;
  summaryState?: SummaryState;
  summaryErrorMessage?: string;
  onClose?: () => void;
  onTitleChange?: (value: string) => void;
  onMemoChange?: (value: string) => void;
  onRetrySummary?: () => void;
}

const LinkCardDetailPanel = ({
  id,
  url,
  title,
  summary,
  memo = '',
  imageUrl,
  memoEditable = true,
  summaryState: summaryStateProp = 'idle',
  summaryErrorMessage,
  onClose,
  onTitleChange,
  onMemoChange,
  onRetrySummary,
}: LinkCardDetailPanelProps) => {
  const safeUrl = getSafeUrl(url);
  const { root, content } = styles();
  const { modal } = useModalStore();

  return (
    <>
      <aside className={root()}>
        <div className={content()}>
          {/* Header */}
          <HeaderSection safeUrl={safeUrl} onClose={onClose} />
          {/* Title */}
          <TitleSection title={title} onTitleChange={onTitleChange} />

          {/* Image */}
          <ImageSection imageUrl={imageUrl} title={title} />

          {/* Summary */}
          <SummarySection
            linkId={id}
            summary={summary}
            summaryState={summaryStateProp}
            summaryErrorMessage={summaryErrorMessage}
            onRetrySummary={onRetrySummary}
          />

          {/* Memo */}
          <MemoSection memo={memo} memoEditable={memoEditable} onMemoChange={onMemoChange} />
        </div>
      </aside>
      {modal.type === 'RE_SUMMARY' && <ReSummaryModal linkId={modal.props.linkId} />}
    </>
  );
};

export default LinkCardDetailPanel;
