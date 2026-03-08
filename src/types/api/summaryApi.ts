import type { ApiResponseBase, LinkSummaryFormat } from '@/types/api/linkApi';

// 요약 재생성 요청
export type RegenerateSummaryParams = {
  id: number;
  format?: LinkSummaryFormat;
};

// 요약 선택 요청
export type SelectSummaryParams = {
  id: number;
  summary: string;
  format: LinkSummaryFormat;
};

// 요약 재생성 응답 데이터
export type SummaryData = {
  existingSummary: string;
  newSummary: string;
  comparison: string;
};

// 요약 선택 응답 데이터
export type SelectSummaryData = {
  id: number;
  content: string;
};

// 요약 재생성 응답
export type SummaryResponse = ApiResponseBase<SummaryData>;

// 요약 선택 응답
export type SelectSummaryResponse = ApiResponseBase<SelectSummaryData>;
