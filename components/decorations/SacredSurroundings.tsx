'use client';

import React from 'react';

/**
 * Natural Flowering Trees & Branches with Gentle Breeze Motion
 * Replaces cartoonish flowers with minimal, organic botanical tree branches,
 * realistic lanceolate leaves, and delicate 5-petal blossoms swaying in the breeze.
 */

/* Delicate 5-petal flower blossom with central golden stamen */
function BlossomFlower({
  cx,
  cy,
  size = 18,
  rotate = 0,
  opacity = 1,
}: {
  cx: number;
  cy: number;
  size?: number;
  rotate?: number;
  opacity?: number;
}) {
  const r = size / 2;
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotate})`} opacity={opacity}>
      {/* 5 soft overlapping petals with blush ivory gradient */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <path
          key={i}
          d={`M 0 0 C ${-r * 0.4} ${-r * 0.6}, ${-r * 0.5} ${-r * 1.1}, 0 ${-r * 1.15} C ${r * 0.5} ${-r * 1.1}, ${r * 0.4} ${-r * 0.6}, 0 0 Z`}
          fill="url(#blossomPetalGrad)"
          stroke="#C99A45"
          strokeWidth="0.4"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Stamen golden center with tiny crimson pistil */}
      <circle r={r * 0.28} fill="#E8C97A" stroke="#9E782F" strokeWidth="0.4" />
      <circle r={r * 0.12} fill="#A0153E" />
    </g>
  );
}

/* Delicate budding blossom on branch tip */
function BlossomBud({
  cx,
  cy,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotate})`}>
      {/* Calyx in sage green */}
      <path d="M -2 3 C -3 0, -1 -3, 0 -5 C 1 -3, 3 0, 2 3 Z" fill="#5B7A52" />
      {/* Bud tip in ivory blush */}
      <path
        d="M -1.5 -1 C -2 -4, 0 -7, 0 -7 C 0 -7, 2 -4, 1.5 -1 Z"
        fill="#FCECE9"
        stroke="#C99A45"
        strokeWidth="0.3"
      />
    </g>
  );
}

/* Realistic slender botanical leaf with midrib vein */
function NaturalLeaf({
  cx,
  cy,
  length = 15,
  angle = 0,
  color = '#5B7A52',
}: {
  cx: number;
  cy: number;
  length?: number;
  angle?: number;
  color?: string;
}) {
  const w = length * 0.42;
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
      <path
        d={`M 0 0 C ${-w} ${-length * 0.35}, ${-w * 0.8} ${-length * 0.75}, 0 ${-length} C ${w * 0.8} ${-length * 0.75}, ${w} ${-length * 0.35}, 0 0 Z`}
        fill={color}
        stroke="#3F5E36"
        strokeWidth="0.4"
        strokeOpacity="0.65"
      />
      {/* Delicate midrib line */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-length * 0.85}
        stroke="#8DA580"
        strokeWidth="0.5"
        strokeOpacity="0.8"
      />
    </g>
  );
}

/**
 * NaturalFloweringTree Component
 * Organic curving woody bark, slender twigs, leaves, and minimal blossoms
 */
function NaturalFloweringTree({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-14 sm:w-24 md:w-36 lg:w-48 h-auto opacity-75 select-none pointer-events-none filter drop-shadow-[0_4px_10px_rgba(74,48,29,0.14)] ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      <defs>
        {/* Soft Ivory to Warm Blush Pink Gradient for Petals */}
        <linearGradient id="blossomPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF4F1" />
          <stop offset="85%" stopColor="#F9D4CD" />
          <stop offset="100%" stopColor="#EFA89B" />
        </linearGradient>

        {/* Woody Bark Shading */}
        <linearGradient id="treeBarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A301D" />
          <stop offset="45%" stopColor="#6A4930" />
          <stop offset="80%" stopColor="#8A6342" />
          <stop offset="100%" stopColor="#C99A45" />
        </linearGradient>
      </defs>

      {/* ================= MAIN TRUNK / BOUGH ================= */}
      <path
        d="M 6 560 C 18 470, 28 390, 24 310 C 20 230, 38 140, 32 60 C 30 25, 38 10, 44 0"
        stroke="url(#treeBarkGrad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tapering inner highlight line */}
      <path
        d="M 8 560 C 20 470, 30 390, 26 310 C 22 230, 40 140, 34 60"
        stroke="#E8C97A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.65"
        fill="none"
      />

      {/* ================= BOUGH 1: LOWER SWEEPING BRANCH (y ~ 450) ================= */}
      <path
        d="M 24 450 C 50 435, 75 442, 105 425 C 120 415, 135 418, 148 408"
        stroke="#6A4930"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 65 440 C 78 420, 92 418, 102 405"
        stroke="#7A5438"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 105 425 C 118 438, 132 440, 142 450"
        stroke="#7A5438"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves on Bough 1 */}
      <NaturalLeaf cx={48} cy={440} length={14} angle={-25} color="#5B7A52" />
      <NaturalLeaf cx={62} cy={442} length={13} angle={35} color="#435E3B" />
      <NaturalLeaf cx={88} cy={422} length={13} angle={-30} color="#7A9A70" />
      <NaturalLeaf cx={100} cy={408} length={12} angle={-15} color="#5B7A52" />
      <NaturalLeaf cx={124} cy={435} length={12} angle={40} color="#435E3B" />
      <NaturalLeaf cx={140} cy={446} length={11} angle={25} color="#5B7A52" />
      {/* Minimal Blossoms on Bough 1 */}
      <BlossomFlower cx={102} cy={403} size={17} rotate={15} />
      <BlossomFlower cx={148} cy={408} size={18} rotate={-10} />
      <BlossomFlower cx={75} cy={425} size={14} rotate={35} opacity={0.9} />
      <BlossomBud cx={142} cy={450} rotate={35} />

      {/* ================= BOUGH 2: MID-LOWER LONG BRANCH (y ~ 340) ================= */}
      <path
        d="M 24 340 C 55 315, 88 322, 122 300 C 138 290, 150 292, 162 280"
        stroke="#6A4930"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 72 320 C 85 298, 102 295, 114 278"
        stroke="#7A5438"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 122 300 C 134 315, 148 318, 158 326"
        stroke="#7A5438"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves on Bough 2 */}
      <NaturalLeaf cx={45} cy={330} length={15} angle={-35} color="#435E3B" />
      <NaturalLeaf cx={68} cy={322} length={14} angle={25} color="#5B7A52" />
      <NaturalLeaf cx={94} cy={300} length={13} angle={-25} color="#7A9A70" />
      <NaturalLeaf cx={112} cy={280} length={12} angle={-40} color="#5B7A52" />
      <NaturalLeaf cx={138} cy={315} length={13} angle={35} color="#435E3B" />
      <NaturalLeaf cx={152} cy={324} length={11} angle={20} color="#7A9A70" />
      {/* Minimal Blossoms on Bough 2 */}
      <BlossomFlower cx={114} cy={276} size={18} rotate={-25} />
      <BlossomFlower cx={162} cy={278} size={19} rotate={10} />
      <BlossomFlower cx={86} cy={305} size={15} rotate={45} opacity={0.92} />
      <BlossomBud cx={158} cy={326} rotate={40} />
      <BlossomBud cx={138} cy={292} rotate={-15} />

      {/* ================= BOUGH 3: MID BRANCH (y ~ 235) ================= */}
      <path
        d="M 26 235 C 52 210, 80 216, 110 195 C 124 185, 136 186, 148 175"
        stroke="#6A4930"
        strokeWidth="2.0"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 68 215 C 80 195, 94 192, 104 178"
        stroke="#7A5438"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves on Bough 3 */}
      <NaturalLeaf cx={46} cy={225} length={14} angle={-25} color="#5B7A52" />
      <NaturalLeaf cx={62} cy={218} length={13} angle={30} color="#435E3B" />
      <NaturalLeaf cx={88} cy={198} length={12} angle={-35} color="#7A9A70" />
      <NaturalLeaf cx={122} cy={190} length={12} angle={25} color="#5B7A52" />
      <NaturalLeaf cx={138} cy={180} length={11} angle={-20} color="#435E3B" />
      {/* Minimal Blossoms on Bough 3 */}
      <BlossomFlower cx={104} cy={176} size={17} rotate={20} />
      <BlossomFlower cx={148} cy={173} size={18} rotate={-15} />
      <BlossomFlower cx={78} cy={206} size={14} rotate={-40} opacity={0.9} />
      <BlossomBud cx={128} cy={184} rotate={15} />

      {/* ================= BOUGH 4: UPPER BRANCH (y ~ 135) ================= */}
      <path
        d="M 32 135 C 55 115, 78 120, 102 102 C 114 92, 124 94, 132 84"
        stroke="#6A4930"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 68 118 C 78 100, 90 98, 98 86"
        stroke="#7A5438"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves on Bough 4 */}
      <NaturalLeaf cx={50} cy={125} length={13} angle={-30} color="#5B7A52" />
      <NaturalLeaf cx={66} cy={118} length={12} angle={25} color="#435E3B" />
      <NaturalLeaf cx={86} cy={102} length={12} angle={-25} color="#7A9A70" />
      <NaturalLeaf cx={114} cy={92} length={11} angle={20} color="#5B7A52" />
      {/* Minimal Blossoms on Bough 4 */}
      <BlossomFlower cx={98} cy={84} size={16} rotate={-10} />
      <BlossomFlower cx={132} cy={82} size={17} rotate={25} />
      <BlossomBud cx={118} cy={90} rotate={-20} />

      {/* ================= BOUGH 5: APEX SPROUTING TIP (y ~ 50) ================= */}
      <path
        d="M 34 50 C 50 35, 68 38, 86 24"
        stroke="#7A5438"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Leaves on Apex */}
      <NaturalLeaf cx={44} cy={42} length={12} angle={-35} color="#7A9A70" />
      <NaturalLeaf cx={62} cy={35} length={11} angle={20} color="#5B7A52" />
      <NaturalLeaf cx={78} cy={28} length={10} angle={-25} color="#435E3B" />
      {/* Apex Blossom & Tip Bud */}
      <BlossomFlower cx={86} cy={22} size={16} rotate={15} />
      <BlossomBud cx={44} cy={2} rotate={-10} />
    </svg>
  );
}

/* Elegant traditional brass temple bell hanging from top corner */
function HangingTempleBell({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        animation: `bellSwing 4.5s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transformOrigin: 'top center',
      }}
    >
      {/* Hanging Chain of Beads */}
      <div className="w-[1.5px] h-12 sm:h-16 bg-gradient-to-b from-antique-gold/20 via-antique-gold to-antique-gold flex flex-col items-center justify-around">
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
      </div>

      {/* Brass Bell Body */}
      <svg
        width="24"
        height="30"
        viewBox="0 0 28 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_6px_rgba(201,154,69,0.35)] -mt-1"
      >
        <circle cx="14" cy="3" r="2.5" stroke="#E8C872" strokeWidth="1.2" />
        <path
          d="M 14 5 C 9 5 8 13 6 20 C 5 24 3 26 3 28 C 3 30 7 30 14 30 C 21 30 25 30 25 28 C 25 26 23 24 22 20 C 20 13 19 5 14 5 Z"
          fill="url(#brassBellGlowNew)"
          stroke="#C99A45"
          strokeWidth="1"
        />
        <path d="M 6 20 C 10 22 18 22 22 20" stroke="#8A631E" strokeWidth="1" />
        <path d="M 4 27 C 9 29 19 29 24 27" stroke="#8A631E" strokeWidth="1" />
        <circle cx="14" cy="31" r="2" fill="#E8C872" stroke="#A07628" strokeWidth="0.5" />

        <defs>
          <linearGradient id="brassBellGlowNew" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF7E6" />
            <stop offset="40%" stopColor="#E8C872" />
            <stop offset="85%" stopColor="#C99A45" />
            <stop offset="100%" stopColor="#8A631E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function SacredSurroundings() {
  return (
    <>
      <style>{`
        @keyframes naturalTreeSwayLeft {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          33% {
            transform: rotate(1.6deg) skewX(0.7deg);
          }
          66% {
            transform: rotate(-0.5deg) skewX(-0.3deg);
          }
        }

        @keyframes naturalTreeSwayRight {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          33% {
            transform: rotate(-1.6deg) skewX(-0.7deg);
          }
          66% {
            transform: rotate(0.5deg) skewX(0.3deg);
          }
        }

        @keyframes bellSwing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(4deg);
          }
          75% {
            transform: rotate(-4deg);
          }
        }

        .animated-natural-tree-left {
          animation: naturalTreeSwayLeft 9s ease-in-out infinite;
          transform-origin: bottom left;
          will-change: transform;
        }

        .animated-natural-tree-right {
          animation: naturalTreeSwayRight 9.5s ease-in-out infinite;
          transform-origin: bottom right;
          will-change: transform;
        }
      `}</style>

      {/* ================= LEFT BORDER FLOWERING TREE SURROUNDINGS ================= */}
      <div className="fixed top-0 left-0 bottom-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
        {/* Top-Left Hanging Bells */}
        <div className="flex items-start gap-3 pl-1 sm:pl-4 pt-1">
          <HangingTempleBell delay={0} />
          <div className="hidden sm:block">
            <HangingTempleBell delay={1.4} />
          </div>
          <div className="hidden md:block">
            <HangingTempleBell delay={0.7} />
          </div>
        </div>

        {/* Lower-Left Minimal Natural Flowering Tree */}
        <div className="animated-natural-tree-left -ml-2 sm:ml-0 mb-6 sm:mb-14">
          <NaturalFloweringTree flip={false} />
        </div>
      </div>

      {/* ================= RIGHT BORDER FLOWERING TREE SURROUNDINGS ================= */}
      <div className="fixed top-0 right-0 bottom-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
        {/* Top-Right Hanging Bells */}
        <div className="flex items-start justify-end gap-3 pr-1 sm:pr-4 pt-1">
          <div className="hidden md:block">
            <HangingTempleBell delay={0.9} />
          </div>
          <div className="hidden sm:block">
            <HangingTempleBell delay={2.1} />
          </div>
          <HangingTempleBell delay={0.3} />
        </div>

        {/* Lower-Right Minimal Natural Flowering Tree */}
        <div className="animated-natural-tree-right -mr-2 sm:mr-0 mb-6 sm:mb-14 self-end">
          <NaturalFloweringTree flip={true} />
        </div>
      </div>
    </>
  );
}

export default SacredSurroundings;
