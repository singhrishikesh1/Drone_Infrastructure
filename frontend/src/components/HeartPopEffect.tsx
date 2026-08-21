import React, { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export const HeartPopEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Trigger whenever user clicks any button, link, tab, or interactive element
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, select, input, [role="button"], .interactive-click');

      if (isInteractive || target?.tagName === 'BUTTON' || target?.tagName === 'A') {
        const emojis = ['❤️', '💖', '💕', '💗', '❤️‍🔥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const newHeart: HeartParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          emoji: randomEmoji,
        };

        setHearts((prev) => [...prev.slice(-15), newHeart]);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleAnimationEnd = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <>
      {children}
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="animate-heart-pop select-none pointer-events-none"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
          }}
          onAnimationEnd={() => handleAnimationEnd(heart.id)}
        >
          {heart.emoji}
        </span>
      ))}
    </>
  );
};
