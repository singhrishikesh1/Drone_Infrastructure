import React, { useEffect, useState } from 'react';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  emoji: string;
  size: number;
}

export const HeartPopEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    const emojis = ['❤️', '💖', '💕', '💗', '💓', '💞', '❤️‍🔥', '🌸'];

    const handlePointerDown = (e: MouseEvent) => {
      // Spawn 5 to 7 hearts bursting outwards around click location
      const count = 6;
      const newBurst: HeartParticle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
        const distance = 40 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30; // Float upwards
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        newBurst.push({
          id: Date.now() + Math.random() + i,
          x: e.clientX,
          y: e.clientY,
          tx,
          ty,
          emoji: randomEmoji,
          size: 20 + Math.floor(Math.random() * 16),
        });
      }

      setHearts((prev) => [...prev.slice(-30), ...newBurst]);
    };

    window.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
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
            fontSize: `${heart.size}px`,
            '--tx': `${heart.tx}px`,
            '--ty': `${heart.ty}px`,
          } as React.CSSProperties}
          onAnimationEnd={() => handleAnimationEnd(heart.id)}
        >
          {heart.emoji}
        </span>
      ))}
    </>
  );
};
