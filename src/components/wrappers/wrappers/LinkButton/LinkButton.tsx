import SVGIcon from '@/components/Icons/SVGIcon';
import Label from '@/components/basics/Label/Label';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import Link from 'next/link';

import Button, { ButtonProps } from '../../../basics/Button/Button';

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton = ({ href, icon, size, label, ...props }: LinkButtonProps) => {
  if (!icon && !label)
    console.error('LinkButton: Either icon or label should be provided for accessibility');

  const safeUrl = getSafeUrl(href);
  const isExternal = /^https?:\/\//i.test(safeUrl);
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Button asChild size={size} {...props}>
      <Link href={safeUrl} {...linkProps} className="flex items-center gap-1">
        {icon && <SVGIcon icon={icon} size={size} />}
        <Label textSize={size} className={icon ? 'pr-1' : ''}>
          {label}
        </Label>
      </Link>
    </Button>
  );
};

export default LinkButton;
