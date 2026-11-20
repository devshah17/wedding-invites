'use client';

import React from 'react';

/**
 * Blooming Indian Pink Lotus Flowers & Botanical Sprigs
 * Faithfully recreated from reference wedding invitation artwork
 */

function LotusFlower({ size = 110, rotate = 0 }: { size?: number; rotate?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.95)}
      viewBox="0 0 160 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
      className="filter drop-shadow-[0_4px_8px_rgba(200,45,110,0.25)] select-none pointer-events-none"
    >
      <defs>
        {/* Deep Magenta to Soft Lotus Pink Linear Gradient */}
        <linearGradient id="lotusOuterPetal" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#A0153E" />
          <stop offset="25%" stopColor="#C82D6E" />
          <stop offset="70%" stopColor="#E85D9E" />
          <stop offset="100%" stopColor="#FFF0F5" />
        </linearGradient>

        <linearGradient id="lotusInnerPetal" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C82D6E" />
          <stop offset="50%" stopColor="#F078AB" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="lotusStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B9080" />
          <stop offset="100%" stopColor="#31572C" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <path
        d="M 80 135 Q 76 148 70 160"
        stroke="url(#lotusStem)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Outermost Layer of Petals (Flared Out) */}
      {/* Far Left Flared Petal */}
      <path
        d="M 72 125 C 40 120 10 95 16 68 C 24 55 45 70 65 98 Z"
        fill="url(#lotusOuterPetal)"
        opacity="0.95"
      />
      {/* Far Right Flared Petal */}
      <path
        d="M 88 125 C 120 120 150 95 144 68 C 136 55 115 70 95 98 Z"
        fill="url(#lotusOuterPetal)"
        opacity="0.95"
      />

      {/* Second Layer of Petals */}
      {/* Mid Left Petal */}
      <path
        d="M 76 126 C 45 110 28 75 42 45 C 55 40 70 65 78 102 Z"
        fill="url(#lotusOuterPetal)"
      />
      {/* Mid Right Petal */}
      <path
        d="M 84 126 C 115 110 132 75 118 45 C 105 40 90 65 82 102 Z"
        fill="url(#lotusOuterPetal)"
      />

      {/* Inner Layer Petals (Rising Upwards) */}
      {/* Left Center Petal */}
      <path
        d="M 78 126 C 58 98 52 50 68 25 C 78 28 82 60 80 110 Z"
        fill="url(#lotusInnerPetal)"
      />
      {/* Right Center Petal */}
      <path
        d="M 82 126 C 102 98 108 50 92 25 C 82 28 78 60 80 110 Z"
        fill="url(#lotusInnerPetal)"
      />

      {/* Apex Center Bud Petal */}
      <path
        d="M 80 125 C 70 95 68 45 80 12 C 92 45 90 95 80 125 Z"
        fill="url(#lotusInnerPetal)"
      />

      {/* Lotus Golden Stamen Core Glow */}
      <ellipse cx="80" cy="118" rx="8" ry="4" fill="#E5A910" opacity="0.85" />
    </svg>
  );
}

function SageFoliageSprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="130"
      height="110"
      viewBox="0 0 130 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`opacity-70 select-none pointer-events-none filter drop-shadow-xs ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      {/* Central slender woody branch */}
      <path
        d="M 10 95 Q 45 80 85 55 Q 110 35 125 15"
        stroke="#A08E77"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M 45 80 Q 55 50 70 30"
        stroke="#A08E77"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 75 62 Q 95 68 115 58"
        stroke="#A08E77"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Delicate Eucalyptus/Sage leaves in dusty sage green */}
      {[
        { cx: 30, cy: 84, r: 8, angle: -20 },
        { cx: 40, cy: 75, r: 7.5, angle: 25 },
        { cx: 58, cy: 68, r: 8.5, angle: -30 },
        { cx: 62, cy: 50, r: 8, angle: 35 },
        { cx: 70, cy: 35, r: 7.5, angle: -15 },
        { cx: 78, cy: 26, r: 7, angle: 20 },
        { cx: 90, cy: 52, r: 8, angle: -25 },
        { cx: 104, cy: 62, r: 7.5, angle: 30 },
        { cx: 115, cy: 56, r: 7, angle: -10 },
        { cx: 100, cy: 40, r: 7.5, angle: 25 },
        { cx: 114, cy: 28, r: 6.5, angle: -20 },
        { cx: 125, cy: 15, r: 6, angle: 15 },
      ].map((leaf, idx) => (
        <ellipse
          key={idx}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.r}
          ry={leaf.r * 0.45}
          fill="#8DA599"
          stroke="#5E7569"
          strokeWidth="0.5"
          transform={`rotate(${leaf.angle} ${leaf.cx} ${leaf.cy})`}
        />
      ))}
    </svg>
  );
}

export function BloomingLotusCorners() {
  return (
    <>
      <style>{`
        @keyframes lotusFloatLeft {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-3px, -5px) rotate(-1.5deg);
          }
        }

        @keyframes lotusFloatRight {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(3px, -5px) rotate(1.5deg);
          }
        }

        .lotus-corner-left {
          animation: lotusFloatLeft 6s ease-in-out infinite;
          will-change: transform;
        }

        .lotus-corner-right {
          animation: lotusFloatRight 6.5s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* ================= BOTTOM-LEFT CORNER LOTUS CLUSTER ================= */}
      <div className="fixed bottom-0 left-0 pointer-events-none select-none z-25 flex items-end">
        <div className="lotus-corner-left relative -ml-4 sm:-ml-2 -mb-2 sm:-mb-1">
          {/* Sage Leaf Sprig Behind */}
          <div className="absolute -top-12 left-4 sm:left-8">
            <SageFoliageSprig flip={false} />
          </div>

          <div className="flex items-end">
            {/* Primary Blooming Pink Lotus */}
            <div className="relative z-10">
              <LotusFlower size={145} rotate={-10} />
            </div>

            {/* Secondary Flanking Lotus */}
            <div className="relative -ml-12 mb-4 hidden sm:block opacity-90">
              <LotusFlower size={105} rotate={15} />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM-RIGHT CORNER LOTUS CLUSTER ================= */}
      <div className="fixed bottom-0 right-0 pointer-events-none select-none z-25 flex items-end justify-end">
        <div className="lotus-corner-right relative -mr-4 sm:-mr-2 -mb-2 sm:-mb-1">
          {/* Sage Leaf Sprig Behind */}
          <div className="absolute -top-12 right-4 sm:right-8">
            <SageFoliageSprig flip={true} />
          </div>

          <div className="flex items-end justify-end">
            {/* Secondary Flanking Lotus */}
            <div className="relative -mr-12 mb-4 hidden sm:block opacity-90">
              <LotusFlower size={105} rotate={-15} />
            </div>

            {/* Primary Blooming Pink Lotus */}
            <div className="relative z-10">
              <LotusFlower size={145} rotate={10} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BloomingLotusCorners;
