'use client';

import React from 'react';

/**
 * High-fidelity Vector Artworks for Hindu Deities, Sacred Animals, and Temple Motifs
 * Built for Dev & Vishakha's White & Off-White Luxury Royal Indian Wedding
 */

/* ==========================================================================
   1. Lord Ganesha (Ganpati Ji)
   ========================================================================== */
export function GanpatiArtwork({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bhagwan Shri Ganesha"
    >
      {/* Golden Aura Halo */}
      <circle cx="100" cy="100" r="90" fill="url(#ganeshaAura)" opacity="0.35" />
      <circle cx="100" cy="100" r="82" stroke="#C99A45" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />

      {/* Ornate Mukut (Crown) */}
      <path
        d="M 80 46 L 100 12 L 120 46 L 114 56 L 86 56 Z"
        fill="url(#goldCrown)"
        stroke="#A07628"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="30" r="4" fill="#D85A32" />
      <circle cx="92" cy="42" r="2.5" fill="#C99A45" />
      <circle cx="108" cy="42" r="2.5" fill="#C99A45" />
      <path d="M 86 52 L 114 52" stroke="#D85A32" strokeWidth="2" />

      {/* Sacred Large Ears */}
      {/* Left Ear */}
      <path
        d="M 78 68 C 45 55 35 85 45 105 C 55 120 74 116 78 112"
        fill="#FFF7EB"
        stroke="#C99A45"
        strokeWidth="2.5"
      />
      <path d="M 52 78 C 50 92 60 102 70 104" stroke="#E8C872" strokeWidth="1.2" />

      {/* Right Ear */}
      <path
        d="M 122 68 C 155 55 165 85 155 105 C 145 120 126 116 122 112"
        fill="#FFF7EB"
        stroke="#C99A45"
        strokeWidth="2.5"
      />
      <path d="M 148 78 C 150 92 140 102 130 104" stroke="#E8C872" strokeWidth="1.2" />

      {/* Head & Forehead */}
      <ellipse cx="100" cy="80" rx="26" ry="24" fill="#FFF7EB" stroke="#C99A45" strokeWidth="2" />

      {/* Auspicious Trishul Tilak on Forehead */}
      <path d="M 100 60 L 100 78" stroke="#D85A32" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 94 65 Q 100 72 106 65" stroke="#D85A32" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="100" cy="74" r="2.5" fill="#C99A45" />

      {/* Divine Eyes */}
      <ellipse cx="88" cy="82" rx="4" ry="2.5" fill="#541426" />
      <ellipse cx="112" cy="82" rx="4" ry="2.5" fill="#541426" />
      <circle cx="89" cy="81.5" r="1" fill="#FFFFFF" />
      <circle cx="113" cy="81.5" r="1" fill="#FFFFFF" />

      {/* Sacred Curved Trunk */}
      <path
        d="M 94 88 C 94 105 88 128 100 134 C 114 140 126 130 126 122 C 126 116 120 114 116 117 C 112 120 115 126 119 125"
        fill="#FFF7EB"
        stroke="#C99A45"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Tusks (One unbroken, one broken) */}
      <path d="M 85 96 L 77 101" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M 115 96 L 120 99" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* Modak (Sweet) in Trunk */}
      <circle cx="121" cy="118" r="5" fill="#E5A910" stroke="#C99A45" strokeWidth="1" />

      {/* Lotus Pedestal Base */}
      <g opacity="0.9">
        {[-30, -15, 0, 15, 30].map((deg, i) => (
          <path
            key={i}
            d={`M ${100 + deg * 1.5} 155 Q ${100 + deg * 2} 175 ${100 + deg * 0.5} 185 Q ${100 - deg * 0.5} 175 ${100 + deg * 1.5} 155 Z`}
            fill="#F3D9D5"
            stroke="#C99A45"
            strokeWidth="1"
          />
        ))}
      </g>

      <defs>
        <radialGradient id="ganeshaAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="70%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#C99A45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3DB" />
          <stop offset="50%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#A07628" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ==========================================================================
   2. Shrinathji (Lord of Govardhan - Nathdwara Pichwai Style)
   ========================================================================== */
export function ShrinathjiArtwork({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bhagwan Shree Shrinathji"
    >
      {/* Pichwai Dark Slate Mandir Niche */}
      <rect x="25" y="15" width="150" height="210" rx="20" fill="#1C212D" stroke="#C99A45" strokeWidth="2.5" />
      <rect x="30" y="20" width="140" height="200" rx="16" fill="none" stroke="#E8C872" strokeWidth="1" strokeDasharray="3 3" />

      {/* Govardhan Parvat Swaroop Arch */}
      <path
        d="M 40 70 Q 100 25 160 70 L 160 215 L 40 215 Z"
        fill="#0E131F"
      />

      {/* Shrinathji Divine Black Stone Form (Shyam Swaroop) */}
      <ellipse cx="100" cy="80" rx="32" ry="36" fill="#141923" />

      {/* Iconic Raised Left Arm (Lifting Govardhan Parvat) */}
      <path
        d="M 80 90 C 65 85 52 70 56 45 C 58 40 64 42 66 48 C 66 62 76 75 88 80"
        fill="#141923"
        stroke="#C99A45"
        strokeWidth="1.5"
      />
      {/* Left Hand Holding the Mountain - Auspicious Fist */}
      <circle cx="58" cy="42" r="6" fill="#141923" stroke="#E8C872" strokeWidth="1.5" />

      {/* Right Arm Resting Gracefully on Waist (Kati-hasta) */}
      <path
        d="M 120 90 C 135 105 138 125 125 140 C 120 144 116 140 118 134 C 124 122 122 108 114 96"
        fill="#141923"
        stroke="#C99A45"
        strokeWidth="1.5"
      />

      {/* Shrinathji Crown (Shikhanda Mukut with Mor Pankh - Peacock Feather) */}
      <path
        d="M 84 56 C 88 40 100 36 116 56 Z"
        fill="url(#shrinathjiGold)"
        stroke="#A07628"
        strokeWidth="1"
      />
      {/* Peacock Feather (Mor Pankh) */}
      <ellipse cx="100" cy="35" rx="7" ry="12" fill="#1B4D3E" />
      <circle cx="100" cy="35" r="4.5" fill="#1E56A0" />
      <circle cx="100" cy="35" r="2" fill="#E8C872" />

      {/* Divine Lotus Eyes (Looking downwards lovingly at devotees) */}
      <path d="M 88 80 Q 94 85 98 81 Q 94 77 88 80 Z" fill="#FFFFFF" />
      <ellipse cx="94" cy="81" rx="2" ry="2" fill="#000000" />
      <path d="M 102 81 Q 106 85 112 80 Q 106 77 102 81 Z" fill="#FFFFFF" />
      <ellipse cx="106" cy="81" rx="2" ry="2" fill="#000000" />

      {/* Kasturi Tilak with Yamunaji Chandra */}
      <path d="M 98 68 L 102 68 L 100 78 Z" fill="#D85A32" />
      <circle cx="100" cy="65" r="2" fill="#E8C872" />

      {/* Chibuk (Diamond on the Chin) */}
      <polygon points="100,90 102,92 100,94 98,92" fill="#FFFFFF" stroke="#C99A45" strokeWidth="0.5" />

      {/* Large Royal White Pearl Necklace (Haar) & Emerald Garland */}
      <path
        d="M 82 98 Q 100 130 118 98"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeDasharray="4 2"
        fill="none"
      />
      <path
        d="M 76 104 Q 100 150 124 104"
        stroke="#C99A45"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Vanmala (Long Floral Garland reaching to feet) */}
      <path
        d="M 70 115 Q 100 185 130 115"
        stroke="#F08092"
        strokeWidth="4"
        strokeDasharray="6 3"
        fill="none"
      />

      {/* Gold Pitambar (Silk lower dhoti) */}
      <path
        d="M 85 135 L 115 135 L 122 195 L 78 195 Z"
        fill="url(#shrinathjiGold)"
        stroke="#C99A45"
        strokeWidth="1.5"
      />
      <path d="M 100 135 L 100 195" stroke="#A07628" strokeWidth="1.2" />

      {/* Sacred Lotus Feet (Charan Kamal) */}
      <ellipse cx="92" cy="198" rx="6" ry="3.5" fill="#141923" stroke="#C99A45" strokeWidth="1" />
      <ellipse cx="108" cy="198" rx="6" ry="3.5" fill="#141923" stroke="#C99A45" strokeWidth="1" />

      {/* Lotus Flowers flanking */}
      <circle cx="48" cy="180" r="8" fill="#F3D9D5" stroke="#C99A45" strokeWidth="1" />
      <circle cx="152" cy="180" r="8" fill="#F3D9D5" stroke="#C99A45" strokeWidth="1" />

      <defs>
        <linearGradient id="shrinathjiGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3DB" />
          <stop offset="45%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#C99A45" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ==========================================================================
   3. Mahadev & Parvati Ji (Shiv-Shakti Kalyana Form)
   ========================================================================== */
export function ShivParvatiArtwork({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bhagwan Shiv and Mata Parvati"
    >
      {/* Divine Aura (Kailash Light) */}
      <circle cx="110" cy="95" r="85" fill="url(#shivaAura)" opacity="0.3" />
      <circle cx="110" cy="95" r="80" stroke="#C99A45" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* ================= LORD SHIVA (LEFT) ================= */}
      {/* Shiva Jata (Matted Hair Knot) */}
      <path
        d="M 68 55 C 65 30 95 30 92 55 Z"
        fill="#2A2421"
        stroke="#C99A45"
        strokeWidth="1.2"
      />
      {/* Crescent Moon (Chandra) in Jata */}
      <path
        d="M 64 36 C 64 46 74 50 78 44 C 74 44 68 40 68 34"
        fill="#FFFFFF"
        stroke="#E8C872"
        strokeWidth="0.8"
      />
      {/* Sacred Ganga Stream */}
      <path d="M 88 32 Q 95 24 94 18" stroke="#70A9FF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Shiva Face */}
      <ellipse cx="80" cy="72" rx="16" ry="19" fill="#F4EFEA" stroke="#C99A45" strokeWidth="1.5" />
      {/* Third Eye (Trinetra) */}
      <ellipse cx="80" cy="65" rx="1.5" ry="3" fill="#D85A32" />
      {/* Tripundra (Three Sacred Ash Marks) */}
      <line x1="74" y1="63" x2="86" y2="63" stroke="#C99A45" strokeWidth="1" />
      <line x1="73" y1="65" x2="87" y2="65" stroke="#C99A45" strokeWidth="1" />
      <line x1="74" y1="67" x2="86" y2="67" stroke="#C99A45" strokeWidth="1" />
      {/* Serene Eyes & Tilak */}
      <path d="M 72 73 Q 76 77 80 74" stroke="#541426" strokeWidth="1.2" fill="none" />
      <path d="M 80 74 Q 84 77 88 73" stroke="#541426" strokeWidth="1.2" fill="none" />
      {/* Vasuki Naag (Serpent around neck) */}
      <path d="M 70 88 Q 80 96 92 88 Q 98 96 90 102" stroke="#4A7C59" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Rudraksha Necklace */}
      <path d="M 68 94 Q 80 112 92 94" stroke="#8B4513" strokeWidth="2" strokeDasharray="2 2" fill="none" />

      {/* Trishul & Damru (Holy Trident) */}
      <g transform="translate(32, 28)">
        <line x1="12" y1="0" x2="12" y2="140" stroke="#C99A45" strokeWidth="2.5" strokeLinecap="round" />
        {/* Center Prong */}
        <path d="M 12 0 L 12 -12" stroke="#E8C872" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left & Right Curved Prongs */}
        <path d="M 4 8 C 4 -6 12 -2 12 -2" stroke="#E8C872" strokeWidth="2" fill="none" />
        <path d="M 20 8 C 20 -6 12 -2 12 -2" stroke="#E8C872" strokeWidth="2" fill="none" />
        {/* Damru */}
        <polygon points="6,32 18,32 6,46 18,46" fill="#C99A45" stroke="#7A571A" strokeWidth="1" />
        <circle cx="12" cy="39" r="1.5" fill="#D85A32" />
      </g>

      {/* ================= MATA PARVATI (RIGHT) ================= */}
      {/* Parvati Bridal Gold Mukut */}
      <path
        d="M 126 55 L 140 28 L 154 55 Z"
        fill="url(#parvatiGold)"
        stroke="#A07628"
        strokeWidth="1.2"
      />
      <circle cx="140" cy="36" r="3" fill="#A0153E" />
      {/* Red Chunari (Bridal Veil) */}
      <path
        d="M 122 55 C 114 75 118 120 125 145 L 158 145 C 165 120 168 75 158 55 Z"
        fill="#A0153E"
        opacity="0.9"
        stroke="#C99A45"
        strokeWidth="1.5"
      />

      {/* Parvati Face */}
      <ellipse cx="140" cy="74" rx="14" ry="17" fill="#FFF7EB" stroke="#C99A45" strokeWidth="1.2" />
      {/* Bindi & Sindoor */}
      <circle cx="140" cy="65" r="2" fill="#D85A32" />
      {/* Beautiful Graceful Eyes */}
      <path d="M 133 74 Q 137 77 141 74" stroke="#541426" strokeWidth="1.2" fill="none" />
      <path d="M 141 74 Q 145 77 149 74" stroke="#541426" strokeWidth="1.2" fill="none" />
      {/* Nath (Nose Ring with chain) */}
      <circle cx="136" cy="78" r="2.5" stroke="#C99A45" strokeWidth="0.8" fill="none" />
      <path d="M 136 78 Q 132 74 130 70" stroke="#C99A45" strokeWidth="0.5" fill="none" />

      {/* Gold Bridal Jewellery & Mangalsutra */}
      <path d="M 130 90 Q 140 102 150 90" stroke="#C99A45" strokeWidth="2" fill="none" />
      <circle cx="140" cy="98" r="2.5" fill="#A0153E" />

      {/* Lotus in Hand */}
      <circle cx="160" cy="115" r="7" fill="#F3D9D5" stroke="#C99A45" strokeWidth="1" />

      {/* United Hands / Kalyana Hastamelap blessing */}
      <ellipse cx="110" cy="125" rx="14" ry="8" fill="#FFF7EB" stroke="#C99A45" strokeWidth="1.5" />
      <path d="M 102 125 Q 110 120 118 125" stroke="#A0153E" strokeWidth="1.5" />

      {/* Floral Base */}
      <rect x="50" y="160" width="120" height="12" rx="6" fill="#FFF9F0" stroke="#C99A45" strokeWidth="1" />
      <circle cx="110" cy="166" r="4" fill="#C99A45" />

      <defs>
        <radialGradient id="shivaAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF2D6" />
          <stop offset="100%" stopColor="#C99A45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="parvatiGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3DB" />
          <stop offset="50%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#C99A45" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ==========================================================================
   4. Shree Radha Krishna with Flute & Peacock Feather
   ========================================================================== */
export function RadhaKrishnaArtwork({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Bhagwan Shree Radha Krishna"
    >
      {/* Divine Vrindavan Starlight Moon Halo */}
      <circle cx="110" cy="90" r="85" fill="url(#vrindavanAura)" opacity="0.32" />
      <circle cx="110" cy="90" r="80" stroke="#C99A45" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

      {/* ================= KRISHNA (LEFT) ================= */}
      {/* Krishna Curly Dark Locks */}
      <ellipse cx="80" cy="55" rx="16" ry="14" fill="#1C212D" />
      {/* Mor Pankh (Peacock Feather Crown) */}
      <g transform="translate(68, 22)">
        <path d="M 12 28 Q 8 6 12 0 Q 16 6 12 28 Z" fill="#1B4D3E" />
        <ellipse cx="12" cy="10" rx="4.5" ry="7" fill="#1E56A0" />
        <circle cx="12" cy="10" r="2.5" fill="#E8C872" />
      </g>

      {/* Krishna Face (Shyam Varna - Divine Soft Blue Tone) */}
      <ellipse cx="82" cy="74" rx="15" ry="18" fill="#E3ECF9" stroke="#C99A45" strokeWidth="1.2" />
      {/* Tilak */}
      <path d="M 82 63 L 82 72" stroke="#E5A910" strokeWidth="1.5" />
      <circle cx="82" cy="74" r="1" fill="#D85A32" />
      {/* Enchanting Eyes */}
      <path d="M 76 74 Q 80 77 84 74" stroke="#1C212D" strokeWidth="1.2" fill="none" />
      <path d="M 83 74 Q 87 77 91 74" stroke="#1C212D" strokeWidth="1.2" fill="none" />

      {/* Golden Bansuri (Flute) */}
      <rect x="55" y="86" width="70" height="4.5" rx="2" fill="url(#fluteGold)" stroke="#A07628" strokeWidth="0.8" transform="rotate(-12 90 88)" />
      {/* Flute Holes & Tassels */}
      <circle cx="70" cy="88" r="0.8" fill="#541426" />
      <circle cx="76" cy="87" r="0.8" fill="#541426" />
      <circle cx="82" cy="86" r="0.8" fill="#541426" />
      <circle cx="88" cy="85" r="0.8" fill="#541426" />
      {/* Hanging pearl tassel from flute */}
      <path d="M 115 80 Q 118 90 114 98" stroke="#C99A45" strokeWidth="1" strokeDasharray="2 1" />
      <circle cx="114" cy="99" r="2" fill="#E8C872" />

      {/* ================= RADHA RANI (RIGHT) ================= */}
      {/* Radha Golden Crown & Flowers */}
      <path d="M 124 54 Q 138 32 152 54 Z" fill="#E8C872" stroke="#A07628" strokeWidth="1" />
      <circle cx="138" cy="44" r="3" fill="#D85A32" />

      {/* Radha Rani Fair Golden Complexion Face */}
      <ellipse cx="138" cy="74" rx="14" ry="17" fill="#FFF9F0" stroke="#C99A45" strokeWidth="1.2" />
      {/* Bindi & Chandan Dots */}
      <circle cx="138" cy="67" r="1.8" fill="#D85A32" />
      {/* Loving Gazing Eyes */}
      <path d="M 132 74 Q 136 77 140 74" stroke="#541426" strokeWidth="1.2" fill="none" />
      <path d="M 140 74 Q 144 77 148 74" stroke="#541426" strokeWidth="1.2" fill="none" />
      {/* Bridal Nath */}
      <circle cx="135" cy="78" r="2" stroke="#C99A45" strokeWidth="0.7" fill="none" />

      {/* Blue & Pink Dupatta draping together */}
      <path d="M 68 96 Q 110 135 152 96 L 158 140 Q 110 160 62 140 Z" fill="#FAF4EB" opacity="0.85" stroke="#C99A45" strokeWidth="1" />

      {/* Lotus Garland uniting Both */}
      <path d="M 72 105 Q 110 145 148 105" stroke="#F08092" strokeWidth="3" strokeDasharray="4 2" fill="none" />

      <defs>
        <radialGradient id="vrindavanAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF7E6" />
          <stop offset="60%" stopColor="#E8C872" />
          <stop offset="100%" stopColor="#C99A45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fluteGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E8C872" />
          <stop offset="50%" stopColor="#FFF3DB" />
          <stop offset="100%" stopColor="#C99A45" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ==========================================================================
   5. Auspicious Kamdhenu / Pichwai Holy Cow (Gau Mata)
   ========================================================================== */
export function PichwaiCowArtwork({
  className = 'w-20 h-16',
  facing = 'right',
}: {
  className?: string;
  facing?: 'left' | 'right';
}) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${facing === 'left' ? '-scale-x-100' : ''} ${className}`}
      aria-label="Pichwai Kamdhenu Holy Cow"
    >
      {/* Cow Body (Off-White / Sacred White) */}
      <path
        d="M 30 75 C 30 52 45 42 75 44 C 98 44 115 50 125 40 C 132 32 140 32 145 36 C 150 42 148 54 140 60 C 132 64 125 66 122 75 C 120 90 105 95 90 95 C 65 95 30 92 30 75 Z"
        fill="#FCFAF6"
        stroke="#C99A45"
        strokeWidth="1.5"
      />

      {/* Decorative Traditional Hand Prints / Floral Stamps on Body */}
      <circle cx="55" cy="65" r="4" fill="#D85A32" opacity="0.75" />
      <circle cx="75" cy="68" r="4" fill="#D85A32" opacity="0.75" />
      <circle cx="95" cy="66" r="4" fill="#D85A32" opacity="0.75" />

      {/* Golden Decorated Horns (Shringaar) */}
      <path d="M 136 34 Q 132 18 138 12 Q 140 22 142 32" fill="#E8C872" stroke="#A07628" strokeWidth="1" />
      <path d="M 144 34 Q 148 18 152 14 Q 150 24 148 34" fill="#E8C872" stroke="#A07628" strokeWidth="1" />

      {/* Cow Ears */}
      <ellipse cx="132" cy="42" rx="6" ry="3.5" fill="#F3D9D5" stroke="#C99A45" strokeWidth="0.8" transform="rotate(-15 132 42)" />

      {/* Loving Gentle Eye */}
      <ellipse cx="140" cy="44" rx="2.5" ry="3" fill="#1C212D" />
      <circle cx="140.5" cy="43" r="0.8" fill="#FFFFFF" />

      {/* Auspicious Muzzle */}
      <ellipse cx="148" cy="54" rx="5" ry="4" fill="#F3D9D5" stroke="#C99A45" strokeWidth="0.8" />

      {/* Ornate Ghungroo & Brass Bell Necklace */}
      <path
        d="M 125 55 Q 120 72 135 74"
        stroke="#C99A45"
        strokeWidth="2.5"
        strokeDasharray="3 2"
        fill="none"
      />
      <circle cx="127" cy="72" r="3.5" fill="#E8C872" stroke="#A07628" strokeWidth="0.7" />

      {/* Legs */}
      <rect x="42" y="86" width="7" height="26" rx="3.5" fill="#FCFAF6" stroke="#C99A45" strokeWidth="1.2" />
      <rect x="58" y="86" width="7" height="26" rx="3.5" fill="#FCFAF6" stroke="#C99A45" strokeWidth="1.2" />
      <rect x="96" y="86" width="7" height="26" rx="3.5" fill="#FCFAF6" stroke="#C99A45" strokeWidth="1.2" />
      <rect x="110" y="86" width="7" height="26" rx="3.5" fill="#FCFAF6" stroke="#C99A45" strokeWidth="1.2" />

      {/* Hooves */}
      <rect x="42" y="108" width="7" height="4" rx="1" fill="#781F35" />
      <rect x="58" y="108" width="7" height="4" rx="1" fill="#781F35" />
      <rect x="96" y="108" width="7" height="4" rx="1" fill="#781F35" />
      <rect x="110" y="108" width="7" height="4" rx="1" fill="#781F35" />

      {/* Elegant Curved Tail */}
      <path d="M 30 65 Q 18 80 22 98 Q 24 104 22 108" stroke="#C99A45" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="107" rx="3" ry="5" fill="#1C212D" />
    </svg>
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
