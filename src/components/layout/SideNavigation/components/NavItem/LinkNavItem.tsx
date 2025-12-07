import { IconMapTypes } from '@/components/Icons/icons';
import { ButtonProps } from '@/components/basics/Button/Button';
import LinkButton from '@/components/wrappers/LinkButton/LinkButton';
import LinkIconButton from '@/components/wrappers/LinkIconButton/LinkIconButton';
import { useBlurOnClick } from '@/hooks/util/useBlurOnClick';
import { useSideNavStore } from '@/stores/sideNavStore';

interface LinkNavItemProps extends Omit<
  ButtonProps,
  'variant' | 'contextStyle' | 'radius' | 'size'
> {
  href: string;
  icon: IconMapTypes; // LinkIconButton
  ariaLabel: string; // LinkIconButton
}

const LinkNavItem = ({ children, href, icon, ariaLabel, ...props }: LinkNavItemProps) => {
  const { isOpen } = useSideNavStore();
  const { ref, onClick } = useBlurOnClick(props.onClick);

  const commonProps = {
    href,
    variant: 'teritary_subtle' as const,
    contextStyle: 'onPanel' as const,
    size: 'lg' as const,
    ...props,
  };

  return isOpen ? (
    <LinkButton
      {...commonProps}
      icon={icon}
      radius="full"
      className="flex h-10 w-50 justify-start gap-2 pl-2"
      ref={ref}
      onClick={onClick}
    >
      {children}
    </LinkButton>
  ) : (
    <LinkIconButton
      {...commonProps}
      icon={icon}
      ariaLabel={ariaLabel}
      ref={ref}
      onClick={onClick}
    />
  );
};

LinkNavItem.displayName = 'LinkNavItem';
export default LinkNavItem;
