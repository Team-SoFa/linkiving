// Modal.style.ts
import { tv } from 'tailwind-variants';

export const modalOverlayStyle = tv({
  base: 'fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] max-md:items-end',
});

export const modalContentStyle = tv({
  base: 'bg-gray50 max-md:modal-slide-up relative h-auto w-auto rounded-2xl shadow-lg max-md:m-0! max-md:w-full! max-md:max-w-none! max-md:min-w-0! max-md:rounded-b-none!',
});

export const modalHeaderStyle = tv({
  base: 'flex w-full items-center justify-end px-3 py-3',
});

export const modalBodyStyle = tv({
  base: '',
});
