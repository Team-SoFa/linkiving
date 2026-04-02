'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Spinner from '../Spinner/Spinner';
import { styles } from './InfiniteScroll.style';

const { root: rootCls, statusRow, loader: loaderCls, end, error } = styles();

const DEFAULT_COLUMNS = { mobile: 2, desktop: 4 };
const ROW_ASPECT_RATIO = 1.3; // Estimated aspect ratio for a row of cards (58/47)

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
  columns?: {
    mobile?: number;
    desktop?: number;
  };
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
  const [currentColumns, setCurrentColumns] = useState(columns.mobile || 2);
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

  // Update columns based on container width
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);

      const newCols = width >= 768 ? columns.desktop || 4 : columns.mobile || 2;
      setCurrentColumns(prev => (prev === newCols ? prev : newCols));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [columns.desktop, columns.mobile]);

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

    const effectiveWidth = containerWidth - 32;
    const itemWidth = (effectiveWidth - (currentColumns - 1) * 16) / currentColumns;

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
        'scrollbar-hide relative h-full w-full overflow-y-auto contain-strict',
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
                columnGap: '16px', // gap-x-4
                paddingLeft: '1rem',
                paddingRight: '1rem',
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

      {/* Status Indicators at the bottom of the scroll content */}
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
    </div>
  );
}

// Fixed forwardRef with Generic support
export const InfiniteScroll = React.forwardRef(InfiniteScrollInner) as <T>(
  props: InfiniteScrollProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export default InfiniteScroll;
