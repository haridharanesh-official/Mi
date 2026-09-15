'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Media } from '@/content/story';
import { Reveal, Viewer, getImageMeta } from './Shared';

export default function PhotoboothExperience() {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleLike = (file: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({ ...prev, [file]: (prev[file] || 0) + 1 }));
  };

  const photoList: { meta: Media; stamp: string; tilt: number }[] = [
    {
      meta: getImageMeta('IMG_20260904_040741')!,
      stamp: 'Station Platform · 04:07 AM',
      tilt: -2.5,
    },
    {
      meta: getImageMeta('IMG_20260904_040916')!,
      stamp: 'Doorway Portrait · 04:09 AM',
      tilt: 2.2,
    },
    {
      meta: getImageMeta('IMG_20260904_040921')!,
      stamp: 'Coach Steps · 04:09 AM',
      tilt: -1.8,
    },
    {
      meta: getImageMeta('IMG_20260904_041414')!,
      stamp: 'Coach Sign · 04:14 AM',
      tilt: 3.1,
    },
    {
      meta: getImageMeta('IMG_20260905_093814')!,
      stamp: 'Hyderabad Streets · 09:38 AM',
      tilt: -2.0,
    },
    {
      meta: getImageMeta('IMG_20260905_165459')!,
      stamp: 'Old City Bazaar · 04:54 PM',
      tilt: 1.5,
    },
    {
      meta: getImageMeta('IMG_20260905_165501')!,
      stamp: 'Charminar Minarets · 04:55 PM',
      tilt: -3.0,
    },
    {
      meta: getImageMeta('IMG_20260905_165509')!,
      stamp: 'Candid at Charminar · 04:55 PM',
      tilt: 2.0,
    },
    {
      meta: getImageMeta('IMG_20260905_165542')!,
      stamp: 'In the Market · 04:55 PM',
      tilt: -1.2,
    },
    {
      meta: getImageMeta('IMG_20260905_164223')!,
      stamp: 'Lac Bangle Climax · 04:42 PM',
      tilt: 2.8,
    },
    {
      meta: getImageMeta('IMG_20260905_164224_1')!,
      stamp: 'Detail Frame · 04:42 PM',
      tilt: -2.2,
    },
  ].filter((p) => Boolean(p.meta));

  const allMedia = photoList.map((p) => p.meta);

  // Filmstrip selection of sequential train frames
  const filmstripItems = [
    getImageMeta('IMG_20260904_040610'),
    getImageMeta('IMG_20260904_040741'),
    getImageMeta('IMG_20260904_040916'),
    getImageMeta('IMG_20260904_040921'),
    getImageMeta('IMG_20260904_041414'),
  ].filter(Boolean) as Media[];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>, defaultTilt: number) {
    const card = e.currentTarget;
    card.style.transform = `rotate(${defaultTilt}deg)`;
  }

  return (
    <main className="photobooth-root">
      {/* Top Header Navigation */}
      <div className="photobooth-top-nav">
        <Link href="/" className="back-journey-link">
          ← Back to the journey
        </Link>
        <Link href="/bloopers" className="switch-gallery-link">
          View Bloopers ↗
        </Link>
      </div>

      <header className="photobooth-header">
        <Reveal>
          <p className="chapter-eyebrow centered">
            <span className="num">GALLERY</span>
            <span className="sep">—</span>
            <span className="label">PHOTOBOOTH</span>
          </p>
          <h1 className="photobooth-title">
            Photo<em>booth.</em>
          </h1>
          <p className="photobooth-subtext">
            Some memories deserve their own wall.
          </p>
        </Reveal>
      </header>

      {/* Modern Polaroid Wall with interactive 3D tilt & rotation */}
      <section className="polaroid-wall-section">
        <div className="polaroid-wall-grid">
          {photoList.map((item, idx) => (
            <div
              key={item.meta.file}
              className="polaroid-card-wrap"
              style={{
                '--init-tilt': `${item.tilt}deg`,
              } as React.CSSProperties}
            >
              <Reveal>
                <div
                  className="polaroid-print"
                  style={{ transform: `rotate(${item.tilt}deg)` }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={(e) => handleMouseLeave(e, item.tilt)}
                  onClick={() => setViewerIndex(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open photo: ${item.meta.alt}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setViewerIndex(idx);
                    }
                  }}
                >
                  <div className="polaroid-pin" aria-hidden="true" />
                  <div className="polaroid-image-frame">
                    <Image
                      src={item.meta.file}
                      alt={item.meta.alt}
                      width={item.meta.width}
                      height={item.meta.height}
                      sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      placeholder="blur"
                      blurDataURL={item.meta.blurDataURL}
                      className="polaroid-photo"
                    />
                  </div>
                  <div className="polaroid-caption-area">
                    <div className="polaroid-caption-row">
                      <p className="polaroid-caption">{item.meta.caption}</p>
                      <button
                        type="button"
                        className={`polaroid-heart-btn ${(likes[item.meta.file] || 0) > 0 ? 'is-liked' : ''}`}
                        onClick={(e) => handleLike(item.meta.file, e)}
                        aria-label="Like this memory"
                        title="Love this photo"
                      >
                        <span className="heart-icon">♥</span>
                        {(likes[item.meta.file] || 0) > 0 && (
                          <span className="heart-count">{likes[item.meta.file]}</span>
                        )}
                      </button>
                    </div>
                    <span className="polaroid-stamp">{item.stamp}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Filmstrip Section: Sequential Train Frames */}
      <section className="filmstrip-section">
        <Reveal>
          <div className="filmstrip-header">
            <span className="filmstrip-tag">SEQUENCE REEL</span>
            <h2 className="filmstrip-title">Departure Strip · Tamil Nadu to Telangana</h2>
          </div>
        </Reveal>

        <div className="filmstrip-track-wrap">
          <div className="filmstrip-track">
            {filmstripItems.map((item, i) => (
              <div
                key={item.file}
                className="filmstrip-frame"
                onClick={() => {
                  const globalIdx = allMedia.findIndex((m) => m.file === item.file);
                  if (globalIdx !== -1) setViewerIndex(globalIdx);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Inspect frame ${i + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const globalIdx = allMedia.findIndex((m) => m.file === item.file);
                    if (globalIdx !== -1) setViewerIndex(globalIdx);
                  }
                }}
              >
                <div className="film-sprocket-top">
                  <span /><span /><span /><span /><span />
                </div>
                <div className="film-image-wrap">
                  <Image
                    src={item.file}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 600px) 65vw, 280px"
                    placeholder="blur"
                    blurDataURL={item.blurDataURL}
                    className="film-img"
                  />
                  <span className="film-frame-index">EXP 0{i + 1}</span>
                </div>
                <div className="film-sprocket-bottom">
                  <span /><span /><span /><span /><span />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Return Bar */}
      <div className="photobooth-footer">
        <Link href="/" className="return-cta">
          Return to Adya’s birthday story <span>↗</span>
        </Link>
      </div>

      {/* Fullscreen Modal Viewer */}
      {viewerIndex !== null && (
        <Viewer
          items={allMedia}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onChange={(newIndex) => setViewerIndex(newIndex)}
        />
      )}
    </main>
  );
}
