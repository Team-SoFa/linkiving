import type { Link, PageSort, Pageable } from '@/types/link';

export interface ApiResponseBase<T> {
  success: boolean;
  status: string;
  message: string;
  data: T;
  timestamp?: string;
}

export type LinkApiData = Link;

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

export type DeleteLinkApiResponse = ApiResponseBase<string> & { timestamp: string };

export type DuplicateLinkApiResponse = ApiResponseBase<{
  exists: boolean;
  linkId?: number;
}>;
