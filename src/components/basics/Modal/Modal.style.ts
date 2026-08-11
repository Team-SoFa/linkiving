// Modal.style.ts
import { tv } from 'tailwind-variants';

export const modalOverlayStyle = tv({
  base: 'fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] max-md:items-end',
});

export const modalContentStyle = tv({
  // 짧은 모바일 화면에서 긴 본문이 잘리지 않도록 최대 높이 + 자체 스크롤
  base: 'bg-gray50 custom-scrollbar max-md:modal-slide-up relative h-auto max-h-[85dvh] w-auto overflow-y-auto overscroll-contain rounded-2xl shadow-lg max-md:m-0! max-md:w-full! max-md:max-w-none! max-md:min-w-0! max-md:rounded-b-none!',
});

export const modalHeaderStyle = tv({
  base: 'flex w-full items-center justify-end px-3 py-3',
});

export const modalBodyStyle = tv({
  base: '',
});
