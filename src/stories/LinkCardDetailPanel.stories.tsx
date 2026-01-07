import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';
import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';

const meta = {
  title: 'Components/Wrappers/LinkCardDetailPanel',
  component: LinkCardDetailPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    url: { control: 'text' },
    title: { control: 'text' },
    summary: { control: 'text' },
    memo: { control: 'text' },
    imageUrl: { control: 'text' },
    summaryState: { control: 'text' },
  },
} satisfies Meta<typeof LinkCardDetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledPanel = (props: Story['args']) => {
  const [title, setTitle] = useState(props?.title ?? '');
  const [memo, setMemo] = useState(props?.memo ?? '');

  return (
    <LinkCardDetailPanel
      {...props}
      title={title}
      memo={memo}
      onTitleChange={setTitle}
      onMemoChange={setMemo}
      onClose={() => console.log('close panel')}
      onRetrySummary={props?.onRetrySummary ?? (() => console.log('retry summary'))}
      onRegenerateSummary={props?.onRegenerateSummary ?? (() => console.log('regenerate summary'))}
    />
  );
};

const baseArgs = {
  url: 'https://examples.designsystem.co.kr',
  title: '텍스트박스 제목 영역 2줄 텍스트박스 제목 영역 2줄 텍스트박스 제목 영역 2줄',
  summary:
    '웹접근성 “운용의 용이성” 맥락에서 포커스 스타일의 중요성을 살펴봅니다. 기본 UA outline은 디자인과 충분히 스테이징이 필요했어요.\nfocus는 키보드/마우스 모두에 적용되며 보완(충족)합니다.\nfocus-visible은 주로 키보드 탐색 시 표시되어 접근성을 돕습니다.웹접근성 “운용의 용이성” 맥락에서 포커스 스타일의 중요성을 살펴봅니다. 기본 UA outline은 디자인과 충분히 스테이징이 필요했어요.\nfocus는 키보드/마우스 모두에 적용되며 보완(충족)합니다.\nfocus-visible은 주로 키보드 탐색 시 표시되어 접근성을 돕습니다.',
  imageUrl: '/images/default_linkcard_image.png',
  memo: '메모를 입력해 주세요',
};

export const SummaryError: Story = {
  name: '요약 생성 실패',
  render: args => <ControlledPanel {...args} />,
  args: {
    ...baseArgs,
    summary: '',
    summaryState: 'error',
    summaryErrorMessage: '일시적 오류로 요약을 생성하지 못했습니다.',
  },
};

export const SummaryLoading: Story = {
  name: '요약 생성 중',
  render: args => <ControlledPanel {...args} />,
  args: {
    ...baseArgs,
    summary: '',
    summaryState: 'loading',
  },
};

export const SummaryReady: Story = {
  name: '요약 완료',
  render: args => <ControlledPanel {...args} />,
  args: {
    ...baseArgs,
    summaryState: 'ready',
  },
};
