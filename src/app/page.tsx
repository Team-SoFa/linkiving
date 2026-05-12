import type { Metadata } from 'next';

import Landing from './LandingPage';

export const metadata: Metadata = {
  title: 'Linkiving - 북마크들을 더 똑똑하게 관리해요',
  description:
    '저장하고 잊어버리던 북마크. 다시 보려고 했더니 사라져 버린 웹사이트들. 전에 분명 저장한 거 같은데 기억이 안나는 북마크들. 이젠 링카이빙과 함께 똑똑하게 편하게 관리해요!',
  keywords: [
    '링크 관리',
    '북마크 관리',
    '북마크',
    'AI 북마크',
    '링크 정리',
    '웹사이트 저장',
    '북마크 앱',
    '생산성 도구',
    '링크 큐레이션',
    'AI 추천',
    '링카이빙',
  ],

  // Open Graph (카톡, 페북 등 공유)
  openGraph: {
    title: 'Linkiving - 북마크들을 더 똑똑하게 관리해요',
    description: '저장하고 잊어버리던 북마크. 이젠 링카이빙과 함께 똑똑하게 관리해요!',
    url: 'https://linkiving.com',
    siteName: 'Linkiving',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Linkiving',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 트위터 카드
  twitter: {
    card: 'summary_large_image',
    title: 'Linkiving - 북마크들을 더 똑똑하게 관리해요',
    description: '저장하고 잊어버리던 북마크. 이젠 링카이빙과 함께 똑똑하게 관리해요!',
    images: ['/og-image.png'],
  },

  // 추가 SEO
  robots: {
    index: true,
    follow: true,
  },

  // canonical
  alternates: {
    canonical: 'https://linkiving.com',
  },

  verification: {
    google: '6E424KKiERDssOB61adcXm9BmyBt3PRHLe4JuimzdXw',
    other: {
      'naver-site-verification': '3f4f09dc04077bde858433f31cb285915e9efa07',
    },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <Landing error={params?.error} />;
}
