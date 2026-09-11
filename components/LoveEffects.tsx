'use client';

import { useEffect, useState, useCallback } from 'react';

interface HeartBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rot: number;
  opacity: number;
  symbol: string;
}

const HEART_SYMBOLS = ['❤️', '💖', '💕', '✨', '🌹', '🤍', '❦'];
const ROMANTIC_COLORS = ['#ff4d6d', '#ff758f', '#c99a55', '#ff85a1', '#e05780', '#ffd6a5'];

export default function LoveEffects() {
  const [hearts, setHearts] = useState<HeartBubble[]>([]);
  const [loveCount, setLoveCount] = useState(0);

  // Spawn hearts at specific coordinate (click/tap)
  const spawnHeartsAt = useCallback((clientX: number, clientY: number, count = 5) => {
    const newHearts: HeartBubble[] = [];
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: Math.random() + Date.now(),
        x: clientX + (Math.random() - 0.5) * 40,
        y: clientY + (Math.random() - 0.5) * 20,
        size: Math.floor(Math.random() * 16) + 16,
        color: ROMANTIC_COLORS[Math.floor(Math.random() * ROMANTIC_COLORS.length)],
        speedY: Math.random() * 2.8 + 2.2,
        speedX: (Math.random() - 0.5) * 2.4,
        rot: (Math.random() - 0.5) * 45,
        opacity: 1,
        symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      });
    }
    setHearts((prev) => [...prev.slice(-35), ...newHearts]);
  }, []);

  // Global click listener to sprout romantic hearts wherever the user clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't spawn if clicking video controls or specific interactive elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'VIDEO' || target.closest('button') || target.closest('a')) {
        // Still spawn a smaller celebratory burst!
        spawnHeartsAt(e.clientX, e.clientY, 3);
        return;
      }
      spawnHeartsAt(e.clientX, e.clientY, 5);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [spawnHeartsAt]);

  // Animation frame loop to move and fade hearts
  useEffect(() => {
    if (hearts.length === 0) return;

    const interval = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((h) => ({
            ...h,
            y: h.y - h.speedY,
            x: h.x + Math.sin(h.y * 0.05) * h.speedX,
            opacity: h.opacity - 0.024,
            rot: h.rot + 0.8,
          }))
          .filter((h) => h.opacity > 0)
      );
    }, 24);

    return () => clearInterval(interval);
  }, [hearts.length]);

  // Big romantic love shower trigger
  const triggerLoveShower = () => {
    setLoveCount((c) => c + 1);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const shower: HeartBubble[] = [];

    for (let i = 0; i < 28; i++) {
      shower.push({
        id: Math.random() + Date.now() + i,
        x: Math.random() * width,
        y: height - Math.random() * 120,
        size: Math.floor(Math.random() * 22) + 18,
        color: ROMANTIC_COLORS[Math.floor(Math.random() * ROMANTIC_COLORS.length)],
        speedY: Math.random() * 3.5 + 2.5,
        speedX: (Math.random() - 0.5) * 3,
        rot: (Math.random() - 0.5) * 60,
        opacity: 1,
        symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      });
    }

    setHearts((prev) => [...prev, ...shower]);
  };

  return (
    <>
      {/* Floating Hearts Overlay */}
      <div className="love-floating-container" aria-hidden="true">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="floating-love-heart"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: `${h.size}px`,
              opacity: h.opacity,
              transform: `rotate(${h.rot}deg)`,
              color: h.color,
            }}
          >
            {h.symbol}
          </span>
        ))}
      </div>

      {/* Floating Romantic Love Button */}
      <div className="love-shower-widget">
        <button
          type="button"
          className="love-shower-btn"
          onClick={triggerLoveShower}
          aria-label="Send hearts and love to Adya"
          title="Send a shower of love!"
        >
          <span className="love-btn-beating-heart" aria-hidden="true">
            💖
          </span>
          <span className="love-btn-text">
            {loveCount > 0 ? `Sent with Love (${loveCount})` : 'Send Love to Adya'}
          </span>
          <span className="love-sparkle-pill">✦</span>
        </button>
      </div>
    </>
  );
}
