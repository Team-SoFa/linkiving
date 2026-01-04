'use client';

import { useInterval } from '@reactuses/core';
import { useEffect, useState } from 'react';

import { useGreeting } from './utils/useGreeting';

interface GreetingBlockProps {
  context?: string;
  typingSpeed?: number; // 기본값 30
}

const GreetingBlock = ({ context, typingSpeed = 30 }: GreetingBlockProps) => {
  const fullText = useGreeting(context);
  const [displayText, setDisplayText] = useState('');

  const { resume: startTyping, pause: stopTyping } = useInterval(
    () => {
      setDisplayText(prev => {
        if (prev.length >= fullText.length) {
          stopTyping();
          return prev;
        }
        return prev + fullText.charAt(prev.length);
      });
    },
    typingSpeed,
    { controls: true }
  );

  useEffect(() => {
    setDisplayText('');
    stopTyping();

    if (!fullText) return;
    startTyping();

    return stopTyping;
  }, [fullText, startTyping, stopTyping, typingSpeed]);

  return (
    <div className="flex gap-1 px-4 text-[40px] font-semibold whitespace-pre-wrap lg:text-[52px]">
      {displayText}
      <span className="cursor-blink">|</span>
    </div>
  );
};

export default GreetingBlock;
