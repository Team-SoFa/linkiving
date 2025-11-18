import SVGIcon from '@/components/Icons/SVGIcon';
import { buttonSizeMap } from '@/components/Icons/icons';
import Button, { ButtonProps } from '@/components/basics/Button/Button';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Link from 'next/link';

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton = ({ href, icon, size = 'md', label, ...props }: LinkButtonProps) => {
  if (!icon && !label)
    console.error('LinkButton: Either icon or label should be provided for accessibility');

  const safeUrl = getSafeUrl(href);
  const isExternal = /^https?:\/\//i.test(safeUrl);
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Button asChild {...props}>
      <Link href={safeUrl} className="flex items-center gap-1" {...linkProps}>
        {icon && <SVGIcon icon={icon} size={buttonSizeMap[size]} />}
        <span className={icon ? 'pr-1' : ''}>{label}</span>
      </Link>
    </Button>
  );
};

export default LinkButton;
