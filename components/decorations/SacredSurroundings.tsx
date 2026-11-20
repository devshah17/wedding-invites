'use client';

import React from 'react';

/**
 * Animated Sacred Border Trees (Pichwai / Kalpavriksha style) & Hanging Temple Wedding Bells
 * Provides aesthetic, elegant motion on the left and right borders of the invitation page
 */

function PichwaiTreeBranch({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-28 sm:w-36 md:w-44 lg:w-52 h-auto opacity-75 select-none pointer-events-none filter drop-shadow-[0_4px_8px_rgba(201,154,69,0.15)] ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      {/* Golden Trunk / Main Branch */}
      <path
        d="M 10 400 Q 18 300 24 220 Q 35 140 20 60 Q 14 20 28 0"
        stroke="#C99A45"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 12 400 Q 20 300 26 220 Q 36 140 22 60"
        stroke="#E8C872"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Primary Side Branches with Leaves & Blooming Flowers */}
      {/* Branch 1 */}
      <path
        d="M 22 310 Q 55 290 85 305"
        stroke="#C99A45"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="88" cy="305" r="7" fill="#F08092" stroke="#C99A45" strokeWidth="1" />
      <circle cx="88" cy="305" r="3" fill="#E8C872" />
      {/* Leaves on Branch 1 */}
      <ellipse cx="50" cy="296" rx="9" ry="4" fill="#6B8E5E" transform="rotate(-15 50 296)" />
      <ellipse cx="68" cy="298" rx="8" ry="4" fill="#59764B" transform="rotate(18 68 298)" />

      {/* Branch 2 */}
      <path
        d="M 24 230 Q 70 205 105 220"
        stroke="#C99A45"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="108" cy="220" r="9" fill="#A0153E" stroke="#C99A45" strokeWidth="1" />
      <circle cx="108" cy="220" r="4" fill="#FFF3DB" />
      {/* Lotus Buds on Branch 2 */}
      <path d="M 65 212 Q 72 198 80 210 Z" fill="#F3D9D5" stroke="#C99A45" strokeWidth="0.8" />
      <ellipse cx="45" cy="216" rx="10" ry="4.5" fill="#6B8E5E" transform="rotate(-10 45 216)" />
      <ellipse cx="88" cy="214" rx="9" ry="4" fill="#59764B" transform="rotate(15 88 214)" />

      {/* Branch 3 */}
      <path
        d="M 24 150 Q 60 130 92 140"
        stroke="#C99A45"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="95" cy="140" r="8" fill="#F08092" stroke="#C99A45" strokeWidth="1" />
      <circle cx="95" cy="140" r="3.5" fill="#E8C872" />
      <ellipse cx="48" cy="138" rx="8.5" ry="4" fill="#6B8E5E" transform="rotate(-18 48 138)" />
      <ellipse cx="72" cy="134" rx="8" ry="4" fill="#59764B" transform="rotate(12 72 134)" />

      {/* Branch 4 */}
      <path
        d="M 18 80 Q 55 60 80 72"
        stroke="#C99A45"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="82" cy="72" r="7" fill="#A0153E" stroke="#C99A45" strokeWidth="1" />
      <circle cx="82" cy="72" r="2.5" fill="#FFF3DB" />
      <ellipse cx="45" cy="68" rx="7.5" ry="3.5" fill="#6B8E5E" transform="rotate(-12 45 68)" />

      {/* Top Sprouting Blossom */}
      <circle cx="28" cy="4" r="6.5" fill="#E8C872" stroke="#A07628" strokeWidth="1" />
      <ellipse cx="18" cy="15" rx="7" ry="3.5" fill="#6B8E5E" transform="rotate(-35 18 15)" />
    </svg>
  );
}

function HangingTempleBell({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        animation: `bellSwing 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transformOrigin: 'top center',
      }}
    >
      {/* Hanging Chain of Beads */}
      <div className="w-[1.5px] h-14 sm:h-20 bg-gradient-to-b from-antique-gold/20 via-antique-gold to-antique-gold flex flex-col items-center justify-around">
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
        <div className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow-xs" />
      </div>

      {/* Brass Bell Body */}
      <svg
        width="26"
        height="32"
        viewBox="0 0 28 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_6px_rgba(201,154,69,0.35)] -mt-1"
      >
        <circle cx="14" cy="3" r="2.5" stroke="#E8C872" strokeWidth="1.2" />
        <path
          d="M 14 5 C 9 5 8 13 6 20 C 5 24 3 26 3 28 C 3 30 7 30 14 30 C 21 30 25 30 25 28 C 25 26 23 24 22 20 C 20 13 19 5 14 5 Z"
          fill="url(#brassBellGlow)"
          stroke="#C99A45"
          strokeWidth="1"
        />
        <path d="M 6 20 C 10 22 18 22 22 20" stroke="#8A631E" strokeWidth="1" />
        <path d="M 4 27 C 9 29 19 29 24 27" stroke="#8A631E" strokeWidth="1" />
        {/* Clapper knocker with bead */}
        <circle cx="14" cy="31" r="2" fill="#E8C872" stroke="#A07628" strokeWidth="0.5" />

        <defs>
          <linearGradient id="brassBellGlow" x1="0%" y1="0%" x2="100%" y2="100%">
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
        @keyframes treeSwayLeft {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          50% {
            transform: rotate(1.8deg) skewX(1deg);
          }
        }

        @keyframes treeSwayRight {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          50% {
            transform: rotate(-1.8deg) skewX(-1deg);
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

        .animated-tree-left {
          animation: treeSwayLeft 7s ease-in-out infinite;
          transform-origin: bottom left;
          will-change: transform;
        }

        .animated-tree-right {
          animation: treeSwayRight 8s ease-in-out infinite;
          transform-origin: bottom right;
          will-change: transform;
        }
      `}</style>

      {/* ================= LEFT BORDER SURROUNDINGS ================= */}
      <div className="fixed top-0 left-0 bottom-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
        {/* Top-Left Hanging Bells */}
        <div className="flex items-start gap-4 pl-2 sm:pl-4 pt-0">
          <HangingTempleBell delay={0} />
          <HangingTempleBell delay={1.4} />
          <div className="hidden sm:block">
            <HangingTempleBell delay={0.7} />
          </div>
        </div>

        {/* Mid/Lower-Left Animated Pichwai Kalpavriksha Tree */}
        <div className="animated-tree-left -ml-6 sm:-ml-2 mb-12 sm:mb-20">
          <PichwaiTreeBranch flip={false} />
        </div>
      </div>

      {/* ================= RIGHT BORDER SURROUNDINGS ================= */}
      <div className="fixed top-0 right-0 bottom-0 pointer-events-none z-20 flex flex-col justify-between overflow-hidden">
        {/* Top-Right Hanging Bells */}
        <div className="flex items-start justify-end gap-4 pr-2 sm:pr-4 pt-0">
          <div className="hidden sm:block">
            <HangingTempleBell delay={0.9} />
          </div>
          <HangingTempleBell delay={2.1} />
          <HangingTempleBell delay={0.3} />
        </div>

        {/* Mid/Lower-Right Animated Pichwai Kalpavriksha Tree */}
        <div className="animated-tree-right -mr-6 sm:-mr-2 mb-12 sm:mb-20 self-end">
          <PichwaiTreeBranch flip={true} />
        </div>
      </div>
    </>
  );
}

export default SacredSurroundings;
