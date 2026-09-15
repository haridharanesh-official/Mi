'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function StoryNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Journey' },
    { href: '/#charminar', label: 'Charminar 3D' },
    { href: '/photobooth', label: 'Photobooth' },
    { href: '/bloopers', label: 'Bloopers' },
  ];

  return (
    <nav className="story-nav-wrap" aria-label="Story navigation">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="nav-mobile-toggle"
        aria-expanded={open}
        aria-controls="nav-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
      >
        <span className="toggle-dot" />
        <span className="toggle-text">{open ? 'Close' : 'Menu'}</span>
      </button>

      {/* Navigation Links */}
      <div id="nav-menu" className={`story-nav ${open ? 'is-open' : ''}`}>
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
