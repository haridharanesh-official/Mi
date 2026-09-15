'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  driftX: number;
  rotation: number;
  scale: number;
}

const HEART_COLORS = [
  '#FF4D6D', // Rose red
  '#E63946', // Vibrant crimson
  '#FF758F', // Coral pink
  '#C99A55', // Rich gold (matching theme)
  '#E6C587', // Champagne gold
  '#FFB3C1', // Soft blush
];

const LOVE_MESSAGES = [
  'Sent love to Adya ❤️',
  'Across 700 kilometers, straight to you 💕',
  'Every step was for this moment ✨',
  'To the one who makes everything brighter 💖',
  'Infinite love for Adya 💫',
  'A piece of my heart in Hyderabad 🏛️❤️',
  'Always, always for you 🌹',
  'You have all my heart ♥',
];

export default function HeartEffects() {
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);
  const [loveCount, setLoveCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextId = useRef(1);

  // Initialize love count from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adya_love_count');
      if (saved) setLoveCount(parseInt(saved, 10) || 0);
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Spawn hearts at given coordinate
  const spawnHeartsAt = useCallback((x: number, y: number, count = 4, isShower = false) => {
    const newHearts: BurstHeart[] = [];

    for (let i = 0; i < count; i++) {
      const id = nextId.current++;
      const size = isShower
        ? Math.floor(Math.random() * 16) + 16
        : Math.floor(Math.random() * 12) + 12;

      const driftX = (Math.random() - 0.5) * (isShower ? 200 : 80);
      const rotation = (Math.random() - 0.5) * 45;
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const scale = 0.8 + Math.random() * 0.6;

      newHearts.push({
        id,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size,
        color,
        driftX,
        rotation,
        scale,
      });
    }

    setBurstHearts((prev) => [...prev.slice(-40), ...newHearts]);

    // Automatically remove hearts after animation finishes (1.6s)
    setTimeout(() => {
      const idsToRemove = new Set(newHearts.map((h) => h.id));
      setBurstHearts((prev) => prev.filter((h) => !idsToRemove.has(h.id)));
    }, 1700);
  }, []);

  // Global click / tap listener
  useEffect(() => {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handlePointerDown = (e: PointerEvent) => {
      // Don't spawn tap hearts if clicking interactive 3D canvas or sliders to avoid clutter
      const target = e.target as HTMLElement | null;
      if (target?.closest('.charminar-3d-canvas-box') || target?.closest('.charminar-3d-controls')) {
        return;
      }

      spawnHeartsAt(e.clientX, e.clientY, 3, false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [spawnHeartsAt]);

  // Handle "Send Love" FAB Click
  const handleSendLove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    // Shower of floating hearts
    spawnHeartsAt(spawnX, spawnY, 14, true);

    // Also spawn a few across the bottom width of screen
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const randomX = Math.random() * window.innerWidth;
        spawnHeartsAt(randomX, window.innerHeight - 30, 2, true);
      }, i * 90);
    }

    // Update count
    const nextCount = loveCount + 1;
    setLoveCount(nextCount);
    try {
      localStorage.setItem('adya_love_count', String(nextCount));
    } catch {
      // ignore
    }

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([25, 30, 25]);
    }

    // Toast message
    const msg = LOVE_MESSAGES[nextCount % LOVE_MESSAGES.length];
    setToastMessage(msg);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <>
      {/* Dynamic Floating Hearts Container */}
      <div className="heart-burst-container" aria-hidden="true">
        {burstHearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-heart"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              fontSize: `${heart.size}px`,
              color: heart.color,
              // Custom CSS variables for keyframe motion
              ['--drift-x' as string]: `${heart.driftX}px`,
              ['--rot' as string]: `${heart.rotation}deg`,
              ['--scale' as string]: heart.scale,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Floating "Send Love" Widget (Bottom Left) */}
      <div className="floating-love-widget">
        {toastMessage && (
          <div className="love-toast-bubble" role="status">
            {toastMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleSendLove}
          className="love-fab-btn"
          aria-label={`Send love to Adya. Total hearts sent: ${loveCount}`}
          title="Send a heart to Adya"
        >
          <span className="love-fab-icon" aria-hidden="true">
            ♥
          </span>
          <span className="love-fab-text">Send Love</span>
          {loveCount > 0 && <span className="love-fab-badge">{loveCount}</span>}
        </button>
      </div>

      {/* Subtle Ambient Background Drifting Hearts (Gentle Atmosphere) */}
      <div className="ambient-hearts-layer" aria-hidden="true">
        <span className="ambient-heart h1">♥</span>
        <span className="ambient-heart h2">♥</span>
        <span className="ambient-heart h3">♥</span>
        <span className="ambient-heart h4">♥</span>
        <span className="ambient-heart h5">♥</span>
      </div>
    </>
  );
}
