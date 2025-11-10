'use client';

import clsx from 'clsx';
import React, { useEffect, useMemo, useRef } from 'react';

import { styles } from './InfiniteScroll.style';

export type InfiniteScrollProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** 로딩 대상 리스트/컨텐츠 */
  children?: React.ReactNode;
  /** 추가 데이터를 로드하는 콜백 (Promise 지원) */
  onLoadMore: () => void | Promise<void>;
  /** 더 불러올 수 있는지 여부 */
  hasMore: boolean;
  /** 현재 로딩 중인지 여부 (중복 트리거 방지용) */
  isLoading?: boolean;
  /** 에러 메시지 (있으면 에러 뷰 노출) */
  errorMessage?: string | null;
  /** 뷰포트 대신 특정 스크롤 컨테이너를 root로 사용하고 싶을 때 */
  root?: Element | null;
  /** IntersectionObserver 옵션 */
  rootMargin?: string; // e.g., '0px 0px 400px 0px' (아래 여유)
  threshold?: number | number[];
  /** sentinel 요소를 관찰할지 여부 (특정 상황에서 일시 중단할 때 사용) */
  observe?: boolean;
  /** 커스텀 로더/끝/에러 컴포넌트 */
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  errorSlot?: (msg: string) => React.ReactNode;
};

// styles moved to `InfiniteScroll.style.ts`

const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(
  function InfiniteScroll(
    {
      children,
      className,
      onLoadMore,
      hasMore,
      isLoading = false,
      errorMessage = null,
      root = null,
      rootMargin = '0px 0px 300px 0px',
      threshold = 0,
      observe = true,
      loader,
      endMessage,
      errorSlot,
      ...rest
    },
    ref
  ) {
    const { root: rootCls, list, statusRow, loader: loaderCls, end, error, sentinel } = styles();
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef<boolean>(false);

    useEffect(() => {
      loadingRef.current = isLoading;
    }, [isLoading]);

    const canLoad = useMemo(
      () => hasMore && !isLoading && !errorMessage,
      [hasMore, isLoading, errorMessage]
    );

    useEffect(() => {
      if (!observe) return;

      const target = sentinelRef.current;
      if (!target) return;

      const io = new IntersectionObserver(
        async entries => {
          const entry = entries[0];
          if (!entry.isIntersecting) return;
          if (!canLoad) return;
          if (loadingRef.current) return;

          try {
            loadingRef.current = true;
            await onLoadMore();
          } finally {
            loadingRef.current = false;
          }
        },
        { root, rootMargin, threshold }
      );

      io.observe(target);
      return () => io.disconnect();
    }, [root, rootMargin, threshold, onLoadMore, canLoad, observe]);

    const classes = {
      root: clsx(className, rootCls()),
      list: clsx(list()),
      statusRow: clsx(statusRow(), 'infinite-status'),
      loader: clsx(statusRow(), loaderCls(), 'infinite-loader'),
      end: clsx(statusRow(), end(), 'infinite-end'),
      error: clsx(statusRow(), error(), 'infinite-error'),
      sentinel: clsx(sentinel(), 'infinite-sentinel'),
    };

    return (
      <div ref={ref} className={classes.root} {...rest}>
        <div className={classes.list}>{children}</div>

        {errorMessage && (
          <div className={classes.error} role="status" aria-live="polite">
            {errorSlot ? errorSlot(errorMessage) : <span>{errorMessage}</span>}
          </div>
        )}

        {isLoading && (
          <div className={classes.loader} role="status" aria-live="polite">
            {loader ?? (
              <>
                <span className="infinite-spinner mr-2" aria-hidden="true" />
                <span>로딩 중…</span>
              </>
            )}
          </div>
        )}

        {!hasMore && !isLoading && !errorMessage && (
          <div className={classes.end} role="status" aria-live="polite">
            {endMessage ?? <span>마지막입니다</span>}
          </div>
        )}

        {hasMore && (
          <div ref={sentinelRef} className={classes.sentinel} data-testid="infinite-sentinel" />
        )}
      </div>
    );
  }
);

export default InfiniteScroll;
