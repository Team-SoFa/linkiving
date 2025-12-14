export interface Link {
  id: number;
  url: string;
  title: string;
  summary: string;
  memo?: string;
  imageUrl?: string;
  metadataJson?: string;
  tags?: string;
  isImportant?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AtLeastOne<T, Keys extends keyof T = keyof T> = Partial<T> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Omit<T, K>> }[Keys];

type OptionalLinkFields = Pick<
  Link,
  'memo' | 'imageUrl' | 'summary' | 'metadataJson' | 'tags' | 'isImportant'
>;

export type CreateLinkPayload = Pick<Link, 'url' | 'title'> & Partial<OptionalLinkFields>;

type UpdatableLinkFields = {
  url?: string | null;
  title?: string | null;
  memo?: string | null;
  imageUrl?: string | null;
  summary?: string | null;
  metadataJson?: string | null;
  tags?: string | null;
  isImportant?: boolean | null;
};

export type UpdateLinkPayload = AtLeastOne<UpdatableLinkFields>;

export interface PageSort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: PageSort;
}

export interface PageResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  numberOfElements: number;
  size: number;
  content: T[];
  number: number;
  sort: PageSort;
  first: boolean;
  last: boolean;
  empty: boolean;
}
