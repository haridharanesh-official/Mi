'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { story, type Media } from '@/content/story';
import {
  Reveal,
  Viewer,
  getImageMeta,
} from './Shared';
import dynamic from 'next/dynamic';
import HeroVideo from './HeroVideo';
import DistanceTracker from './DistanceTracker';
import BangleClimax from './BangleClimax';
import BirthdayLetter from './BirthdayLetter';

const Charminar3D = dynamic(() => import('./Charminar3D'), {
  ssr: false,
  loading: () => (
    <div className="charminar-3d-wrapper">
      <div className="charminar-loading-scrim">
        <div className="charminar-spinner">
          <span className="spinner-spark">✦</span>
        </div>
        <p className="loading-title">Rendering 3D Charminar…</p>
      </div>
    </div>
  ),
});

export default function StoryExperience() {
  const [viewerItem, setViewerItem] = useState<{
    items: Media[];
    index: number;
  } | null>(null);

  // Key Image Assets (Train & Journey)
  const heroImg = getImageMeta('IMG_20260904_040741');
  const departureImg1 = getImageMeta('IMG_20260904_040610');
  const departureImg2 = getImageMeta('IMG_20260904_040916');
  const departureImg3 = getImageMeta('IMG_20260904_040921');
  const departureImg4 = getImageMeta('IMG_20260904_041414');

  // The ONLY route map image on the entire website
  const singleRouteMap = getImageMeta('Screenshot_20260906_102806');

  // In-Transit Train Portraits
  const transitImg1 = getImageMeta('IMG_20260904_040916');
  const transitImg2 = getImageMeta('IMG_20260904_040921');
  const transitImg3 = getImageMeta('IMG_20260904_041414');

  // Hyderabad & Charminar
  const hyderabadImg = getImageMeta('IMG_20260905_093814');
  const charminarWide1 = getImageMeta('IMG_20260905_165459');
  const charminarWide2 = getImageMeta('IMG_20260905_165501');
  const charminarPort1 = getImageMeta('IMG_20260905_165509');
  const charminarPort2 = getImageMeta('IMG_20260905_165542');

  // Bangle Reveal
  const banglePrimary = getImageMeta('IMG_20260905_164223');
  const bangleDetail = getImageMeta('IMG_20260905_164224_1');

  return (
    <main className="story-root">
      {/* ============================================================
          01 — OPENING HERO (CINEMATIC BACKGROUND VIDEO)
          ============================================================ */}
      <HeroVideo heroImg={heroImg} />

      {/* ============================================================
          02 — TRAIN DEPARTURE / TRAIN JOURNEY
          ============================================================ */}
      <section className="departure-section" id="departure">
        <div className="editorial-container">
          <Reveal>
            <div className="chapter-eyebrow">
              <span className="num">01</span>
              <span className="sep">—</span>
              <span className="label">THE DEPARTURE</span>
            </div>
          </Reveal>

          {/* Frame 1: Station Atmosphere */}
          <div className="editorial-block block-lead">
            <Reveal className="block-lead-image">
              {departureImg1 && (
                <figure className="photo-plate">
                  <Image
                    src={departureImg1.file}
                    alt={departureImg1.alt}
                    width={departureImg1.width}
                    height={departureImg1.height}
                    sizes="(max-width: 768px) 100vw, 70vw"
                    placeholder="blur"
                    blurDataURL={departureImg1.blurDataURL}
                    className="lead-photo"
                  />
                  <figcaption className="editorial-caption">Station Platform · 04:06 AM</figcaption>
                </figure>
              )}
            </Reveal>

            <div className="block-lead-copy">
              <Reveal>
                <h2 className="editorial-statement">
                  This gift started before the shop.
                  <br />
                  <em>Before the bangle.</em>
                  <br />
                  Before Hyderabad.
                </h2>
              </Reveal>
            </div>
          </div>

          {/* Frame 2: Editorial Split with Portraits & Sticky Text */}
          <div className="editorial-split-layer">
            <div className="split-portrait-col">
              <Reveal>
                {departureImg2 && (
                  <div className="overlap-card card-doorway">
                    <Image
                      src={departureImg2.file}
                      alt={departureImg2.alt}
                      width={departureImg2.width}
                      height={departureImg2.height}
                      sizes="(max-width: 768px) 90vw, 40vw"
                      placeholder="blur"
                      blurDataURL={departureImg2.blurDataURL}
                      className="portrait-photo"
                    />
                    <p className="card-note">In the open doorway.</p>
                  </div>
                )}
              </Reveal>

              <Reveal>
                {departureImg3 && (
                  <div className="overlap-card card-steps">
                    <Image
                      src={departureImg3.file}
                      alt={departureImg3.alt}
                      width={departureImg3.width}
                      height={departureImg3.height}
                      sizes="(max-width: 768px) 90vw, 36vw"
                      placeholder="blur"
                      blurDataURL={departureImg3.blurDataURL}
                      className="portrait-photo"
                    />
                    <p className="card-note">On the coach steps.</p>
                  </div>
                )}
              </Reveal>
            </div>

            <div className="split-sticky-col">
              <div className="sticky-prose-card">
                <Reveal>
                  <p className="prose-eyebrow">THE DECISION</p>
                  <h3 className="prose-callout">
                    It started with a ticket.
                  </h3>
                  <p className="prose-lead">
                    And one very long journey.
                  </p>
                </Reveal>

                <Reveal>
                  {departureImg4 && (
                    <div className="overlap-card card-board">
                      <Image
                        src={departureImg4.file}
                        alt={departureImg4.alt}
                        width={departureImg4.width}
                        height={departureImg4.height}
                        sizes="(max-width: 768px) 90vw, 38vw"
                        placeholder="blur"
                        blurDataURL={departureImg4.blurDataURL}
                        className="portrait-photo"
                      />
                      <p className="card-note">Beside the Hyderabad coach board.</p>
                    </div>
                  )}
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          03 — THE DISTANCE (1,200 KM SECTION & ODOMETER)
          ============================================================ */}
      <DistanceTracker />

      {/* ============================================================
          04 — THE ROUTE (SINGLE TRAVEL MAP SECTION)
          ============================================================ */}
      <section className="single-map-section">
        <div className="single-map-container">
          <Reveal>
            <div className="map-intro-wrap">
              <h3 className="map-poetic-quote">On a map, it was a route.</h3>
              <p className="map-poetic-sub">
                For me, it was a journey for you.
              </p>
            </div>

            {singleRouteMap && (
              <div className="single-map-frame-wrap">
                <div
                  className="single-map-card"
                  onClick={() => setViewerItem({ items: [singleRouteMap], index: 0 })}
                  role="button"
                  tabIndex={0}
                  aria-label="View the journey route map in full resolution"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setViewerItem({ items: [singleRouteMap], index: 0 });
                    }
                  }}
                >
                  <div className="map-viewport-crop">
                    <Image
                      src={singleRouteMap.file}
                      alt="The rail journey route from Coimbatore to Hyderabad across southern India"
                      width={singleRouteMap.width}
                      height={singleRouteMap.height}
                      sizes="(max-width: 768px) 92vw, 540px"
                      placeholder="blur"
                      blurDataURL={singleRouteMap.blurDataURL}
                      className="single-map-photo"
                    />
                  </div>
                  <div className="map-card-footer">
                    <span className="map-route-tag">{story.origin} → {story.destination}</span>
                    <span className="map-zoom-hint">Tap to expand</span>
                  </div>
                </div>
              </div>
            )}

            <p className="map-after-quote">
              This gift travelled before it reached you.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          05 — IN TRANSIT (Personal Train Portraits)
          ============================================================ */}
      <section className="transit-section">
        <div className="transit-container">
          <div className="transit-sticky-col">
            <Reveal>
              <div className="chapter-eyebrow">
                <span className="num">03</span>
                <span className="sep">—</span>
                <span className="label">IN TRANSIT</span>
              </div>
              <h2 className="transit-statement">
                Hours passed.
                <br />
                Stations passed.
                <br />
                States passed.
              </h2>
              <div className="transit-rule" />
              <p className="transit-conclusion">
                But the reason <em>stayed the same.</em>
              </p>
            </Reveal>
          </div>

          <div className="transit-scroll-col">
            {[
              {
                img: transitImg1,
                stamp: '04:09 AM',
                caption: 'Through the morning air.',
              },
              {
                img: transitImg2,
                stamp: 'Midday Passage',
                caption: 'States crossing behind.',
              },
              {
                img: transitImg3,
                stamp: 'Route Confirmation',
                caption: 'Holding the destination in mind.',
              },
            ].map((entry, idx) => {
              if (!entry.img) return null;
              return (
                <Reveal key={entry.img.file} className="transit-frame-card">
                  <figure className="transit-figure">
                    <div className="transit-stamp-bar">
                      <span className="frame-num">STAGE 0{idx + 1}</span>
                      <span className="frame-stamp">{entry.stamp}</span>
                    </div>
                    <Image
                      src={entry.img.file}
                      alt={entry.img.alt}
                      width={entry.img.width}
                      height={entry.img.height}
                      sizes="(max-width: 768px) 90vw, 42vw"
                      placeholder="blur"
                      blurDataURL={entry.img.blurDataURL}
                      className="transit-photo"
                    />
                    <figcaption className="transit-frame-caption">{entry.caption}</figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          06 — HYDERABAD ARRIVAL
          ============================================================ */}
      <section className="hyderabad-scene">
        <div className="hyderabad-bg-frame">
          {hyderabadImg && (
            <Image
              src={hyderabadImg.file}
              alt={hyderabadImg.alt}
              fill
              placeholder="blur"
              blurDataURL={hyderabadImg.blurDataURL}
              sizes="100vw"
              className="hyderabad-photo"
              style={{ objectPosition: '50% 45%' }}
            />
          )}
          <div className="hyderabad-overlay" />
        </div>

        <div className="hyderabad-content">
          <Reveal>
            <p className="hyderabad-intro">Eventually…</p>
            <h2 className="hyderabad-title">
              {story.destination}<em>.</em>
            </h2>
            <p className="hyderabad-subtext">The streets of the old city.</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          07 — CHARMINAR REVEAL
          ============================================================ */}
      <section className="charminar-approach-section">
        <div className="approach-container">
          <Reveal>
            <div className="chapter-eyebrow">
              <span className="num">04</span>
              <span className="sep">—</span>
              <span className="label">THE OLD CITY</span>
            </div>
            <p className="approach-prelude">
              But Hyderabad wasn’t quite the destination.
              <br />
              <em>Not yet.</em>
            </p>
            <h2 className="approach-monument-title">CHARMINAR</h2>
            <p className="approach-postlude">
              This was where the search really began.
            </p>
          </Reveal>

          {/* Interactive 3D Charminar Monument */}
          <Reveal>
            <Charminar3D />
          </Reveal>

          {/* Progressive Visual Approach */}
          <div className="approach-progression-grid">
            <div className="progression-stage stage-wide">
              <Reveal>
                <p className="stage-label">01 / THE CROWDED LANES</p>
                {charminarWide1 && (
                  <figure className="approach-photo-frame">
                    <Image
                      src={charminarWide1.file}
                      alt={charminarWide1.alt}
                      width={charminarWide1.width}
                      height={charminarWide1.height}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      placeholder="blur"
                      blurDataURL={charminarWide1.blurDataURL}
                      className="approach-photo"
                    />
                    <figcaption>In the bustling pulse of the bazaar.</figcaption>
                  </figure>
                )}
              </Reveal>

              <Reveal>
                <p className="stage-label">02 / LOOKING UP</p>
                {charminarWide2 && (
                  <figure className="approach-photo-frame highlight-frame">
                    <Image
                      src={charminarWide2.file}
                      alt={charminarWide2.alt}
                      width={charminarWide2.width}
                      height={charminarWide2.height}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      priority
                      placeholder="blur"
                      blurDataURL={charminarWide2.blurDataURL}
                      className="approach-photo"
                    />
                    <figcaption>The minarets rising over the market.</figcaption>
                  </figure>
                )}
              </Reveal>
            </div>

            <div className="progression-stage stage-close">
              <Reveal>
                <p className="stage-label">03 / AT THE MONUMENT</p>
                {charminarPort1 && (
                  <figure className="approach-photo-frame">
                    <Image
                      src={charminarPort1.file}
                      alt={charminarPort1.alt}
                      width={charminarPort1.width}
                      height={charminarPort1.height}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      placeholder="blur"
                      blurDataURL={charminarPort1.blurDataURL}
                      className="approach-photo"
                    />
                    <figcaption>A quiet moment in front of the arches.</figcaption>
                  </figure>
                )}
              </Reveal>

              <Reveal>
                <p className="stage-label">04 / ARRIVED</p>
                {charminarPort2 && (
                  <figure className="approach-photo-frame">
                    <Image
                      src={charminarPort2.file}
                      alt={charminarPort2.alt}
                      width={charminarPort2.width}
                      height={charminarPort2.height}
                      sizes="(max-width: 768px) 90vw, 45vw"
                      placeholder="blur"
                      blurDataURL={charminarPort2.blurDataURL}
                      className="approach-photo"
                    />
                    <figcaption>Standing where the journey was headed.</figcaption>
                  </figure>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          08 — THE SEARCH (Suspense Leading To Her Name)
          ============================================================ */}
      <section className="search-section">
        <div className="search-container">
          <Reveal>
            <div className="chapter-eyebrow centered">
              <span className="num">05</span>
              <span className="sep">—</span>
              <span className="label">THE SEARCH</span>
            </div>
          </Reveal>

          <div className="search-steps">
            <Reveal>
              <p className="search-line">Colour after colour.</p>
            </Reveal>
            <Reveal>
              <p className="search-line">Shop after shop.</p>
            </Reveal>
            <Reveal>
              <p className="search-line">Not just anything.</p>
            </Reveal>
            <Reveal>
              <h3 className="search-climax-line">It had to feel right.</h3>
            </Reveal>
            <Reveal>
              <p className="search-line dedicated">It had to be for her.</p>
            </Reveal>
            <Reveal>
              <h2 className="search-name">
                <em>Adya.</em>
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          09 — BANGLE REVEAL — THE VISUAL CLIMAX
          ============================================================ */}
      <BangleClimax banglePrimary={banglePrimary} bangleDetail={bangleDetail} />

      {/* ============================================================
          10 — THE MESSAGE BEHIND THE GIFT
          ============================================================ */}
      <section className="gift-message-section">
        <div className="message-container">
          <Reveal>
            <div className="chapter-eyebrow centered">
              <span className="num">07</span>
              <span className="sep">—</span>
              <span className="label">THE MEANING</span>
            </div>

            <div className="message-letter">
              <p className="message-lead">
                I could have ordered something online.
              </p>
              <p className="message-body">
                But I didn’t want your gift to arrive without a story.
              </p>
              <p className="message-emphasis">
                I wanted to go there.
                <br />
                Choose it.
                <br />
                Carry it back.
              </p>
              <p className="message-body">
                And give you something that had already travelled before it reached your hands.
              </p>
              <div className="message-divider" />
              <p className="message-closing">
                So whenever you look at it…
                <br />
                I hope you don’t only see a bangle.
              </p>
              <h3 className="message-final-line">
                I hope you remember how much you mean to me. <span className="heart-inline-pulse">❤️</span>
              </h3>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          11 — HAPPY BIRTHDAY ADYA (Interactive Wish & Letter)
          ============================================================ */}
      <BirthdayLetter />

      {/* ============================================================
          12 — LOVE STORY (COMES AFTER THE GIFT)
          ============================================================ */}
      <section className="timeline-section">
        <div className="timeline-container">
          <Reveal>
            <div className="chapter-eyebrow centered">
              <span className="num">09</span>
              <span className="sep">—</span>
              <span className="label">THE ORIGIN OF US</span>
            </div>

            <div className="love-ribbon-eyebrow">
              <span className="ribbon-tail-left" />
              <span className="ribbon-text">🎀 OUR LOVE STORY · FROM 2017 TO INFINITY 💕</span>
              <span className="ribbon-tail-right" />
            </div>

            <p className="timeline-transition-lead">But the truth is…</p>
            <h2 className="timeline-headline">
              This journey didn’t really begin in Coimbatore.
            </h2>
          </Reveal>

          {/* Compact Milestone Cards */}
          <div className="timeline-milestones-row">
            {story.keyDates.map((item, idx) => (
              <Reveal key={item.date} className="milestone-card">
                <div className="milestone-step-marker">
                  <span className="marker-dot" />
                  <span className="marker-index">0{idx + 1}</span>
                  <span className="marker-love-icon" title="Love Milestone">{['👁️', '💌', '💍', '💖'][idx]}</span>
                </div>
                <h3 className="milestone-date">{item.date}</h3>
                <p className="milestone-title">{item.title}</p>
                <small className="milestone-subtitle">{item.subtitle}</small>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          13 — FINAL CONNECTION (Callback to 1,200 km)
          ============================================================ */}
      <section className="callback-section">
        <div className="callback-container">
          <Reveal>
            <h2 className="callback-heading">
              Maybe that’s why 1,200 kilometres
              <br />
              <em>didn’t feel that far.</em>
            </h2>
            <div className="callback-rule" />
            <p className="callback-subtext">
              Because this journey started long before the train did.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Navigation to Photobooth & Bloopers */}
      <section className="archive-links-section">
        <div className="archive-links-container">
          <Reveal>
            <p className="archive-prompt">More unhurried memories from the trip:</p>
            <div className="archive-nav-grid">
              <Link href="/photobooth" className="archive-card">
                <span className="archive-tag">01 / GALLERY WALL</span>
                <h3 className="archive-title">
                  Photobooth <em>↗</em>
                </h3>
                <p className="archive-desc">
                  Overlapping prints, polaroids, and our favourite trip frames.
                </p>
              </Link>
              <Link href="/bloopers" className="archive-card">
                <span className="archive-tag">02 / UNEDITED CANDIDS</span>
                <h3 className="archive-title">
                  The Bloopers <em>↗</em>
                </h3>
                <p className="archive-desc">
                  Because the 1,200 km journey wasn’t cinematic every second.
                </p>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          14 — FINAL PAGE ENDING (Full-Screen Dark Ending)
          ============================================================ */}
      <footer className="final-ending-section">
        <div className="ending-inner">
          <Reveal>
            <p className="ending-dates-lead">From 03.06.2017…</p>
            <p className="ending-km-pause">
              …to 1,200 kilometres for a birthday gift.
            </p>

            <h2 className="ending-vow">
              I’d still choose the journey.
              <br />
              <em>I’d still choose you.</em>
            </h2>

            <p className="ending-birthday-final">Happy Birthday, Adya.</p>
            <div className="final-love-seal">
              <span className="final-heart-icon">♥</span>
              <span>21.02.2022 — STILL US · ALWAYS IN LOVE</span>
              <span className="final-heart-icon">♥</span>
            </div>
          </Reveal>
        </div>
      </footer>

      {/* Lightbox for Single Map or Expanded Media */}
      {viewerItem && (
        <Viewer
          items={viewerItem.items}
          index={viewerItem.index}
          onClose={() => setViewerItem(null)}
          onChange={(newIndex) =>
            setViewerItem({ items: viewerItem.items, index: newIndex })
          }
        />
      )}
    </main>
  );
}
