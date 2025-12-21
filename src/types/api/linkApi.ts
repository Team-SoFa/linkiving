import type { Link } from '@/types/link';

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
  links: LinkRes[];
  hasNext: boolean;
  lastId: number | null;
}

export type LinkListApiResponse = ApiResponseBase<LinkListApiData>;

export interface LinkListViewData {
  links: Link[];
  hasNext: boolean;
  lastId: number | null;
}

export type DeleteLinkApiResponse = ApiResponseBase<string> & {
  timestamp: string;
};

export type DuplicateLinkApiResponse = ApiResponseBase<{
  exists: boolean;
  linkId?: number;
}>;
