import useEscKeyPress from '@/hooks/util/useEscKeyPress';
import { useMergedRefs } from '@reactuses/core';
import React, { ReactElement, cloneElement } from 'react';

import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import { usePopover } from './PopoverContext';

type ButtonElement = ReactElement<React.ComponentPropsWithRef<typeof Button>>;
type IconButtonElement = ReactElement<React.ComponentPropsWithRef<typeof IconButton>>;

interface ButtonLikeProps {
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  'aria-haspopup'?: boolean;
  'aria-expanded'?: boolean;
}

interface PopoverTriggerProps {
  children: ButtonElement | IconButtonElement | ReactElement<ButtonLikeProps>;
  popoverKey: string;
  label?: string;
}
const PopoverTrigger = ({ children, popoverKey, label }: PopoverTriggerProps) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { activeKey, toggle, close } = usePopover();

  const isActive = activeKey === popoverKey;

  useEscKeyPress({ onEscPress: close, enabled: isActive });

  const handleClick = () => {
    if (triggerRef.current) {
      toggle(popoverKey, triggerRef.current);
    }
  };

  return cloneElement(children, {
    ref: useMergedRefs(triggerRef, children.props.ref),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(e);
      handleClick();
    },
    'aria-haspopup': true,
    'aria-expanded': isActive,
    'aria-label': label || children.props['aria-label'],
  } as Partial<ButtonLikeProps>);
};
export default PopoverTrigger;
