import type { Link, PageSort, Pageable } from '@/types/link';
import z from 'zod';

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
  summary?: string;
  memo?: string;
  imageUrl?: string;
}

export type LinkApiData = LinkRes;

export type LinkApiResponse = ApiResponseBase<LinkApiData>;

export interface LinkListApiData {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  numberOfElements: number;
  size: number;
  content: LinkApiData[];
  number: number;
  sort: PageSort;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type LinkListApiResponse = ApiResponseBase<LinkListApiData>;

export type LinkListViewData = Omit<LinkListApiData, 'content'> & {
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
