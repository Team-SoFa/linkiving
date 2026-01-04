import useEscKeyPress from '@/hooks/util/useEscKeyPress';
import React, { ReactElement, cloneElement } from 'react';

import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import { usePopover } from './PopoverContext';

type ButtonElement = ReactElement<React.ComponentPropsWithRef<typeof Button>>;
type IconButtonElement = ReactElement<React.ComponentPropsWithRef<typeof IconButton>>;

interface PopoverTriggerProps {
  children: ButtonElement | IconButtonElement;
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

  // ref 병합
  const mergeRefs = (
    ...refs: Array<React.Ref<HTMLButtonElement> | undefined>
  ): React.RefCallback<HTMLButtonElement> => {
    return element => {
      refs.forEach(ref => {
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
        }
      });
    };
  };

  return cloneElement(children, {
    ref: mergeRefs(triggerRef, children.props.ref),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(e);
      handleClick();
    },
    'aria-haspopup': true,
    'aria-expanded': isActive,
    'aria-label': label || children.props['aria-label'],
  });
};
export default PopoverTrigger;
