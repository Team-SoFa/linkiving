import type { Link } from '@/types/link';

export const links: Link[] = [
  {
    id: 1,
    url: 'https://nextjs.org/docs',
    title: 'Next.js Documentation',
    memo: 'Key features and routing docs.',
    summary: 'Official Next.js documentation covering the App Router and core APIs.',
    imageUrl: '/images/default_linkcard_image.png',
    metadataJson: '{}',
    tags: 'nextjs,guide',
    isImportant: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    url: 'https://tanstack.com/query/latest',
    title: 'TanStack Query Guide',
    memo: 'Useful for query patterns.',
    summary: 'Overview of TanStack Query usage patterns and API surface.',
    imageUrl: '/images/default_linkcard_image.png',
    metadataJson: '{}',
    tags: 'react-query,guide',
    isImportant: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
