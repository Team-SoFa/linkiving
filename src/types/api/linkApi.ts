import type { Link } from '@/types/link';
import { z } from 'zod';

export interface ApiResponseBase<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
  timestamp?: string;
}

export interface LinkRes {
  id: number;
  url: string;
  title: string;
  summary?: { id: number; content: string } | string;
  memo?: string;
  imageUrl?: string;
}

export type LinkApiData = LinkRes;

export type LinkApiResponse = ApiResponseBase<LinkApiData>;

// 링크 리스트 (커서 기반)
export interface LinkListApiData {
  links: LinkApiData[];
  hasNext: boolean;
  lastId: number | null;
}

export type LinkListApiResponse = ApiResponseBase<LinkListApiData>;

export type LinkListViewData = Omit<LinkListApiData, 'links'> & {
  content: Link[];
};

export type DeleteLinkApiResponse = ApiResponseBase<string> & { timestamp: string };

// 중복 링크

export const DuplicateLinkQuerySchema = z.object({
  url: z.string().url(),
});

export type DuplicateLinkQuery = z.infer<typeof DuplicateLinkQuerySchema>;

export type DuplicateLinkApiResponse = ApiResponseBase<{
  exists: boolean;
  linkId?: number;
}>;

export interface LinkMetaScrapeData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export type LinkMetaScrapeApiResponse = ApiResponseBase<LinkMetaScrapeData>;

export type LinkSummaryFormat = 'CONCISE' | 'DETAILED';

export interface LinkSummaryRegenerateData {
  existingSummary: string;
  newSummary: string;
  comparison: string;
}

export type LinkSummaryRegenerateApiResponse = ApiResponseBase<LinkSummaryRegenerateData>;
