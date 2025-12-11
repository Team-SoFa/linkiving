'use client';

import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';

const mockTitle = 'Link title area example text spanning two lines for demo purposes';
const mockSummary =
  'This is placeholder summary text for the panel route. It demonstrates how the link details appear within the panel layout and spans multiple sentences to mimic a real summary.';
const mockMemo =
  'This is placeholder memo text for the panel route. It is editable within the panel component and stands in for user-provided notes.';

export default function Page() {
  return (
    <LinkCardDetailPanel
      url="https://examples.designsystem.co.kr"
      title={mockTitle}
      summary={mockSummary}
      memo={mockMemo}
      imageUrl="/images/default_linkcard_image.png"
      onClose={() => console.log('close panel')}
      onMore={() => console.log('more actions')}
    />
  );
}
