'use client';

import { useEffect, useState } from 'react';

import { useGreeting } from './utils/useGreeting';

interface GreetingBlockProps {
  context?: string;
  typingSpeed?: number; // 기본값 30
}

const GreetingBlock = ({ context, typingSpeed = 30 }: GreetingBlockProps) => {
  const fullText = useGreeting(context);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');

    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => prev + fullText.charAt(index));
      index++;

      if (index >= fullText.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [fullText, typingSpeed]);

  return (
    <div className="font-body-lg flex gap-1 whitespace-pre-wrap">
      {displayText}
      <span className="cursor-blink">|</span>
    </div>
  );
};

export default GreetingBlock;
