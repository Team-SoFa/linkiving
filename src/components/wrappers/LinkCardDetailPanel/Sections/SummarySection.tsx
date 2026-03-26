import AccordionButton from '@/components/basics/Accordion/AccordionButton/AccordionButton';
import Button from '@/components/basics/Button/Button';
import Divider from '@/components/basics/Divider/Divider';
import Label from '@/components/basics/Label/Label';
import ProgressNotification from '@/components/basics/ProgressNotification/ProgressNotification';
import MarkdownRenderer from '@/hooks/util/parseMarkdown';
import { useModalStore } from '@/stores/modalStore';
import { useEffect, useRef, useState } from 'react';

import CopyButton from '../../CopyButton';
import { SummaryState } from '../LinkCardDetailPanel';
import { styles } from '../LinkCardDetailPanel.style';

interface SummarySectionProps {
  linkId: number;
  summary: string;
  summaryState: SummaryState;
  summaryErrorMessage?: string;
  onRetrySummary?: () => void;
}

export default function SummarySection({
  linkId,
  summary,
  summaryState,
  summaryErrorMessage,
  onRetrySummary,
}: SummarySectionProps) {
  const { section, summaryWrapper } = styles();

  const summaryRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState(summary ?? '');

  const { open } = useModalStore();

  // 타자 애니메이션
  useEffect(() => {
    if (summaryState !== 'writing') {
      setDisplayedSummary(summary ?? '');
      return;
    }

    setDisplayedSummary('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedSummary(prev => prev + summary[i]);
      i++;
      if (i >= summary.length) clearInterval(interval);
    }, 30); // 글자 출력 속도(ms)

    return () => clearInterval(interval);
  }, [summary, summaryState]);

  const isInteractive =
    summaryState === 'ready' || summaryState === 'idle' || summaryState === 'writing';

  const shouldShowSummary = isInteractive && Boolean(summary);

  useEffect(() => {
    setIsExpanded(false);
  }, [summary]);

  useEffect(() => {
    const element = summaryRef.current;
    if (!element || !isInteractive) return;

    const measureOverflow = () => {
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight || '0');
      if (!lineHeight) return;

      const fullHeight = element.scrollHeight;

      const maxHeight = lineHeight * 5;
      setIsOverflowing(fullHeight > maxHeight + 1);
    };

    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [summary, summaryState, isInteractive]);

  const renderContent = () => {
    if (summaryState === 'loading') {
      return (
        <div className="flex min-h-[172px] flex-col gap-2 px-3 py-3">
          <ProgressNotification
            label="요약 생성 중..."
            icon="IC_SumGenerate"
            tone="default"
            animated
          />
        </div>
      );
    }

    if (summaryState === 'error' || !summary) {
      return (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <ProgressNotification
            icon="IC_Info"
            label={summaryErrorMessage || '일시적 오류로 요약을 생성하지 못했습니다.'}
          />

          <Button
            size="sm"
            variant="primary"
            contextStyle="onPanel"
            icon="IC_Regenerate"
            label="다시 시도"
            onClick={onRetrySummary}
          />
        </div>
      );
    }

    if (!shouldShowSummary) return null;

    return (
      <div className={summaryWrapper()}>
        <div className="block">
          <div
            ref={summaryRef}
            className="font-body-md max-w-120 leading-[160%]"
            style={
              isExpanded
                ? undefined
                : {
                    maxHeight: `calc(1.6em * 5)`,
                    overflow: 'hidden',
                  }
            }
          >
            <MarkdownRenderer
              className="text-body-md"
              content={summaryState === 'writing' ? displayedSummary : (summary ?? '')}
            />
          </div>
        </div>

        {isOverflowing && (
          <div className="mt-1">
            <AccordionButton
              isOpen={isExpanded}
              setIsOpen={setIsExpanded}
              openTitle="간략히"
              closeTitle="자세히"
            />
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          size="sm"
          variant="tertiary_subtle"
          contextStyle="onPanel"
          icon="IC_Regenerate"
          label="요약 재생성"
          onClick={() => open('RE_SUMMARY', { linkId: linkId })}
        />

        <CopyButton
          value={summary}
          successMsg="요약 내용을 복사했습니다."
          failMsg="요약 내용 복사에 실패했습니다."
          tooltipMsg="요약 내용 복사하기"
          contextStyle="onPanel"
        />
      </div>
    );
  };

  return (
    <div>
      <section className={section()}>
        <Label textSize="sm" className="text-gray900">
          요약
        </Label>

        {renderContent()}
        {renderActions()}
      </section>

      <Divider />
    </div>
  );
}
