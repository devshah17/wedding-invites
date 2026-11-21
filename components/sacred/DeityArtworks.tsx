'use client';

import React from 'react';
import Image from 'next/image';

/**
 * High-fidelity Sacred Artworks for Hindu Deities, Sacred Animals, and Temple Motifs
 * Built for Dev & Vishakha's White & Off-White Luxury Royal Indian Wedding
 */

/* ==========================================================================
   1. Lord Ganesha (Ganpati Ji)
   ========================================================================== */
export function GanpatiArtwork({ className = 'w-24 h-28' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/sacred/ganpati.png"
        alt="Bhagwan Shri Ganesha"
        width={320}
        height={450}
        priority
        className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(201,154,69,0.35)] select-none"
      />
    </div>
  );
}

/* ==========================================================================
   2. Shrinathji (Lord of Govardhan - Nathdwara Pichwai Style)
   ========================================================================== */
export function ShrinathjiArtwork({ className = 'w-24 h-32' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/sacred/shrinathji.png"
        alt="Bhagwan Shree Shrinathji"
        width={320}
        height={500}
        className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(201,154,69,0.35)] select-none"
      />
    </div>
  );
}

/* ==========================================================================
   3. Mahadev & Parvati Ji (Shiv-Shakti Kalyana Form)
   ========================================================================== */
export function ShivParvatiArtwork({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/sacred/shivparvati.png"
        alt="Bhagwan Shiv & Maa Parvati"
        width={380}
        height={480}
        className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(201,154,69,0.35)] select-none"
      />
    </div>
  );
}

/* ==========================================================================
   4. Shree Radha Krishna with Flute & Lotus (Vrindavan Prem)
   ========================================================================== */
export function RadhaKrishnaArtwork({ className = 'w-28 h-32' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/images/sacred/radhakrishna.png"
        alt="Shree Radha Krishna"
        width={340}
        height={500}
        className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(201,154,69,0.35)] select-none"
      />
    </div>
  );
}

/* ==========================================================================
   5. Auspicious Kamdhenu Holy Cow (Gau Mata)
   ========================================================================== */
export function PichwaiCowArtwork({
  className = 'w-20 h-16',
  facing = 'right',
}: {
  className?: string;
  facing?: 'left' | 'right';
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src={facing === 'right' ? '/images/sacred/kamdhenu_left.png' : '/images/sacred/kamdhenu_right.png'}
        alt="Sacred Kamdhenu Gau Mata"
        width={260}
        height={260}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(201,154,69,0.25)] select-none pointer-events-none"
      />
    </div>
  );
}

/* ==========================================================================
   6. Royal Caparisoned Elephant (Auspicious Gaja with Raised Trunk)
   ========================================================================== */
export function RoyalElephantArtwork({
  className = 'w-24 h-20',
  facing = 'right',
}: {
  className?: string;
  facing?: 'left' | 'right';
}) {
  return (
    <svg
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${facing === 'left' ? '-scale-x-100' : ''} ${className}`}
      aria-label="Auspicious Royal Elephant"
    >
      {/* Elephant Body (Off-White Marble / Royal Slate Ivory) */}
      <path
        d="M 35 75 C 35 48 55 35 90 38 C 120 40 135 48 145 60 C 152 68 158 64 162 50 C 165 42 172 44 170 56 C 168 74 152 90 145 92 C 140 102 125 106 100 106 C 70 106 35 98 35 75 Z"
        fill="#FBF9F5"
        stroke="#C99A45"
        strokeWidth="1.8"
      />

      {/* Auspicious Raised Trunk Showering Lotus */}
      <path
        d="M 148 68 Q 165 65 166 48 Q 166 38 160 40"
        stroke="#C99A45"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lotus blossom in trunk */}
      <circle cx="158" cy="38" r="4.5" fill="#F08092" stroke="#C99A45" strokeWidth="0.8" />

      {/* Royal Brocade Saddle Cloth (Jhool) */}
      <path
        d="M 68 45 L 112 45 L 118 85 Q 90 92 62 85 Z"
        fill="#A0153E"
        stroke="#C99A45"
        strokeWidth="1.5"
      />
      {/* Jhool Golden Border & Lattice Pattern */}
      <path d="M 68 50 L 112 50" stroke="#E8C872" strokeWidth="1.5" />
      <path d="M 62 80 Q 90 87 118 80" stroke="#E8C872" strokeWidth="1.5" />
      <circle cx="90" cy="65" r="5" fill="#E8C872" stroke="#A07628" strokeWidth="1" />

      {/* Royal Golden Howdah / Dome Seat on Back */}
      <path
        d="M 75 36 L 105 36 L 100 24 L 80 24 Z"
        fill="url(#elephantGold)"
        stroke="#A07628"
        strokeWidth="1"
      />
      <circle cx="90" cy="20" r="3" fill="#D85A32" />

      {/* Elephant Forehead Plate (Mathabandi) */}
      <path d="M 134 46 Q 144 42 148 54" stroke="#E8C872" strokeWidth="2.5" fill="none" />
      <circle cx="140" cy="48" r="2" fill="#D85A32" />

      {/* Tusk */}
      <path d="M 144 76 Q 155 78 158 72" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* Peaceful Eye */}
      <circle cx="135" cy="56" r="2.5" fill="#1C212D" />
      <circle cx="136" cy="55.5" r="0.8" fill="#FFFFFF" />

      {/* Sturdy Royal Legs */}
      <rect x="48" y="96" width="12" height="34" rx="5" fill="#FBF9F5" stroke="#C99A45" strokeWidth="1.5" />
      <rect x="68" y="96" width="12" height="34" rx="5" fill="#FBF9F5" stroke="#C99A45" strokeWidth="1.5" />
      <rect x="105" y="96" width="12" height="34" rx="5" fill="#FBF9F5" stroke="#C99A45" strokeWidth="1.5" />
      <rect x="125" y="96" width="12" height="34" rx="5" fill="#FBF9F5" stroke="#C99A45" strokeWidth="1.5" />

      {/* Golden Anklets (Ghungroo) */}
      <line x1="48" y1="124" x2="60" y2="124" stroke="#C99A45" strokeWidth="2" />
      <line x1="68" y1="124" x2="80" y2="124" stroke="#C99A45" strokeWidth="2" />
      <line x1="105" y1="124" x2="117" y2="124" stroke="#C99A45" strokeWidth="2" />
      <line x1="125" y1="124" x2="137" y2="124" stroke="#C99A45" strokeWidth="2" />

      {/* Tail with Tuft */}
      <path d="M 35 68 Q 24 85 28 108" stroke="#C99A45" strokeWidth="1.5" fill="none" />
      <ellipse cx="28" cy="110" rx="3" ry="5" fill="#1C212D" />

      <defs>
        <linearGradient id="elephantGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3DB" />
          <stop offset="50%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#C99A45" />
        </linearGradient>
      </defs>
    </svg>
  );
}
