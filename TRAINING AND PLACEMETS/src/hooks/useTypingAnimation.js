import { useState, useEffect } from 'react';

function useTypingAnimation(text, typingSpeed = 150, pauseDuration = 3000) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    let timeoutId;

    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(type, typingSpeed);
      } else {
        setIsTyping(false);
        timeoutId = setTimeout(reset, pauseDuration);
      }
    };

    const reset = () => {
      setDisplayedText('');
      index = 0;
      setIsTyping(true);
      timeoutId = setTimeout(type, typingSpeed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [text, typingSpeed, pauseDuration]);

  return { displayedText, isTyping };
}

export default useTypingAnimation;