import type { LinkApiData, LinkListApiData, LinkListApiResponse } from '@/types/api/linkApi';
import type { PageSort, Pageable } from '@/types/link';

import { buildResponse } from '../response';

const pageSort: PageSort = {
  unsorted: true,
  sorted: false,
  empty: true,
};

const pageable: Pageable = {
  pageNumber: 0,
  pageSize: 12,
  offset: 0,
  paged: true,
  unpaged: false,
  sort: pageSort,
};

export const mockLinks: LinkApiData[] = [
  {
    id: 101,
    url: 'https://examples.design/clean-layouts',
    title: '복잡한 대시보드를 위한 깔끔한 레이아웃',
    summary:
      '정보 밀도가 높은 대시보드에서도 읽기 쉬운 레이아웃 패턴을 정리했습니다. 카드, 표, 필터, 차트가 함께 있을 때 계층을 어떻게 나누고, 어떤 여백을 유지해야 읽기 흐름이 끊기지 않는지 사례 중심으로 설명합니다.',
    memo: '관리자 UI 기준안으로 참고. 실제 운영 화면에서 빈번히 발생하는 밀집 레이아웃 케이스를 포함하고 있어, 내부 디자인 가이드 문서에도 인용하기 좋습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
  },
  {
    id: 102,
    url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
    title: '웹 접근성 기초',
    summary:
      '접근성을 위한 핵심 원칙, 도구, 실무 체크리스트를 정리했습니다. 스크린 리더 대응, 키보드 포커스 순서, 색 대비, 대체 텍스트 작성 요령까지 포함하고 있어 QA 체크리스트로 바로 사용 가능합니다.',
    memo: '접근성 리포트 참고. 대비/포커스/대체 텍스트 관련 항목은 체크리스트로 바로 옮겨 써도 될 정도로 정리되어 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  },
  {
    id: 103,
    url: 'https://growth.design/case-studies',
    title: '온보딩 케이스 스터디 모음',
    summary: '',
    memo: '요약 생성 중.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  },
  {
    id: 104,
    url: 'https://brunchstory.com/post/healthy-meals',
    title: '바쁜 평일을 위한 건강 식단',
    summary:
      '단백질 중심, 준비 시간 최소화, 주간 계획에 맞춘 식단 아이디어. 재료 구매 리스트부터 한 주 식단 배치 예시, 남는 재료 재활용 팁까지 포함해 바로 적용할 수 있도록 구성했습니다.',
    memo: '라이프스타일 카테고리용. 카드 뷰에서는 요약을 길게 보여도 좋고, 상세 패널에서는 식단 플로우를 단계별로 보여주면 좋을 듯.',
    imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
  },
  {
    id: 105,
    url: 'https://velog.io/@sample/productivity',
    title: '주간 생산성 회고',
    summary: '',
    memo: '요약 생성 실패.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  },
  {
    id: 106,
    url: 'https://uibowl.io/recipes',
    title: '모던 앱을 위한 레시피 카드',
    summary: '음식/레시피 탐색에 맞춘 카드 UI 패턴 모음입니다.',
    memo: '레퍼런스로 저장.',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
  },
  {
    id: 107,
    url: 'https://examples.design/brand-voice',
    title: '일관된 브랜드 톤 구축',
    summary:
      '제품/마케팅 카피 톤을 맞추는 실무 단계 정리. 브랜드 핵심 가치 정의, 금지/권장 표현, 보이스 차트 작성 예시를 포함해 신규 페이지 작성 시 참고하기 좋습니다.',
    memo: '콘텐츠 팀 공유.',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
  },
  {
    id: 108,
    url: 'https://tech.example.com/ai-roadmap',
    title: '팀을 위한 AI 로드맵',
    summary: '',
    memo: '요약 대기 중.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    id: 109,
    url: 'https://examples.design/white-space',
    title: '정보 밀도 높은 레이아웃의 여백',
    summary:
      '여백을 활용해 정보 밀도를 유지하면서도 읽기 쉬운 구성 방법. 카드 간 간격, 섹션 분리, 정보 덩어리 크기 조절 기준을 단계적으로 정리했습니다.',
    memo: '레이아웃 QA 참고.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    id: 110,
    url: 'https://design.example.com/typography',
    title: '제품을 위한 타이포그래피 시스템',
    summary: '계층과 가독성을 중심으로 한 확장 가능한 타이포 시스템 가이드.',
    memo: '디자인 시스템 참고.',
    imageUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58',
  },
  {
    id: 111,
    url: 'https://wellness.example.com/sleep',
    title: '수면 최적화 기본',
    summary: '수면의 질과 아침 에너지를 높이는 습관과 루틴 정리.',
    memo: '라이프스타일 콘텐츠.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  },
  {
    id: 112,
    url: 'https://work.example.com/meeting-notes',
    title: '회의록 템플릿',
    summary: '',
    memo: '요약 요청 전.',
    imageUrl: 'https://images.unsplash.com/photo-1485217988980-11786ced9454',
  },
];

export const mockLinkListData: LinkListApiData = {
  totalPages: 1,
  totalElements: mockLinks.length,
  pageable,
  numberOfElements: mockLinks.length,
  size: pageable.pageSize,
  content: mockLinks,
  number: pageable.pageNumber,
  sort: pageSort,
  first: true,
  last: true,
  empty: mockLinks.length === 0,
};

export const mockLinkListResponse: LinkListApiResponse = buildResponse(mockLinkListData);

export const mockLinkById = (id: number) => mockLinks.find(link => link.id === id) ?? null;
