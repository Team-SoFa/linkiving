import type { ApiResponseBase, LinkSummaryFormat } from '@/types/api/linkApi';
import type { EntityId } from '@/types/id';

// 요약 재생성 요청
export type RegenerateSummaryParams = {
  id: EntityId;
  format?: LinkSummaryFormat;
};

// 요약 선택 요청
export type SelectSummaryParams = {
  id: EntityId;
  summary: string;
  format: LinkSummaryFormat;
};

// 요약 재생성 응답 데이터
export type SummaryData = {
  existingSummary: string;
  newSummary: string;
  difference: string;
};

export type RetrySummaryResponse = {
  success: boolean;
  status: string;
  message: string;
  data?: SummaryData | null;
  timestamp?: string;
};

// 요약 선택 응답 데이터
export type SelectSummaryData = {
  id: EntityId;
  content: string;
};

// 요약 재생성 응답
export type SummaryResponse = ApiResponseBase<SummaryData>;

// 요약 선택 응답
export type SelectSummaryResponse = ApiResponseBase<SelectSummaryData>;
