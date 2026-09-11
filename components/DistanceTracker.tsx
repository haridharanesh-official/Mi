'use client';

import { useState } from 'react';
import { CountUpNumber, Reveal } from './Shared';
import { story } from '@/content/story';

const MILESTONES = [
  {
    station: 'Coimbatore Jn',
    km: 0,
    time: '04:07 AM',
    note: 'The departure in the cold morning air. Boarding coach S4.',
    state: 'Tamil Nadu',
  },
  {
    station: 'Katpadi Jn',
    km: 375,
    time: '09:50 AM',
    note: 'Morning light crossing the northern railway corridor.',
    state: 'Tamil Nadu',
  },
  {
    station: 'Renigunta Jn',
    km: 518,
    time: '12:35 PM',
    note: 'Entering Andhra Pradesh. Miles flying by outside the door.',
    state: 'Andhra Pradesh',
  },
  {
    station: 'Guntur Jn',
    km: 812,
    time: '06:15 PM',
    note: 'Twilight falling across the Krishna River basin.',
    state: 'Andhra Pradesh',
  },
  {
    station: 'Hyderabad Deccan',
    km: 1200,
    time: '02:30 AM',
    note: '22 hours later. The destination reached for one reason.',
    state: 'Telangana',
  },
];

export default function DistanceTracker() {
  const [activeStation, setActiveStation] = useState(MILESTONES[0]);

  return (
    <section className="distance-section-elevated" id="distance">
      <div className="distance-elevated-container">
        <Reveal>
          <div className="chapter-eyebrow centered">
            <span className="num">02</span>
            <span className="sep">—</span>
            <span className="label">THE DISTANCE</span>
          </div>

          <div className="love-ribbon-eyebrow">
            <span className="ribbon-tail-left" />
            <span className="ribbon-text">🎀 CARRIED WITH ALL MY LOVE · 1,200 KM</span>
            <span className="ribbon-tail-right" />
          </div>

          <p className="distance-tagline">A promise of love measured in railway tracks ❤️</p>

          {/* Odometer Display */}
          <div className="distance-odometer-wrap">
            <div className="odometer-glow-back" aria-hidden="true" />
            <div className="odometer-box">
              <span className="odometer-prefix">~</span>
              <span className="odometer-value">
                <CountUpNumber target={story.journeyDistance} duration={2400} />
              </span>
              <span className="odometer-unit">KM</span>
            </div>

            <div className="odometer-subbar">
              <span className="subbar-segment">22+ HOURS IN TRANSIT</span>
              <span className="subbar-dot">·</span>
              <span className="subbar-segment">3 STATES CROSSED</span>
              <span className="subbar-dot">·</span>
              <span className="subbar-segment">POWERED BY LOVE 💖</span>
            </div>
          </div>

          {/* Interactive Milestone Route Track */}
          <div className="milestone-track-container">
            <div className="track-rail-line">
              <div className="track-rail-fill" style={{ width: `${(activeStation.km / 1200) * 100}%` }} />
              <div
                className="track-train-locomotive"
                style={{ left: `${(activeStation.km / 1200) * 100}%` }}
                title="Current milestone"
              >
                <span className="loco-icon">🚂</span>
                <span className="loco-heart-steam">❤️</span>
                <span className="loco-pulse" />
              </div>
            </div>

            <div className="milestone-nodes-row">
              {MILESTONES.map((m) => {
                const isActive = activeStation.station === m.station;
                return (
                  <button
                    key={m.station}
                    type="button"
                    className={`milestone-node-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveStation(m)}
                    aria-label={`View milestone: ${m.station}`}
                  >
                    <span className="node-dot" />
                    <span className="node-km">{m.km} KM</span>
                    <span className="node-station">{m.station}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Detail Card */}
            <div className="active-milestone-card arrive-fade">
              <div className="milestone-card-header">
                <span className="station-name">{activeStation.station}</span>
                <span className="station-state">{activeStation.state} · {activeStation.time}</span>
              </div>
              <p className="station-note">{activeStation.note}</p>
            </div>
          </div>

          {/* Poetic Pause */}
          <div className="distance-meaning-elevated">
            <h3 className="meaning-headline">Not for a vacation.</h3>
            <p className="meaning-subline">
              <em>For one birthday gift.</em>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
