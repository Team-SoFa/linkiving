import type { LinkSummaryStatus } from '@/types/link';

export interface SummaryStatusEvent {
  linkId: number;
  status: LinkSummaryStatus;
  progress?: number;
  summary?: string;
  updatedAt: string;
}

const now = new Date().toISOString();

export const mockSummaryStatusEvents: SummaryStatusEvent[] = [
  { linkId: 103, status: 'generating', progress: 45, updatedAt: now },
  { linkId: 108, status: 'generating', progress: 10, updatedAt: now },
  {
    linkId: 105,
    status: 'failed',
    summary: '요약 생성에 실패했습니다. 다시 시도해 주세요.',
    updatedAt: now,
  },
  {
    linkId: 112,
    status: 'idle',
    updatedAt: now,
  },
  {
    linkId: 101,
    status: 'ready',
    summary:
      'A quick overview of layout patterns that keep dense dashboards scannable and consistent.',
    updatedAt: now,
  },
  {
    linkId: 103,
    status: 'ready',
    summary:
      '온보딩 흐름에서 첫 사용 경험을 개선하기 위한 주요 패턴과 UI 구성 요소를 요약했습니다.',
    updatedAt: now,
  },
];
