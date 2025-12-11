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
      onMore={() => console.log('more actions')}
      /* Storybook에서는 불필요한 기본 액션이 보이지 않도록 명시적으로 숨깁니다. */
      headerActions={null}
      titleActions={null}
      summaryActions={null}
      memoActions={null}
    />
  );
};

export const Default: Story = {
  render: args => <ControlledPanel {...args} />,
  args: {
    url: 'https://examples.designsystem.co.kr',
    title: 'Link title area example text spanning two lines for demo purposes',
    summary:
      '웹 접근성, “운영의 용이성” 맥락에서 포커스 스타일의 중요성을 설명합니다. 기본 UA outline은 디자인과 동떨어져 커스텀 스타일이 필요합니다.\n.focus는 키보드/마우스 모두에 적용되며 광범위한 범위(탭)가집니다.\n.focus-visible은 주로 키보드 탐색 시만 표시되어 깜빡임을 줄입니다.\n\n(Chrome 60+ IE 미지원)\n\n결론: 프로젝트의 브라우저 지원 범위를 확인하고 .focus, .focus-visible, .focus-within을 상황별로 조정하길 권고합니다.',
    imageUrl: '/images/default_linkcard_image.png',
    memo: '웹 접근성을 위한 focus 스타일, 상황에 맞게 적용하기에 대한 메모를 작성했습니다. 자주 봐야 할 문장입니다.',
  },
};
