'use client';

import { useState } from 'react';
import { story } from '@/content/story';
import { ConfettiCanvas, Reveal } from './Shared';

export default function BirthdayLetter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className="birthday-section-elevated" id="birthday-wish">
      {isOpen && <ConfettiCanvas />}

      <div className="birthday-container-elevated">
        <Reveal>
          <div className="chapter-eyebrow centered">
            <span className="num">08</span>
            <span className="sep">—</span>
            <span className="label">A WISH FOR YOU</span>
          </div>

          <h2 className="birthday-headline-elevated">
            Happy Birthday,
            <br />
            <em className="gold-shimmer">{story.herName}.</em>
          </h2>

          <p className="envelope-hint-text">
            {isOpen ? 'Your letter is open' : 'A sealed letter travelled 1,200 km to reach you'}
          </p>

          {/* Interactive Vintage Wax-Sealed Envelope */}
          <div className="envelope-interactive-wrap">
            {/* Satin Gift Ribbon Wrap with Bow */}
            <div className={`envelope-satin-ribbon ${isOpen ? 'is-untied' : ''}`}>
              <div className="ribbon-horizontal-band" />
              <div className="ribbon-satin-bow">
                <span className="bow-loop left" />
                <span className="bow-center-knot">♥</span>
                <span className="bow-loop right" />
                <span className="bow-tail left" />
                <span className="bow-tail right" />
              </div>
            </div>

            <div className={`vintage-envelope ${isOpen ? 'is-open' : 'is-sealed'}`}>
              {/* Envelope Flap */}
              <div className="envelope-back" />
              <div className="envelope-flap" />

              {/* Wax Seal Button with Heart Motif */}
              <button
                type="button"
                className="wax-seal-btn"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Fold the letter' : 'Break the wax seal to open your birthday letter'}
              >
                <div className="wax-seal-disc">
                  <span className="seal-heart-crown">♥</span>
                  <span className="seal-monogram">A</span>
                  <span className="seal-rim" />
                </div>
                <span className="seal-prompt">
                  {isOpen ? 'Fold letter' : 'Break seal to read with love'}
                </span>
              </button>

              {/* Parchment Letter */}
              <div className={`parchment-letter ${isOpen ? 'is-revealed' : 'is-tucked'}`}>
                <div className="parchment-border-deckle" />
                <div className="letter-header-row">
                  <span className="letter-flourish">❦</span>
                  <h3 className="letter-salutation">Dearest {story.herName},</h3>
                  <span className="letter-date">2026 · A Birthday Journey</span>
                </div>

                <div className="letter-body-paragraphs">
                  {story.birthdayWish.map((para, i) => (
                    <p key={i} className={i === 0 ? 'lead-paragraph' : ''}>
                      {para}
                    </p>
                  ))}
                </div>

                <div className="letter-signoff">
                  <p className="signoff-words">With all my love,</p>
                  <p className="signoff-handwritten">Always yours.</p>
                  <span className="signoff-seal-small">✦ 21.02.2022 — still us</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
