import SVGIcon from '@/components/Icons/SVGIcon';
import { IconMapTypes } from '@/components/Icons/icons';
import { ButtonProps } from '@/components/basics/Button/Button';
import { useBlurOnClick } from '@/hooks/util/useBlurOnClick';
import { useSideNavStore } from '@/stores/sideNavStore';
import { useMergedRefs } from '@reactuses/core';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef } from 'react';

interface NavItemProps extends Omit<ButtonProps, 'variant' | 'contextStyle' | 'radius'> {
  icon: IconMapTypes;
  ariaLabel: string;
  profile?: string;
}

const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  ({ label, icon, ariaLabel, profile, onClick, ...props }, forwardedRef) => {
    const { isOpen } = useSideNavStore();
    const { ref: blurRef, onClick: blurOnClick } = useBlurOnClick(onClick);
    const mergedRef = useMergedRefs(blurRef, forwardedRef);

    return (
      <button
        ref={mergedRef}
        className="group text-gray500 hover:text-gray700 bg-btn-tertiary-subtle-onpanel flex h-10 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-full px-2 transition-colors"
        onClick={blurOnClick}
        type="button"
        aria-label={ariaLabel}
        {...props}
      >
        {profile ? (
          <Image
            src={profile}
            alt={`${label}의 프로필 이미지`}
            width={24}
            height={24}
            className="shrink-0 rounded-full"
          />
        ) : (
          <SVGIcon icon={icon} aria-hidden="true" size="xl" className="shrink-0" />
        )}
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
      </button>
    );
  }
);

NavItem.displayName = 'NavItem';
export default NavItem;
