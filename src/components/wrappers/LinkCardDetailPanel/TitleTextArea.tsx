'use client';

import TextArea from '@/components/basics/TextArea/TextArea';
import type { TextAreaProps } from '@/components/basics/TextArea/TextArea';
import React from 'react';

type TitleTextAreaProps = Omit<TextAreaProps, 'heightLines' | 'maxHeightLines'>;

const TitleTextArea = React.forwardRef<HTMLTextAreaElement, TitleTextAreaProps>(
  ({ maxLength = 100, ...rest }, ref) => {
    return (
      <TextArea ref={ref} heightLines={2} maxHeightLines={3} maxLength={maxLength} {...rest} />
    );
  }
);

export default TitleTextArea;
