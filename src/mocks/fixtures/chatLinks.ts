export type ChatLinkCard = {
  id: number;
  title: string;
  url: string;
  summary: string;
  imageUrl?: string;
};

export const chatLinksById: Record<number, ChatLinkCard[]> = {
  201: [
    {
      id: 1101,
      title: '웹 접근성 가이드 요약',
      url: 'https://examples.design/a11y-guide',
      summary: '접근성 핵심 원칙과 실무 체크리스트를 한 번에 정리한 가이드입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    },
    {
      id: 1102,
      title: '키보드 네비게이션 패턴',
      url: 'https://examples.design/keyboard-nav',
      summary: '포커스 이동 규칙과 예외 처리 패턴을 모아둔 자료입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
    },
  ],
  202: [
    {
      id: 1201,
      title: '팀을 위한 AI 로드맵',
      url: 'https://tech.example.com/ai-roadmap',
      summary: 'AI 도입 단계별 체크리스트와 조직 준비 항목을 제공합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    },
    {
      id: 1202,
      title: 'AI 트렌드 요약',
      url: 'https://examples.design/ai-trends',
      summary: '올해 주요 AI 트렌드와 제품 적용 사례를 요약했습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    },
  ],
  203: [
    {
      id: 1301,
      title: '제품 타이포그래피 시스템',
      url: 'https://design.example.com/typography',
      summary: '가독성을 높이는 타입 시스템 구성 방법을 소개합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
    },
    {
      id: 1302,
      title: '정보 밀도 높은 레이아웃',
      url: 'https://examples.design/white-space',
      summary: '여백을 활용해 읽기 흐름을 유지하는 구성 팁입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    },
    {
      id: 1303,
      title: '브랜드 톤 구축 가이드',
      url: 'https://examples.design/brand-voice',
      summary: '브랜드 보이스를 일관되게 유지하는 작성 기준입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
    },
  ],
};
