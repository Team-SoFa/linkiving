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

/**
 * Button/IconButton 은 접근성 이름을 `aria-label` 이 아니라 자체 prop 인 `ariaLabel` 로 받는다.
 * 여기서 `aria-label: undefined` 를 무조건 주입하면, 두 컴포넌트가 `{...rest}` 를
 * `aria-label={ariaLabel}` 뒤에 펼치기 때문에 이름이 지워진다.
 */
type LabelledChildProps = { ariaLabel?: string; 'aria-label'?: string };

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

  const childProps = children.props as LabelledChildProps;
  const resolvedLabel = label ?? childProps.ariaLabel ?? childProps['aria-label'];

  return cloneElement(children, {
    ref: useMergedRefs(triggerRef, children.props.ref),
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(e);
      handleClick();
    },
    'aria-haspopup': true,
    'aria-expanded': isActive,
    // 값이 있을 때만 넘긴다. undefined 를 명시적으로 넘기면 자식이 이미 설정한 값을 덮어쓴다.
    ...(resolvedLabel ? { 'aria-label': resolvedLabel } : {}),
  } as Partial<ButtonLikeProps>);
};
export default PopoverTrigger;
