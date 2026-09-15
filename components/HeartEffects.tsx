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

interface TrailHeart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  rotSpeed: number;
  life: number;
  maxLife: number;
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

const HEART_SVG_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export default function HeartEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // -------------------------------------------------------------
  // 1. High-Performance Canvas Cursor Trail Engine
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const trailHearts: TrailHeart[] = [];
    const heartPath = typeof Path2D !== 'undefined' ? new Path2D(HEART_SVG_PATH) : null;

    let lastX = -100;
    let lastY = -100;
    let lastSpawnTime = 0;
    let animId = 0;

    const spawnTrailHeart = (x: number, y: number) => {
      const size = Math.floor(Math.random() * 8) + 12; // 12px to 20px
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const maxLife = 0.85 + Math.random() * 0.45; // ~0.85s to 1.3s

      trailHearts.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -0.8 - Math.random() * 1.2, // Floats upward
        size,
        color,
        rot: (Math.random() - 0.5) * 0.8,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        life: maxLife,
        maxLife,
      });

      // Keep array bounded
      if (trailHearts.length > 80) {
        trailHearts.shift();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn when mouse moves at least 14px or 32ms has passed
      if (dist > 14 || (dist > 4 && now - lastSpawnTime > 32)) {
        spawnTrailHeart(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        lastSpawnTime = now;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Animation Loop
    let lastFrameTime = performance.now();
    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      const dt = Math.min((time - lastFrameTime) / 1000, 0.1);
      lastFrameTime = time;

      if (trailHearts.length === 0) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = trailHearts.length - 1; i >= 0; i--) {
        const h = trailHearts[i];
        h.life -= dt;

        if (h.life <= 0) {
          trailHearts.splice(i, 1);
          continue;
        }

        h.x += h.vx;
        h.y += h.vy;
        h.rot += h.rotSpeed;

        const progress = h.life / h.maxLife; // 1 -> 0
        const alpha = Math.min(1, progress * 1.3);
        const currentScale = (h.size / 24) * (0.6 + 0.5 * Math.sin(progress * Math.PI));

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rot);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-12, -12); // Center of 24x24 SVG path

        ctx.globalAlpha = alpha;
        ctx.fillStyle = h.color;
        ctx.shadowColor = h.color;
        ctx.shadowBlur = 6;

        if (heartPath) {
          ctx.fill(heartPath);
        } else {
          // Fallback bezier curve if Path2D is unavailable
          ctx.beginPath();
          ctx.moveTo(12, 21.35);
          ctx.bezierCurveTo(2, 12.28, 2, 8.5, 7.5, 3);
          ctx.bezierCurveTo(11, 3, 12, 5.5, 12, 5.5);
          ctx.bezierCurveTo(12, 5.5, 13, 3, 16.5, 3);
          ctx.bezierCurveTo(22, 8.5, 22, 12.28, 12, 21.35);
          ctx.fill();
        }

        ctx.restore();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // -------------------------------------------------------------
  // 2. Click / Tap Heart Bursts
  // -------------------------------------------------------------
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

    setTimeout(() => {
      const idsToRemove = new Set(newHearts.map((h) => h.id));
      setBurstHearts((prev) => prev.filter((h) => !idsToRemove.has(h.id)));
    }, 1700);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.charminar-3d-canvas-box') || target?.closest('.charminar-3d-controls')) {
        return;
      }
      spawnHeartsAt(e.clientX, e.clientY, 3, false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [spawnHeartsAt]);

  // -------------------------------------------------------------
  // 3. Floating "Send Love" Action Button Handler
  // -------------------------------------------------------------
  const handleSendLove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    spawnHeartsAt(spawnX, spawnY, 14, true);

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const randomX = Math.random() * window.innerWidth;
        spawnHeartsAt(randomX, window.innerHeight - 30, 2, true);
      }, i * 90);
    }

    const nextCount = loveCount + 1;
    setLoveCount(nextCount);
    try {
      localStorage.setItem('adya_love_count', String(nextCount));
    } catch {
      // ignore
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([25, 30, 25]);
    }

    const msg = LOVE_MESSAGES[nextCount % LOVE_MESSAGES.length];
    setToastMessage(msg);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <>
      {/* 60fps Canvas Cursor Trail Effect */}
      <canvas
        ref={canvasRef}
        className="cursor-trail-canvas"
        aria-hidden="true"
      />

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

      {/* Subtle Ambient Background Drifting Hearts */}
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
