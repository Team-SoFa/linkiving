import { IconMapTypes } from '@/components/Icons/icons';
import Button, { ButtonProps } from '@/components/basics/Button/Button';
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
      <Button
        {...commonProps}
        icon={icon}
        radius="full"
        className="flex h-10! w-50 justify-start gap-2 pl-2"
        ref={mergedRef}
        label={label}
        onClick={blurOnClick}
      />
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
