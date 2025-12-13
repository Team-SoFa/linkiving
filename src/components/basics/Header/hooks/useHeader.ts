'use client';

import { useDisclosure, useWindowScroll } from '@reactuses/core';

const SCROLL_ELEVATION = 8;

export const useHeader = () => {
  const { y } = useWindowScroll();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure({ defaultOpen: false });

  return {
    isElevated: y > SCROLL_ELEVATION,
    isMenuOpen: isOpen,
    openMenu: onOpen,
    closeMenu: onClose,
    toggleMenu: onOpenChange,
  };
};

export default useHeader;
