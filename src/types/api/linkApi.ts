import type { Link, PageSort, Pageable } from '@/types/link';

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

export type DuplicateLinkApiResponse = ApiResponseBase<{
  exists: boolean;
  linkId?: number;
}>;
