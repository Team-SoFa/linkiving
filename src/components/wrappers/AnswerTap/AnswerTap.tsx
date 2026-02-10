'use client';

import CardList from '@/components/basics/CardList/CardList';
import Divider from '@/components/basics/Divider/Divider';
import LinkCard from '@/components/basics/LinkCard/LinkCard';
import TabMenu from '@/components/basics/Tab/TabMenu';
import { useTab } from '@/components/basics/Tab/hooks/useTab';
import React, { useEffect, useMemo, useRef } from 'react';

import { styles } from './AnswerTap.style';

export type AnswerTabKey = '답변' | '링크' | '단계';

export interface AnswerTapLink {
  id: number | string;
  title: string;
  url: string;
  summary?: string;
  imageUrl?: string;
}

export interface AnswerTapStep {
  title: string;
  description: string;
}

export interface AnswerTapProps {
  answer?: string;
  links?: AnswerTapLink[];
  steps?: AnswerTapStep[];
  className?: string;
  emptyAnswerText?: string;
  emptyLinkText?: string;
  emptyStepText?: string;
  onLinkClick?: (link: AnswerTapLink) => void;
}

const DEFAULT_TABS: AnswerTabKey[] = ['답변', '링크', '단계'];

export default function AnswerTap({
  answer,
  links = [],
  steps = [],
  className,
  emptyAnswerText = '답변이 준비되면 표시됩니다.',
  emptyLinkText = '표시할 링크가 없습니다.',
  emptyStepText = '표시할 단계가 없습니다.',
  onLinkClick,
}: AnswerTapProps) {
  const {
    root,
    answerContent,
    emptyState,
    linkList,
    stepList,
    stepItem,
    stepTitle,
    stepDescription,
    section,
    sectionTitle,
  } = styles();

  const { activeTab, handleTabClick } = useTab<AnswerTabKey>('답변');
  const answerRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLDivElement | null>(null);
  const stepRef = useRef<HTMLDivElement | null>(null);

  const tabRefs = useMemo(
    () => ({
      답변: answerRef,
      링크: linkRef,
      단계: stepRef,
    }),
    []
  );

  useEffect(() => {
    const ref = tabRefs[activeTab];
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab, tabRefs]);

  return (
    <div className={`${root()} ${className ?? ''}`.trim()}>
      <TabMenu
        menus={DEFAULT_TABS}
        activeTab={activeTab}
        onClick={e => handleTabClick((e.target as HTMLButtonElement).innerText as AnswerTabKey)}
      />
      <div className="relative -mt-0.5">
        <Divider />
      </div>
      <div className={section()} ref={answerRef}>
        <div className={sectionTitle()}>답변</div>
        <div className={answerContent()}>
          {answer?.trim() ? answer : <span className={emptyState()}>{emptyAnswerText}</span>}
        </div>
      </div>
      <div className={section()} ref={linkRef}>
        <div className={sectionTitle()}>링크</div>
        <div className={linkList()}>
          {links.length === 0 ? (
            <span className={emptyState()}>{emptyLinkText}</span>
          ) : (
            <CardList>
              {links.map(link => (
                <LinkCard
                  key={link.id}
                  imageUrl={link.imageUrl ?? ''}
                  link={link.url}
                  summary={link.summary ?? ''}
                  title={link.title}
                  onClick={onLinkClick ? () => onLinkClick(link) : undefined}
                />
              ))}
            </CardList>
          )}
        </div>
      </div>
      <div className={section()} ref={stepRef}>
        <div className={sectionTitle()}>단계</div>
        <div className={stepList()}>
          {steps.length === 0 ? (
            <span className={emptyState()}>{emptyStepText}</span>
          ) : (
            steps.map((step, index) => (
              <div key={`${step.title}-${index}`} className={stepItem()}>
                <div className={stepTitle()}>{step.title}</div>
                <div className={stepDescription()}>{step.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
