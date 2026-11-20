'use client';

import React from 'react';

/**
 * Traditional Indian Wedding Canopy (Banana Tree Fronds, Top Marigold Toran,
 * Hanging Jasmine Strings with Lotus Drops & Swinging Brass Lamps)
 * Faithfully recreated from user's reference wedding invitation
 */

/* 1. Banana Tree Leaves (Kela ke Patte) arching downwards from top corners */
function BananaLeafFronds({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 220 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-20 sm:w-36 md:w-52 lg:w-72 h-auto filter drop-shadow-[0_4px_10px_rgba(49,87,44,0.3)] select-none pointer-events-none ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      <defs>
        <linearGradient id="bananaLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DA854" />
          <stop offset="45%" stopColor="#4F772D" />
          <stop offset="100%" stopColor="#254A21" />
        </linearGradient>

        <linearGradient id="bananaRibGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8C97F" />
          <stop offset="100%" stopColor="#31572C" />
        </linearGradient>
      </defs>

      {/* Main Arching Leaf 1 (Large Foreground Leaf) */}
      <g>
        <path
          d="M 10 0 C 15 45 42 110 92 165 C 132 208 178 240 185 242 C 170 222 152 170 120 122 C 92 80 50 25 10 0 Z"
          fill="url(#bananaLeafGrad)"
          stroke="#254A21"
          strokeWidth="1.2"
        />
        {/* Central Thick Leaf Midrib */}
        <path
          d="M 10 0 Q 65 95 185 242"
          stroke="url(#bananaRibGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Leaf Veins / Slits */}
        {[
          { x1: 30, y1: 30, x2: 12, y2: 45 },
          { x1: 52, y1: 65, x2: 30, y2: 88 },
          { x1: 80, y1: 110, x2: 55, y2: 135 },
          { x1: 112, y1: 152, x2: 88, y2: 180 },
          { x1: 145, y1: 195, x2: 125, y2: 218 },
          { x1: 40, y1: 42, x2: 60, y2: 22 },
          { x1: 68, y1: 85, x2: 95, y2: 60 },
          { x1: 100, y1: 132, x2: 132, y2: 105 },
          { x1: 130, y1: 175, x2: 165, y2: 152 },
        ].map((rib, i) => (
          <line
            key={i}
            x1={rib.x1}
            y1={rib.y1}
            x2={rib.x2}
            y2={rib.y2}
            stroke="#A8C97F"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />
        ))}
      </g>

      {/* Secondary Background Banana Leaf */}
      <g opacity="0.9">
        <path
          d="M 5 15 C 30 70 75 140 135 180 C 158 196 172 205 174 204 C 160 185 135 130 98 85 C 65 44 25 12 5 15 Z"
          fill="#3E6B24"
        />
        <path
          d="M 5 15 Q 85 105 174 204"
          stroke="#7DA854"
          strokeWidth="2.5"
          fill="none"
        />
      </g>
    </svg>
  );
}

/* 2. Top Marigold Toran Garland Festoon */
function TopMarigoldToran() {
  return (
    <div className="w-full flex items-center justify-between overflow-hidden pointer-events-none select-none">
      <svg
        viewBox="0 0 1000 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="marigoldOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFAA00" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="marigoldYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
        </defs>

        {/* Supporting Green Mango Leaf Festoon Arch Drops */}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
          <path
            key={`leaf-${x}`}
            d={`M ${x + 50} 0 C ${x + 44} 15, ${x + 46} 28, ${x + 50} 34 C ${x + 54} 28, ${x + 56} 15, ${x + 50} 0 Z`}
            fill="#3F6212"
            stroke="#1E3A8A"
            strokeWidth="0.3"
          />
        ))}

        {/* Draped Arch Catenary Curves */}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
          <path
            key={`arch-${x}`}
            d={`M ${x} 6 Q ${x + 50} 26 ${x + 100} 6`}
            stroke="#D97706"
            strokeWidth="3.5"
            fill="none"
          />
        ))}

        {/* Strung Orange & Yellow Marigold Flower Petal Clusters */}
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 1000) / 59;
          const archCenter = Math.floor(x / 100) * 100 + 50;
          const distFromCenter = Math.abs(x - archCenter) / 50;
          const y = 8 + (1 - distFromCenter * distFromCenter) * 16;
          const isOrange = i % 2 === 0;

          return (
            <g key={`flower-${i}`} transform={`translate(${x}, ${y})`}>
              <circle
                r={isOrange ? 5.5 : 4.5}
                fill={isOrange ? 'url(#marigoldOrange)' : 'url(#marigoldYellow)'}
                stroke="#78350F"
                strokeWidth="0.5"
              />
              <circle
                r={isOrange ? 2.5 : 2}
                fill="#FEF08A"
                opacity="0.85"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* 3. Hanging Jasmine (Mogra) Strings with Lotus Drops */
function HangingJasmineLotusString({ height = 240 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center">
      {/* White Jasmine Flower Beads String */}
      <svg
        width="14"
        height={height}
        viewBox={`0 0 14 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
      >
        <line x1="7" y1="0" x2="7" y2={height} stroke="#A8A29E" strokeWidth="0.8" />
        {Array.from({ length: Math.floor(height / 14) }).map((_, idx) => (
          <g key={idx} transform={`translate(7, ${idx * 14 + 7})`}>
            {/* Multi-petal white jasmine bud */}
            <circle r="4.2" fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="0.5" />
            <circle r="1.8" fill="#FACC15" opacity="0.6" />
          </g>
        ))}
      </svg>

      {/* Hanging Pink Lotus Bud at the Bottom */}
      <svg
        width="26"
        height="32"
        viewBox="0 0 26 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-mt-1 filter drop-shadow-[0_4px_6px_rgba(200,45,110,0.3)]"
      >
        <path
          d="M 13 0 C 6 8 4 20 8 26 C 11 30 15 30 18 26 C 22 20 20 8 13 0 Z"
          fill="url(#lotusDropGrad)"
        />
        {/* Calyx at top of lotus drop */}
        <path d="M 9 2 Q 13 7 17 2 Z" fill="#65A30D" />
        <defs>
          <linearGradient id="lotusDropGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* 4. Traditional Hanging Brass Deepam (Samai Diya) on Gold Chain */
function HangingBrassSamai({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        animation: 'samaiSwing 4.5s ease-in-out infinite',
        animationDelay: `${delay}s`,
        transformOrigin: 'top center',
      }}
    >
      {/* Hanging Brass Chain of Links */}
      <div className="w-[1.8px] h-20 sm:h-28 bg-gradient-to-b from-antique-gold/40 via-antique-gold to-antique-gold flex flex-col items-center justify-around">
        <div className="w-1.5 h-2 rounded-sm border border-antique-gold/80" />
        <div className="w-1.5 h-2 rounded-sm border border-antique-gold/80" />
        <div className="w-1.5 h-2 rounded-sm border border-antique-gold/80" />
      </div>

      {/* Traditional Brass Hanging Lamp / Diya with multiple tiers & bell */}
      <svg
        width="38"
        height="44"
        viewBox="0 0 38 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_6px_10px_rgba(180,130,40,0.4)] -mt-1"
      >
        <defs>
          <linearGradient id="samaiBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="80%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
        </defs>

        {/* Top Loop */}
        <circle cx="19" cy="4" r="3" stroke="#CA8A04" strokeWidth="1.5" />

        {/* Flame on Lamp */}
        <path
          d="M 19 6 Q 16 14 19 18 Q 22 14 19 6 Z"
          fill="#F59E0B"
        />
        <circle cx="19" cy="15" r="2" fill="#FEF08A" />

        {/* Wide Oil Dish / Basin */}
        <ellipse cx="19" cy="20" rx="17" ry="4.5" fill="url(#samaiBrass)" stroke="#78350F" strokeWidth="0.8" />
        <path
          d="M 3 20 C 5 28 12 32 19 32 C 26 32 33 28 35 20 Z"
          fill="url(#samaiBrass)"
          stroke="#78350F"
          strokeWidth="0.8"
        />

        {/* Decorative Ring Ridges */}
        <ellipse cx="19" cy="27" rx="10" ry="2.5" fill="#A16207" opacity="0.6" />

        {/* Bottom Hanging Bell Drop */}
        <path d="M 16 32 L 15 38 L 23 38 L 22 32 Z" fill="url(#samaiBrass)" />
        <circle cx="19" cy="40" r="2" fill="#CA8A04" />
      </svg>
    </div>
  );
}

export function TraditionalCanopy() {
  return (
    <>
      <style>{`
        @keyframes bananaSwayLeft {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes bananaSwayRight {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-2deg);
          }
        }

        @keyframes samaiSwing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(3.5deg);
          }
          75% {
            transform: rotate(-3.5deg);
          }
        }

        .banana-canopy-left {
          animation: bananaSwayLeft 7s ease-in-out infinite;
          transform-origin: top left;
          will-change: transform;
        }

        .banana-canopy-right {
          animation: bananaSwayRight 7.5s ease-in-out infinite;
          transform-origin: top right;
          will-change: transform;
        }
      `}</style>

      {/* ================= 1. TOP MARIGOLD TORAN GARLAND ================= */}
      <div className="fixed top-0 inset-x-0 z-35 pointer-events-none select-none">
        <TopMarigoldToran />
      </div>

      {/* ================= 2. TOP-LEFT BANANA FRONDS & HANGING LAMPS ================= */}
      <div className="fixed top-0 left-0 z-30 pointer-events-none select-none flex items-start">
        {/* Swaying Banana Fronds */}
        <div className="banana-canopy-left -ml-2 -mt-2">
          <BananaLeafFronds flip={false} />
        </div>

        {/* Hanging Jasmine Lotus String */}
        <div className="hidden sm:block ml-2 -mt-1">
          <HangingJasmineLotusString height={200} />
        </div>

        {/* Hanging Brass Samai Diya */}
        <div className="ml-1 sm:ml-6 -mt-2 scale-75 sm:scale-100 origin-top">
          <HangingBrassSamai delay={0} />
        </div>
      </div>

      {/* ================= 3. TOP-RIGHT BANANA FRONDS & HANGING LAMPS ================= */}
      <div className="fixed top-0 right-0 z-30 pointer-events-none select-none flex items-start justify-end">
        {/* Hanging Brass Samai Diya */}
        <div className="mr-1 sm:mr-6 -mt-2 scale-75 sm:scale-100 origin-top">
          <HangingBrassSamai delay={1.8} />
        </div>

        {/* Hanging Jasmine Lotus String */}
        <div className="hidden sm:block mr-2 -mt-1">
          <HangingJasmineLotusString height={200} />
        </div>

        {/* Swaying Banana Fronds */}
        <div className="banana-canopy-right -mr-2 -mt-2">
          <BananaLeafFronds flip={true} />
        </div>
      </div>
    </>
  );
}

export default TraditionalCanopy;
