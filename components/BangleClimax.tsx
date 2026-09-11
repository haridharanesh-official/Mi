'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { type Media, story } from '@/content/story';
import { Reveal } from './Shared';

interface BangleClimaxProps {
  banglePrimary?: Media;
  bangleDetail?: Media;
}

export default function BangleClimax({
  banglePrimary,
  bangleDetail,
}: BangleClimaxProps) {
  const [activeVariant, setActiveVariant] = useState<'primary' | 'detail'>('primary');
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 40 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeMedia = activeVariant === 'primary' ? banglePrimary : bangleDetail;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  return (
    <section className="bangle-climax-elevated" id="bangle-climax">
      {/* Velvety Deep Ambient Backing */}
      <div className="bangle-ambient-veil" aria-hidden="true">
        {activeMedia && (
          <Image
            src={activeMedia.file}
            alt=""
            fill
            sizes="100vw"
            className="bangle-ambient-blur"
          />
        )}
        <div className="ambient-dark-scrim" />
      </div>

      <div className="bangle-elevated-layout">
        {/* Left / Top: Interactive Spotlight Jewel Showcase */}
        <div className="bangle-interactive-stage">
          <Reveal>
            <div
              ref={containerRef}
              className="jewel-display-card"
              onPointerMove={handlePointerMove}
            >
              {/* Dynamic Interactive Spotlight Shimmer */}
              <div
                className="jewel-spotlight-beam"
                style={{
                  background: `radial-gradient(circle 280px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(201, 154, 85, 0.38) 0%, rgba(201, 154, 85, 0.08) 50%, transparent 80%)`,
                }}
                aria-hidden="true"
              />

              {/* Photo Display Frame */}
              <div className="jewel-photo-inner">
                {activeMedia && (
                  <Image
                    key={activeMedia.file}
                    src={activeMedia.file}
                    alt={activeMedia.alt}
                    width={activeMedia.width}
                    height={activeMedia.height}
                    priority
                    placeholder="blur"
                    blurDataURL={activeMedia.blurDataURL}
                    sizes="(max-width: 768px) 92vw, 520px"
                    className="jewel-photo arrive-fade"
                  />
                )}
              </div>

              {/* Gold & Ruby Seal Ribbon Tag */}
              <div className="jewel-seal-tag">
                <span className="seal-heart">💖</span>
                <span className="seal-text">HANDPICKED WITH LOVE · LAAD BAZAAR, CHARMINAR</span>
                <span className="seal-heart">🎀</span>
              </div>

              {/* Frame Angle Switcher Buttons */}
              <div className="jewel-angle-selector">
                <button
                  type="button"
                  className={`selector-btn ${activeVariant === 'primary' ? 'is-active' : ''}`}
                  onClick={() => setActiveVariant('primary')}
                >
                  <span className="btn-dot" />
                  <span>Frame 01 · Held High at Charminar</span>
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeVariant === 'detail' ? 'is-active' : ''}`}
                  onClick={() => setActiveVariant('detail')}
                >
                  <span className="btn-dot" />
                  <span>Frame 02 · Intricate Lacquer Detail</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right / Bottom: Emotional Climax Narrative */}
        <div className="bangle-narrative-stage">
          <Reveal>
            <div className="chapter-eyebrow">
              <span className="num">06</span>
              <span className="sep">—</span>
              <span className="label">THE REVEAL</span>
            </div>

            <div className="climax-poetry-stack">
              <p className="poetic-step arrive-1">1,200 kilometres.</p>
              <p className="poetic-step arrive-2">22+ hours.</p>
              <p className="poetic-step arrive-3">One city.</p>
              <p className="poetic-step arrive-4">One search.</p>

              <h2 className="poetic-climax-headline">
                One Lac bangle.
                <br />
                For <em className="gold-shimmer">{story.herName}.</em> <span className="heart-inline-pulse">❤️</span>
              </h2>
            </div>

            <div className="climax-prose-card">
              <p className="prose-quote">
                The gift is small.
                <br />
                <strong>The journey behind it wasn’t.</strong>
              </p>
              <p className="prose-sub">
                Handpicked from the bustling century-old bangle bazaars behind Charminar.
                Carried back across states, through night trains and early mornings,
                so it arrives with a story of its own.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
