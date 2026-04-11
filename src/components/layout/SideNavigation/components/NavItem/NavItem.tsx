import SVGIcon from '@/components/Icons/SVGIcon';
import { IconMapTypes } from '@/components/Icons/icons';
import { ButtonProps } from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { useBlurOnClick } from '@/hooks/util/useBlurOnClick';
import { useSideNavStore } from '@/stores/sideNavStore';
import { useMergedRefs } from '@reactuses/core';
import { forwardRef } from 'react';

interface NavItemProps extends Omit<ButtonProps, 'variant' | 'contextStyle' | 'radius'> {
  icon: IconMapTypes;
  ariaLabel: string;
}

const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  ({ label, icon, ariaLabel, onClick, ...props }, forwardedRef) => {
    const { isOpen } = useSideNavStore();
    const { ref: blurRef, onClick: blurOnClick } = useBlurOnClick(onClick);

    const mergedRef = useMergedRefs(blurRef, forwardedRef);

    const commonProps = {
      variant: 'tertiary_subtle' as const,
      contextStyle: 'onPanel' as const,
      size: 'lg' as const,
      ...props,
    };

    return isOpen ? (
      <button
        ref={mergedRef}
        className="group text-gray500 hover:text-gray700 bg-btn-tertiary-subtle-onpanel flex h-10 w-50 cursor-pointer items-center gap-2 rounded-full pr-3 pl-2 transition-colors"
        onClick={blurOnClick}
        type="button"
        aria-label={ariaLabel}
      >
        <SVGIcon icon={icon} aria-label={ariaLabel} size="xl" aria-hidden="true" />
        <span className="font-label-lg truncate">{label}</span>
      </button>
    ) : (
      <IconButton
        {...commonProps}
        icon={icon}
        ariaLabel={ariaLabel}
        ref={mergedRef}
        onClick={blurOnClick}
      />
    );
  }
);

NavItem.displayName = 'NavItem';
export default NavItem;
