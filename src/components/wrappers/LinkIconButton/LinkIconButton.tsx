import SVGIcon from '@/components/Icons/SVGIcon';
import IconButton, { IconButtonProps } from '@/components/basics/IconButton/IconButton';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Link from 'next/link';

interface LinkIconButtonProps extends Omit<IconButtonProps, 'ariaLabel'> {
  href: string;
  ariaLabel: string;
}

const LinkIconButton = ({ href, icon, size, ariaLabel }: LinkIconButtonProps) => {
  if (!icon)
    console.error('LinkIconButton: Either icon or label should be provided for accessibility');

  const safeUrl = getSafeUrl(href);
  const isExternal = /^https?:\/\//i.test(safeUrl);
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <IconButton asChild size={size} icon={icon} ariaLabel={ariaLabel}>
      <Link href={safeUrl} {...linkProps}>
        <SVGIcon icon={icon} size={size} />
      </Link>
    </IconButton>
  );
};

export default LinkIconButton;
