'use client';

import clsx from 'clsx';
import { HTMLAttributes, ReactNode, forwardRef } from 'react';

import SVGIcon from '../Icons/SVGIcon';

interface AnchorProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'target'> {
  className?: string;
  iconVisible?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  href: string; // 링크 URL
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'ugc' | 'sponsored' | (string & {});
  target?: '_self' | '_blank' | '_parent' | '_top';
}

const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  {
    className,
    iconVisible = true,
    children,
    href,
    target = '_self',
    ariaLabel,
    rel = 'noopener noreferrer',
    ...rest
  },
  ref
) {
  const finalRel = (() => {
    const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
    if (target === '_blank') tokens.add('noopener'); // window.opener 방지
    return tokens.size ? Array.from(tokens).join(' ') : undefined;
  })();

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={finalRel}
      aria-label={ariaLabel}
      className={clsx('inline-flex items-center gap-1 text-gray-400 hover:underline', className)}
      {...rest}
    >
      {iconVisible && (
        <SVGIcon
          icon="IC_LinkOpen"
          className="mt-[1px] text-gray-400"
          size="sm"
          aria-hidden="true"
        />
      )}
      {children}
    </a>
  );
});

export default Anchor;
