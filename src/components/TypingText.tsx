import React, { useState, useEffect } from 'react';

export const TypingText = ({ text, className, speed = 50 }: { text: string, className?: string, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{displayedText}</span>;
};
