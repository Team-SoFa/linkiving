'use client';

import { ReactNode } from 'react';

interface AnchorProps {
  children: ReactNode;
  href: string; // 링크 URL
  target?: '_self' | '_blank' | '_parent' | '_top';
  ariaLabel?: string;
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'noopener noreferrer' | 'ugc' | 'sponsored';
}

export default function Anchor({ children, href, target = '_self', ariaLabel, rel }: AnchorProps) {
  const finalRel = (() => {
    const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
    if (target === '_blank') tokens.add('noopener'); // window.opener 방지
    return tokens.size ? Array.from(tokens).join(' ') : undefined;
  })();
  const style = 'text-blue-600 hover:underline';

  return (
    <a href={href} target={target} rel={finalRel} aria-label={ariaLabel} className={style}>
      {children}
    </a>
  );
}
