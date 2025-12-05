'use client';

import LinkCardDetailPanel from '@/components/wrappers/LinkCardDetailPanel/LinkCardDetailPanel';

const mockTitle = '텍스트박스 제목 영역 2줄 텍스트박스 제목 영역 2줄 텍스트박스';
const mockSummary =
  '웹 접근성, “운영의 용이성” 맥락에서 포커스 스타일의 중요성을 설명합니다. 기본 UA outline은 디자인과 동떨어져 커스텀 스타일이 필요합니다.\n.focus는 키보드/마우스 모두에 적용되며 광범위한 범위(탭)가집니다.\n.focus-visible은 주로 키보드 탐색 시만 표시되어 깜빡임을 줄입니다.\n\n(Chrome 60+ IE 미지원)\n\n결론: 프로젝트의 브라우저 지원 범위를 확인하고 .focus, .focus-visible, .focus-within을 상황별로 조정하길 권고합니다.';

export default function PanelPage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-white px-6 py-10">
      <LinkCardDetailPanel
        url="https://examples.designsystem.co.kr"
        title={mockTitle}
        summary={mockSummary}
        memo="웹 접근성을 위한 focus 스타일, 상황에 맞게 적용하기에 대한 메모를 작성했습니다. "
        imageUrl="/images/default_linkcard_image.png"
        badgeLabel="Badge Label"
        onClose={() => console.log('close panel')}
        onMore={() => console.log('more actions')}
      />
    </main>
  );
}
