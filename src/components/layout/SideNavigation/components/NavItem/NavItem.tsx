import Button, { ButtonProps } from '@/components/basics/Button/Button';
import LinkButton from '@/components/wrappers/LinkButton/LinkButton';
import { forwardRef } from 'react';

interface NavItemProps extends Omit<ButtonProps, 'variant' | 'contextStyle' | 'radius'> {
  as?: 'button' | 'linkbutton';
  href?: string;
}

const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
  ({ as = 'button', children, href = '', ...props }, ref) => {
    if (as === 'button') {
      return (
        <Button
          ref={ref}
          variant="teritary_subtle"
          contextStyle="onPanel"
          radius="full"
          size="lg"
          className="flex h-10 w-50 justify-start gap-2 pl-2"
          {...props}
        >
          {children}
        </Button>
      );
    }

    return (
      <LinkButton
        href={href}
        variant="teritary_subtle"
        contextStyle="onPanel"
        radius="full"
        size="lg"
        className="flex h-10 w-50 justify-start gap-2 pl-2"
        {...props}
      >
        {children}
      </LinkButton>
    );
  }
);

NavItem.displayName = 'NavItem';
export default NavItem;
