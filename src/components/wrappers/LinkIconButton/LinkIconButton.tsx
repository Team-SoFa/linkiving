import SVGIcon from '@/components/Icons/SVGIcon';
import { buttonSizeMap } from '@/components/Icons/icons';
import IconButton, { IconButtonProps } from '@/components/basics/IconButton/IconButton';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Link from 'next/link';
import React from 'react';

interface LinkIconButtonProps extends Omit<IconButtonProps, 'ariaLabel'> {
  href: string;
  ariaLabel: string;
}

const LinkIconButton = React.forwardRef<HTMLButtonElement, LinkIconButtonProps>(
  ({ href, icon, size = 'md', variant, contextStyle, ariaLabel, className, ...props }, ref) => {
    if (!icon)
      console.error('LinkIconButton: Either icon or label should be provided for accessibility');

    const safeUrl = getSafeUrl(href);
    const isExternal = /^https?:\/\//i.test(safeUrl);
    const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <IconButton
        asChild
        size={size}
        variant={variant}
        contextStyle={contextStyle}
        icon={icon}
        ariaLabel={ariaLabel}
        className={className}
        ref={ref}
        {...props}
      >
        <Link href={safeUrl} {...linkProps}>
          <SVGIcon icon={icon} size={buttonSizeMap[size]} />
        </Link>
      </IconButton>
    );
  }
);

export default LinkIconButton;
