import { IconMapTypes } from '@/components/Icons/icons';
import Button, { ButtonProps } from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { useBlurOnClick } from '@/hooks/util/useBlurOnClick';
import { useSideNavStore } from '@/stores/sideNavStore';
import { forwardRef } from 'react';

interface NavItemProps extends Omit<ButtonProps, 'variant' | 'contextStyle' | 'radius'> {
  icon: IconMapTypes;
  ariaLabel: string;
}

const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  ({ label, icon, ariaLabel, onClick, ...props }, forwardedRef) => {
    const { isOpen } = useSideNavStore();
    const { ref: blurRef, onClick: handleClick } = useBlurOnClick(onClick);

    // ref 병합
    const mergeRefs = (el: HTMLButtonElement | null) => {
      [forwardedRef, blurRef].forEach(ref => {
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      });
    };

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
        ref={mergeRefs}
        onClick={handleClick}
        label={label}
      />
    ) : (
      <IconButton
        {...commonProps}
        icon={icon}
        ariaLabel={ariaLabel!}
        ref={mergeRefs}
        onClick={handleClick}
      />
    );
  }
);

NavItem.displayName = 'NavItem';
export default NavItem;
