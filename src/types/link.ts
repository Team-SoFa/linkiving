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

export type CreateLinkPayload = Pick<Link, 'url' | 'title'> &
  Partial<Pick<Link, 'memo' | 'imageUrl' | 'summary' | 'metadataJson' | 'tags' | 'isImportant'>>;

export type UpdateLinkPayload = Partial<
  Pick<
    Link,
    'url' | 'title' | 'memo' | 'imageUrl' | 'summary' | 'metadataJson' | 'tags' | 'isImportant'
  >
>;

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
