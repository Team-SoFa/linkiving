import { tv } from 'tailwind-variants';

export const tabStyle = tv({
  base: 'relative w-full',
});

export const tabDividerStyle = tv({
  base: 'absolute left-0 w-full -translate-y-[2px]',
});

export const contentStyle = tv({
  // 모바일에서는 페이지·말풍선 여백과 겹쳐 본문이 지나치게 좁아지므로 안쪽 여백을 없앤다.
  base: 'mt-6 px-0 sm:mt-8 sm:px-6',
});
