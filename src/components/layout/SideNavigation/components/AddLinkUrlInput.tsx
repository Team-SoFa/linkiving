'use client';

import IconButton from '@/components/basics/IconButton/IconButton';
import TextArea, { type TextAreaProps } from '@/components/basics/TextArea/TextArea';
import Tooltip from '@/components/basics/Tooltip/Tooltip';
import { showToast } from '@/stores/toastStore';
import clsx from 'clsx';
import React from 'react';

interface AddLinkUrlInputProps extends Omit<
  TextAreaProps,
  | 'value'
  | 'onChange'
  | 'heightLines'
  | 'maxHeightLines'
  | 'radius'
  | 'color'
  | 'textSize'
  | 'setBottomPlace'
> {
  value: string;
  errorMessage?: string;
  onChange: (value: string) => void;
}

const AddLinkUrlInput = React.forwardRef<HTMLTextAreaElement, AddLinkUrlInputProps>(
  (
    {
      value,
      errorMessage,
      onChange,
      placeholder = 'URL 주소를 입력해주세요.',
      id,
      name,
      onBlur,
      autoComplete = 'url',
      inputMode = 'url',
      ...rest
    },
    ref
  ) => {
    const trimmedValue = value.trim();
    const hasError = Boolean(errorMessage);
    const inputId = id ?? name ?? 'add-link-url-input';
    const errorId = hasError ? `${inputId}-error` : undefined;

    const handleCopyClick = () => {
      if (!trimmedValue) return;
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(trimmedValue);
        showToast({
          message: '링크가 클립보드에 복사되었습니다.',
          variant: 'success',
          showIcon: true,
        });
      }
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          <TextArea
            ref={ref}
            id={inputId}
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={hasError}
            aria-describedby={errorId}
            radius="lg"
            heightLines={1}
            maxHeightLines={1}
            textSize="md"
            className={clsx(
              'pr-11',
              hasError
                ? 'border-red500 focus-within:border-red500 focus-within:ring-red200 bg-white focus-within:ring-1'
                : 'border-gray200 hover:border-gray300 focus-within:border-blue400 focus-within:ring-blue200 bg-white focus-within:ring-1'
            )}
            onKeyDown={handleKeyDown}
            {...rest}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <Tooltip content="URL 복사하기" side="bottom">
              <IconButton
                icon="IC_Copy"
                size="sm"
                variant="tertiary_subtle"
                contextStyle="onMain"
                ariaLabel="URL 복사하기"
                disabled={!trimmedValue}
                className="pointer-events-auto"
                onClick={handleCopyClick}
              />
            </Tooltip>
          </div>
        </div>
        {hasError && (
          <span id={errorId} className="text-red500 text-xs">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

AddLinkUrlInput.displayName = 'AddLinkUrlInput';
export default AddLinkUrlInput;
