import type { ApiResponseBase } from '@/types/api/linkApi';

export interface ReportRequest {
  content: string;
}

export type ReportApiResponse = ApiResponseBase<string>;
