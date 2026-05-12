import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/signup'],
      disallow: [
        '/home',
        '/all-link',
        '/chat/',
        '/mypage',
        '/api/',
        '/chat-api-demo',
        '/link-api-demo',
        '/mock-chat',
      ],
    },
    sitemap: 'https://linkiving.com/sitemap.xml',
  };
}
