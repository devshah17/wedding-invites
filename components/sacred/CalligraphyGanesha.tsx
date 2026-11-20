'use client';

import React from 'react';

/**
 * Traditional Calligraphic Ganesha Line Art Motif
 * Exactly matching the upper-center sacred emblem in the user's reference wedding invitation
 */
export function CalligraphyGanesha({ className = 'w-24 h-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#8B1E2F] select-none ${className}`}
      aria-label="Auspicious Lord Ganesha Calligraphy"
    >
      <defs>
        <linearGradient id="ganeshaMaroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A0153E" />
          <stop offset="50%" stopColor="#8B1E2F" />
          <stop offset="100%" stopColor="#541426" />
        </linearGradient>
      </defs>

      {/* Paghdi / Mukut Calligraphic Strokes */}
      {/* Topmost wave */}
      <path
        d="M 52 14 C 58 10, 68 11, 72 16 C 66 18, 58 16, 52 14 Z"
        fill="url(#ganeshaMaroonGrad)"
      />
      {/* Second wave */}
      <path
        d="M 46 22 C 55 16, 74 17, 78 24 C 70 26, 56 24, 46 22 Z"
        fill="url(#ganeshaMaroonGrad)"
      />
      {/* Third crown tier */}
      <path
        d="M 42 32 C 52 24, 80 25, 84 34 C 74 36, 52 34, 42 32 Z"
        fill="url(#ganeshaMaroonGrad)"
      />

      {/* Forehead Brow & Eye Curve */}
      <path
        d="M 40 42 C 48 36, 68 37, 72 45 C 72 48, 68 52, 60 48 C 50 44, 44 48, 40 42 Z"
        fill="url(#ganeshaMaroonGrad)"
      />
      {/* Divine Eye Dot / Tilak */}
      <circle cx="56" cy="42" r="2.5" fill="#C99A45" />

      {/* Main Flowing Calligraphic Trunk & Ear (Forms sacred Om / Ganesha silhouette) */}
      <path
        d="M 64 48 C 66 60, 62 82, 54 98 C 48 110, 42 118, 52 122 C 60 125, 68 118, 70 108 C 72 96, 68 85, 62 76 C 60 72, 62 68, 66 70 C 74 74, 80 88, 80 102 C 80 120, 64 132, 48 128 C 34 124, 38 102, 46 88 C 52 74, 56 58, 54 48 Z"
        fill="url(#ganeshaMaroonGrad)"
      />

      {/* Right Ear Flourish (Large sweeping sacred loop) */}
      <path
        d="M 72 45 C 88 48, 102 62, 98 80 C 94 96, 82 104, 72 102 C 68 101, 68 96, 72 96 C 80 96, 88 88, 90 76 C 92 64, 82 54, 70 50 Z"
        fill="url(#ganeshaMaroonGrad)"
      />

      {/* Left Ear Flourish */}
      <path
        d="M 42 42 C 28 46, 18 60, 22 76 C 26 92, 38 98, 46 96 C 48 95, 48 92, 45 92 C 38 92, 30 84, 28 74 C 26 62, 34 52, 44 48 Z"
        fill="url(#ganeshaMaroonGrad)"
      />

      {/* Auspicious Modak / Pearl Accent */}
      <circle cx="78" cy="85" r="3.2" fill="#C99A45" />
    </svg>
  );
}

export default CalligraphyGanesha;
