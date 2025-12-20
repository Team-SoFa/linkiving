// app/layout.tsx
import ToastContainer from '@/components/basics/Toast/ToastContainer';
import '@/styles/globals.css';
import type { Metadata } from 'next';

import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: {
    default: 'Linkiving - AI 북마크 관리 서비스',
    template: '%s - Linkiving',
  },
  description: 'AI와 함께 북마크를 안정적으로 관리해보세요',
  metadataBase: new URL('https://linkiving.com'),
  // OG (소셜 공유 미리보기)
  openGraph: {
    title: 'Linkiving – AI 북마크 관리 서비스',
    description: 'AI가 URL을 분석하여 자동으로 정리해주는 북마크 관리 서비스입니다.',
    url: 'https://linkiving.com',
    siteName: 'Linkiving',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Linkiving AI Bookmark',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkiving – AI 북마크 관리 서비스',
    description: 'AI가 URL을 분석하여 자동으로 정리해주는 북마크 관리 서비스입니다.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // 검색 인덱싱 정책 (로그인 기반 서비스 기준)
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <LayoutClient>{children}</LayoutClient>
        <ToastContainer />
      </body>
    </html>
  );
}
