'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { type Media } from '@/content/story';
import manifest from '@/content/media.json';

export const mediaManifest = manifest as Media[];

export function getImageMeta(fileOrSub: string): Media | undefined {
  return mediaManifest.find((m) => m.file.includes(fileOrSub));
}

export function Arrow() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden="true">
      <path d="M9 1v18m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Reveal({
  children,
  className = '',
  threshold = 0.15,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

export function CountUpNumber({
  target,
  duration = 1800,
}: {
  target: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) {
            frame = requestAnimationFrame(tick);
          }
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className="count-number">
      ~{value.toLocaleString('en-IN')}
    </span>
  );
}

export function Viewer({
  items,
  index,
  onClose,
  onChange,
}: {
  items: Media[];
  index: number;
  onClose: () => void;
  onChange: (n: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchStart = useRef(0);
  const item = items[index];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.showModal();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  function move(delta: number) {
    onChange((index + delta + items.length) % items.length);
  }

  return (
    <dialog
      ref={ref}
      className="viewer"
      onCancel={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') move(1);
        if (e.key === 'ArrowLeft') move(-1);
      }}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const diff = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(diff) > 45) {
          move(diff < 0 ? 1 : -1);
        }
      }}
    >
      <button className="close" onClick={onClose} aria-label="Close viewer">
        ×
      </button>
      <div className="viewer-media-wrap">
        <Image
          src={item.file}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="95vw"
          className="viewer-image"
          priority
        />
      </div>
      <div className="viewer-caption">
        <button onClick={() => move(-1)} aria-label="Previous image" className="viewer-nav-btn">
          ←
        </button>
        <div className="viewer-meta">
          <p className="viewer-title">{item.caption}</p>
          <small className="viewer-counter">
            {index + 1} / {items.length}
          </small>
        </div>
        <button onClick={() => move(1)} aria-label="Next image" className="viewer-nav-btn">
          →
        </button>
      </div>
    </dialog>
  );
}

export function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
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

    const colors = ['#C99A55', '#E6C587', '#F4EFE5', '#8B4438', '#FFFFFF'];
    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      alpha: number;
    }[] = [];

    for (let i = 0; i < 48; i++) {
      particles.push({
        x: Math.random() * width,
        y: -10 - Math.random() * height * 0.4,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 2 + 1.2,
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();

        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }
      });

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

export function Music() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState('');

  function toggle() {
    const a = ref.current;
    if (!a || !a.src) {
      setNote('Music track not configured.');
      setTimeout(() => setNote(''), 3000);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
          setNote('Audio playback could not start.');
          setTimeout(() => setNote(''), 3000);
        });
    }
  }

  return (
    <div className="music-player-widget">
      {note && <span className="music-note-toast">{note}</span>}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        className="music-toggle-btn"
        aria-label={playing ? 'Pause music' : 'Play ambient sound'}
      >
        <span className="music-icon" aria-hidden="true">
          ♫
        </span>
        <span className="music-label">{playing ? 'Pause' : 'Play song'}</span>
        <span className={`music-bars ${playing ? 'is-playing' : ''}`} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
      <audio ref={ref} loop preload="none" />
    </div>
  );
}

