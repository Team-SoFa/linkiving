import { IconMapTypes } from '@/components/Icons/icons';
import Button, { ButtonProps } from '@/components/basics/Button/Button';
import IconButton from '@/components/basics/IconButton/IconButton';
import { useBlurOnClick } from '@/hooks/util/useBlurOnClick';
import { useSideNavStore } from '@/stores/sideNavStore';

interface NavItemProps extends Omit<ButtonProps, 'variant' | 'contextStyle' | 'radius'> {
  icon: IconMapTypes;
  ariaLabel: string;
}

const NavItem = ({ children, icon, ariaLabel, ...props }: NavItemProps) => {
  const { isOpen } = useSideNavStore();
  const { ref, onClick } = useBlurOnClick(props.onClick);

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
      className="flex h-10 w-50 justify-start gap-2 pl-2"
      ref={ref}
      onClick={onClick}
    >
      {children}
    </Button>
  ) : (
    <IconButton {...commonProps} icon={icon} ariaLabel={ariaLabel!} ref={ref} onClick={onClick} />
  );
};

NavItem.displayName = 'NavItem';
export default NavItem;
