'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { type Media, story } from '@/content/story';
import { Arrow } from './Shared';

interface HeroVideoProps {
  heroImg?: Media;
}

export default function HeroVideo({ heroImg }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);

  // Canvas-based cinematic ambient rail particles & passing station lights
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles representing distant platform lights, golden sparks, and night atmosphere
    const bokehLights = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      radius: Math.random() * 4 + 1.5,
      speed: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.45 + 0.15,
      color: Math.random() > 0.4 ? 'rgba(201, 154, 85, ' : 'rgba(244, 239, 229, ',
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle horizontal light trails of distant train station lights
      bokehLights.forEach((p) => {
        p.x -= p.speed;
        if (p.x < -20) {
          p.x = width + 20;
          p.y = Math.random() * height * 0.85;
        }

        const pulse = Math.sin(t + p.phase) * 0.2 + 0.8;
        const currentAlpha = p.alpha * pulse;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
        grad.addColorStop(0, `${p.color}${currentAlpha})`);
        grad.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="scene hero-scene-cinematic" id="hero">
      {/* Background Video & Fallback Frame */}
      <div className="hero-viewport-frame">
        {/* Video Player */}
        {videoAvailable && (
          <video
            ref={videoRef}
            className={`hero-bg-video ${videoLoaded ? 'is-playing' : ''}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => {
              setVideoAvailable(false);
              setVideoLoaded(false);
            }}
          >
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Fallback & Layered Hero Image */}
        {heroImg && (
          <div className={`hero-fallback-wrapper ${videoLoaded ? 'video-active' : 'image-active'}`}>
            <Image
              src={heroImg.file}
              alt={heroImg.alt}
              fill
              priority
              placeholder="blur"
              blurDataURL={heroImg.blurDataURL}
              sizes="100vw"
              className="hero-poster-image"
              style={{ objectPosition: '32% 32%' }}
            />
          </div>
        )}

        {/* Cinematic Ambient Atmosphere Canvas (Dust motes & passing railway lights) */}
        <canvas ref={canvasRef} className="hero-ambient-canvas" aria-hidden="true" />

        {/* Multi-layered Vignette and Film Atmosphere Scrim */}
        <div className="hero-cinematic-scrim" aria-hidden="true" />
        <div className="hero-film-grain" aria-hidden="true" />
        <div className="hero-warm-glow" aria-hidden="true" />
      </div>

      {/* Main Editorial Content Container (Docked to Right Side) */}
      <div className="hero-inner-container">
        <div className="hero-card-editorial">
          {/* Station & Journey Metadata Pill */}
          <div className="hero-meta-strip arrive-1">
            <div className="train-beacon">
              <span className="beacon-dot" />
              <span className="beacon-pulse" />
            </div>
            <span className="meta-code">TRAIN {story.train.number}</span>
            <span className="meta-sep">/</span>
            <span className="meta-route">{story.origin} ➔ {story.destination}</span>
            <span className="meta-sep">/</span>
            <span className="meta-time">{story.train.departure} · 04:07 AM</span>
          </div>

          <div className="hero-badge hero-love-badge arrive-1">
            <span className="badge-heart">💖</span>
            <span>A LOVE STORY ACROSS 1,200 KM</span>
            <span className="badge-ribbon-icon">🎀</span>
          </div>

          <p className="hero-pretitle arrive-2">Not every gift begins in a store.</p>

          <h1 className="hero-title arrive-3">
            Some begin with <em className="gold-shimmer">a journey.</em>
          </h1>

          <p className="hero-dedication arrive-4">
            For <span className="dedication-name">{story.herName}</span> <span className="dedication-heart">❤️</span>
          </p>

          <div className="hero-footer-row arrive-4">
            <a href="#departure" className="hero-scroll-btn" aria-label="Begin the journey">
              <span className="btn-ring">
                <Arrow />
              </span>
              <span className="btn-text">Begin the journey</span>
            </a>

            <div className="hero-stats-pill">
              <span className="stats-dot" />
              <span>22+ Hours Rail Travel · Coimbatore to Hyderabad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Subtle Corner Coordinates */}
      <div className="hero-corner-coords arrive-4" aria-hidden="true">
        <span>11.0168° N, 76.9558° E</span>
        <span className="coord-divider">·</span>
        <span>EXP 07098 COIMBATORE JN</span>
      </div>
    </section>
  );
}
