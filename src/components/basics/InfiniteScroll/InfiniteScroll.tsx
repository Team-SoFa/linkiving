'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import Spinner from '../Spinner/Spinner';

export type ColumnConfig = {
  /** < 768px */
  base?: number;
  /** >= 768px (Tailwind md) */
  md?: number;
  /** >= 1024px (Tailwind lg) */
  lg?: number;
};

const DEFAULT_COLUMNS: ColumnConfig = { base: 2, md: 3, lg: 4 };
const ROW_ASPECT_RATIO = 232 / 182; // LinkCard 실제 비율 (aspect-[182/232])
const GRID_PADDING_X = 8; // 그리드 좌우 px-1 = 4 + 4
const COLUMN_GAP = 16;

/**
 * 뷰포트 기준 컬럼 수.
 * 컨테이너 폭으로 나누면 좌우 여백만큼 항상 작게 잡혀 Tailwind 브레이크포인트와
 * 어긋나므로(390px 화면에서 컨테이너는 약 270px) matchMedia로 뷰포트를 직접 본다.
 */
function useResponsiveColumns({ base = 2, md = 3, lg = 4 }: ColumnConfig) {
  const [currentColumns, setCurrentColumns] = useState(base);

  useLayoutEffect(() => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const mdQuery = window.matchMedia('(min-width: 768px)');

    const resolve = () => {
      const next = lgQuery.matches ? lg : mdQuery.matches ? md : base;
      setCurrentColumns(prev => (prev === next ? prev : next));
    };

    resolve();
    lgQuery.addEventListener('change', resolve);
    mdQuery.addEventListener('change', resolve);

    return () => {
      lgQuery.removeEventListener('change', resolve);
      mdQuery.removeEventListener('change', resolve);
    };
  }, [base, md, lg]);

  return currentColumns;
}

export type InfiniteScrollProps<T> = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  items: T[];
  getKey?: (item: T, index: number) => React.Key;
  renderItem: (item: T, index: number) => React.ReactNode;
  onLoadMore: (signal?: AbortSignal) => Promise<void>;
  hasMore: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  errorSlot?: (msg: string) => React.ReactNode;
  rowGap?: number;
  columns?: ColumnConfig;
};

function InfiniteScrollInner<T>(
  {
    items,
    getKey,
    renderItem,
    className,
    onLoadMore,
    hasMore,
    isLoading = false,
    errorMessage = null,
    loader,
    endMessage,
    errorSlot,
    rowGap = 16,
    columns = DEFAULT_COLUMNS,
    ...rest
  }: InfiniteScrollProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentColumns = useResponsiveColumns(columns);
  const [containerWidth, setContainerWidth] = useState(0);
  const isFetchingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const safeLoadMore = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await onLoadMore(controller.signal);
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') {
        throw e;
      }
    }
  }, [onLoadMore]);

  // Sync internal ref with forwarded ref
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      scrollContainerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  // 행 높이 추정에 쓸 컨테이너 폭만 측정한다 (컬럼 수는 뷰포트 기준으로 따로 계산).
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      setContainerWidth(prev => (prev === width ? prev : width));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Group items into rows for grid virtualization
  const rows = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += currentColumns) {
      result.push(items.slice(i, i + currentColumns));
    }
    return result;
  }, [items, currentColumns]);

  const estimateRowSize = useCallback(() => {
    if (!containerWidth) return 300; // 초기 안전값

    const effectiveWidth = containerWidth - GRID_PADDING_X;
    const itemWidth = (effectiveWidth - (currentColumns - 1) * COLUMN_GAP) / currentColumns;

    return itemWidth * ROW_ASPECT_RATIO + rowGap;
  }, [containerWidth, currentColumns, rowGap]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: estimateRowSize,
    overscan: 5,
  });

  // resize 시 virtualizer 강제 재계산
  useEffect(() => {
    rowVirtualizer.measure();
  }, [containerWidth, currentColumns, rowVirtualizer]);

  const virtualRows = rowVirtualizer.getVirtualItems();

  // Load more logic with guard flags to prevent double-fetching
  useEffect(() => {
    const lastItem = virtualRows[virtualRows.length - 1];
    if (!lastItem) return;

    // Trigger when the user is within 2 rows of the bottom
    const isNearBottom = lastItem.index >= rows.length - 2;

    if (isNearBottom && hasMore && !isLoading && !errorMessage && !isFetchingRef.current) {
      isFetchingRef.current = true;
      safeLoadMore().finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [virtualRows, rows.length, hasMore, isLoading, errorMessage, safeLoadMore]);

  return (
    <div
      ref={setRefs}
      className={clsx(
        'relative h-full w-full overflow-x-hidden overflow-y-auto contain-strict',
        className
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
      {...rest}
    >
      {/* Total height pusher to enable scrolling */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map(virtualRow => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
              paddingBottom: `${rowGap}px`,
            }}
          >
            <div
              className="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`,
                columnGap: `${COLUMN_GAP}px`,
                paddingLeft: `${GRID_PADDING_X / 2}px`, // px-1
                paddingRight: `${GRID_PADDING_X / 2}px`,
              }}
            >
              {rows[virtualRow.index]?.map((item, colIndex) => {
                const index = virtualRow.index * currentColumns + colIndex;

                return (
                  <div key={getKey ? getKey(item, index) : index} className="w-full">
                    {renderItem(item, index)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/*
       * Status Indicators at the bottom of the scroll content.
       * 표시할 내용이 있을 때만 렌더한다 — 무조건 렌더하면 min-h-20 + p-6 만큼(약 104px)
       * 리스트 아래에 빈 블록이 항상 남는다.
       */}
      {(isLoading || errorMessage || (!hasMore && items.length > 0)) && (
        <div className="flex min-h-20 w-full flex-col items-center justify-center p-6">
          {isLoading && (loader || <Spinner />)}

          {!hasMore && items.length > 0 && (
            <div className="text-sm text-gray-400 italic">
              {endMessage || '모든 콘텐츠를 불러왔습니다.'}
            </div>
          )}

          {errorMessage &&
            (errorSlot ? (
              errorSlot(errorMessage)
            ) : (
              <div className="text-sm font-medium text-red-500">{errorMessage}</div>
            ))}
        </div>
      )}
    </div>
  );
}

// Fixed forwardRef with Generic support
export const InfiniteScroll = React.forwardRef(InfiniteScrollInner) as <T>(
  props: InfiniteScrollProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export default InfiniteScroll;
