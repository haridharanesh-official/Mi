'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Media } from '@/content/story';
import { Reveal, Viewer, getImageMeta } from './Shared';

export default function BloopersExperience() {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Available candid / alternate frames from the trip
  const blooperItems: {
    meta: Media;
    tag: string;
    microcopy: string;
    storyNote: string;
  }[] = [
    {
      meta: getImageMeta('IMG_20260904_040916')!,
      tag: 'TAKE 1 · 04:09 AM',
      microcopy: 'Between the hero shots. Almost.',
      storyNote:
        'Trying to balance on the carriage steps while the wind decided my hair had other plans.',
    },
    {
      meta: getImageMeta('IMG_20260905_165509')!,
      tag: 'TAKE 2 · 04:55 PM',
      microcopy: 'Charminar was cooperating. I wasn’t.',
      storyNote:
        'Unprompted mid-laugh in the middle of a packed Old City bazaar. The camera clicked too early.',
    },
    {
      meta: getImageMeta('IMG_20260905_164224_1')!,
      tag: 'TAKE 3 · 04:42 PM',
      microcopy: 'Okay, one more.',
      storyNote:
        'Angle check number four. Trying to keep the bangles straight while auto rickshaws honked behind us.',
    },
  ].filter((b) => Boolean(b.meta));

  const allBlooperMedia = blooperItems.map((b) => b.meta);

  return (
    <main className="bloopers-root">
      {/* Top Header Navigation */}
      <div className="bloopers-top-nav">
        <Link href="/" className="back-journey-link">
          ← Back to the journey
        </Link>
        <Link href="/photobooth" className="switch-gallery-link">
          Photobooth ↗
        </Link>
      </div>

      <header className="bloopers-header">
        <Reveal>
          <p className="chapter-eyebrow centered">
            <span className="num">BEHIND THE SCENES</span>
            <span className="sep">—</span>
            <span className="label">THE OUTTAKES</span>
          </p>

          <div className="love-ribbon-eyebrow">
            <span className="ribbon-tail-left" />
            <span className="ribbon-text">🎀 OUR REAL, UNFILTERED MOMENTS · MADE WITH LOVE 💖</span>
            <span className="ribbon-tail-right" />
          </div>

          <h1 className="bloopers-title">
            The <em>Bloopers.</em>
          </h1>
          <p className="bloopers-subtext">
            Because the 1,200 km journey wasn’t cinematic every second.
          </p>
        </Reveal>
      </header>

      {/* Candid Frames Showcase */}
      <section className="bloopers-grid-section">
        <div className="bloopers-container">
          <div className="bloopers-cards-grid">
            {blooperItems.map((item, idx) => (
              <Reveal key={item.meta.file} className="blooper-card-wrap">
                <div
                  className="blooper-card"
                  onClick={() => setViewerIndex(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open candid: ${item.microcopy}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setViewerIndex(idx);
                    }
                  }}
                >
                  <div className="blooper-tape" aria-hidden="true" />
                  <div className="blooper-tag-strip">
                    <span className="blooper-tag">{item.tag}</span>
                    <span className="blooper-inspect">Tap to zoom</span>
                  </div>
                  <div className="blooper-image-frame">
                    <Image
                      src={item.meta.file}
                      alt={item.meta.alt}
                      width={item.meta.width}
                      height={item.meta.height}
                      sizes="(max-width: 768px) 90vw, 30vw"
                      placeholder="blur"
                      blurDataURL={item.meta.blurDataURL}
                      className="blooper-photo"
                    />
                  </div>
                  <div className="blooper-meta-area">
                    <h2 className="blooper-quote">“{item.microcopy}”</h2>
                    <p className="blooper-note">{item.storyNote}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Architecture Card for Future Candids */}
            <Reveal className="blooper-card-wrap future-placeholder-wrap">
              <div className="blooper-card future-card">
                <span className="future-badge">MORE MEMORIES TO COME</span>
                <h2 className="future-title">The Unwritten Outtakes</h2>
                <p className="future-text">
                  For every road ahead, missed train, windy platform, and messy candid yet to happen with you.
                </p>
                <span className="future-date">From 03.06.2017 to forever.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Return Bar */}
      <div className="bloopers-footer">
        <Link href="/" className="return-cta">
          Return to Adya’s birthday story <span>↗</span>
        </Link>
      </div>

      {/* Fullscreen Modal Viewer */}
      {viewerIndex !== null && (
        <Viewer
          items={allBlooperMedia}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onChange={(newIndex) => setViewerIndex(newIndex)}
        />
      )}
    </main>
  );
}
