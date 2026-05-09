import SVGIcon from '@/components/Icons/SVGIcon';
import { IconMapTypes } from '@/components/Icons/icons';
import { getSafeUrl } from '@/hooks/util/getSafeUrl';
import { useSideNavStore } from '@/stores/sideNavStore';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

interface LinkNavItemProps {
  href: string;
  icon: IconMapTypes;
  label?: string;
  ariaLabel: string;
}

const LinkNavItem = ({ label, href, icon, ariaLabel }: LinkNavItemProps) => {
  const { isOpen } = useSideNavStore();
  const safeUrl = getSafeUrl(href);
  const isExternal = /^https?:\/\//i.test(safeUrl);
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <Link
      href={safeUrl}
      className="bg-btn-tertiary-subtle-onpanel group text-gray500 hover:text-gray700 flex h-10 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-full px-2 transition-colors"
      aria-label={ariaLabel}
      {...linkProps}
    >
      <SVGIcon icon={icon} aria-hidden="true" size="xl" className="shrink-0" />
      <AnimatePresence>
        {isOpen && label && (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="font-label-lg truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

LinkNavItem.displayName = 'LinkNavItem';
export default LinkNavItem;
