'use client';

import React, { useEffect, useState } from 'react';

export interface MarigoldDecorationsProps {
  /** Garland position: 'left' or 'right' for vertical edge garlands, 'top' for horizontal draped toran */
  position: 'left' | 'right' | 'top';
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Detailed SVG Marigold Flower Component
 * Renders concentric rings of ruffled petals in rich orange and golden-yellow
 * with authentic floral paths and mango leaf accents.
 */
function MarigoldBloom({
  x,
  y,
  scale = 1,
  rotation = 0,
  showLeaves = true,
  leafAngles = [-35, 35],
}: {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  showLeaves?: boolean;
  leafAngles?: number[];
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Mango Leaf Accents (Aam ke Patte) behind the bloom */}
      {showLeaves && (
        <g opacity="0.95">
          {leafAngles.map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle})`}>
              {/* Mango Leaf Body */}
              <path
                d="M 0 0 C 14 -16, 28 -24, 44 -22 C 38 -10, 24 -2, 0 0 Z"
                fill="#59764B"
                stroke="#3F5735"
                strokeWidth="0.75"
              />
              {/* Leaf Midrib Vein */}
              <path
                d="M 0 0 C 18 -10, 32 -16, 44 -22"
                stroke="#7FA86C"
                strokeWidth="0.75"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ))}
        </g>
      )}

      {/* Flower Calyx / Sepal base */}
      <circle cx="0" cy="0" r="16" fill="#4B653E" opacity="0.7" />

      {/* Tier 1: Outer Petal Ring (12 Ruffled Petals in Deep Orange) */}
      <g>
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`outer-${i}`}
            d="M -7 -15 C -8 -21, -4 -25, 0 -25 C 4 -25, 8 -21, 7 -15 C 5 -10, -5 -10, -7 -15 Z"
            fill="#E8871E"
            stroke="#D85A32"
            strokeWidth="0.6"
            transform={`rotate(${i * 30})`}
          />
        ))}
      </g>

      {/* Tier 2: Middle Petal Ring (10 Scalloped Ruffles in Radiant Gold) */}
      <g>
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={`mid-${i}`}
            d="M -5 -10 C -7 -16, -3 -19, 0 -19 C 3 -19, 7 -16, 5 -10 C 4 -6, -4 -6, -5 -10 Z"
            fill="#F5C518"
            stroke="#E8871E"
            strokeWidth="0.5"
            transform={`rotate(${i * 36 + 18})`}
          />
        ))}
      </g>

      {/* Tier 3: Inner Petal Ring (8 Dense Ruffles in Sunny Yellow) */}
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={`inner-${i}`}
            d="M -4 -6 C -5 -11, -2 -13, 0 -13 C 2 -13, 5 -11, 4 -6 C 3 -3, -3 -3, -4 -6 Z"
            fill="#FFE066"
            stroke="#F5C518"
            strokeWidth="0.5"
            transform={`rotate(${i * 45 + 10})`}
          />
        ))}
      </g>

      {/* Tier 4: Center Core (Crimped Texture) */}
      <circle cx="0" cy="0" r="5" fill="#F5C518" />
      <circle cx="0" cy="0" r="2.8" fill="#D85A32" />
      <circle cx="0" cy="0" r="1.2" fill="#FFE066" />
    </g>
  );
}

/**
 * Golden Bead / Bell Pendant
 */
function BellPendant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Golden Thread */}
      <line x1="0" y1="-14" x2="0" y2="0" stroke="#C99A45" strokeWidth="1.2" />
      {/* Bead */}
      <circle cx="0" cy="2" r="3" fill="#E8C872" stroke="#C99A45" strokeWidth="0.5" />
      {/* Bell / Ghungroo Dome */}
      <path
        d="M -5 7 C -5 4, 5 4, 5 7 L 6 12 C 6 13, -6 13, -6 12 Z"
        fill="#C99A45"
        stroke="#A07628"
        strokeWidth="0.6"
      />
      {/* Bell Rim */}
      <ellipse cx="0" cy="12" rx="6" ry="1.5" fill="#E8C872" stroke="#A07628" strokeWidth="0.5" />
      {/* Clapper Dot */}
      <circle cx="0" cy="14" r="1.2" fill="#541426" />
    </g>
  );
}

export function MarigoldDecorations({
  position,
  className = '',
}: MarigoldDecorationsProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes garlandSwayLeft {
          0% {
            transform: rotate(-1.5deg);
          }
          100% {
            transform: rotate(1.2deg);
          }
        }
        @keyframes garlandSwayRight {
          0% {
            transform: rotate(1.5deg);
          }
          100% {
            transform: rotate(-1.2deg);
          }
        }
        @keyframes garlandSwayTop {
          0% {
            transform: translateY(0px) scaleY(1);
          }
          100% {
            transform: translateY(2.5px) scaleY(1.015);
          }
        }
      `}</style>

      {/* LEFT VERTICAL GARLAND */}
      {position === 'left' && (
        <div
          className={`fixed top-0 bottom-0 left-0 z-20 pointer-events-none w-20 sm:w-24 md:w-28 h-full select-none ${className}`}
          aria-hidden="true"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '28px 0',
              animation: prefersReducedMotion
                ? 'none'
                : 'garlandSwayLeft 6.5s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox="0 0 100 800"
              preserveAspectRatio="xMinYMin slice"
              className="w-full h-full overflow-visible drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connecting Green Garland Vine */}
              <path
                d="M 28 0 C 30 70, 24 130, 28 170 C 32 220, 24 280, 28 340 C 32 400, 24 460, 28 510 C 32 570, 25 630, 28 680 L 28 730"
                stroke="#59764B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 28 0 C 26 70, 32 130, 28 170 C 24 220, 32 280, 28 340 C 24 400, 32 460, 28 510 C 24 570, 31 630, 28 680 L 28 730"
                stroke="#C99A45"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />

              {/* 5 Marigold Flower Clusters */}
              {/* Cluster 1 (Top) */}
              <g>
                <MarigoldBloom
                  x={28}
                  y={60}
                  scale={0.95}
                  rotation={15}
                  showLeaves={true}
                  leafAngles={[-40, 30, 80]}
                />
                <MarigoldBloom
                  x={44}
                  y={88}
                  scale={0.65}
                  rotation={-25}
                  showLeaves={true}
                  leafAngles={[45, 95]}
                />
              </g>

              {/* Cluster 2 */}
              <g>
                <MarigoldBloom
                  x={28}
                  y={210}
                  scale={1.05}
                  rotation={-10}
                  showLeaves={true}
                  leafAngles={[-50, 25, 75]}
                />
                <MarigoldBloom
                  x={46}
                  y={238}
                  scale={0.68}
                  rotation={40}
                  showLeaves={true}
                  leafAngles={[40, 100]}
                />
              </g>

              {/* Cluster 3 (Middle) */}
              <g>
                <MarigoldBloom
                  x={28}
                  y={370}
                  scale={1.0}
                  rotation={20}
                  showLeaves={true}
                  leafAngles={[-45, 35, 85]}
                />
                <MarigoldBloom
                  x={45}
                  y={398}
                  scale={0.65}
                  rotation={-30}
                  showLeaves={true}
                  leafAngles={[35, 90]}
                />
              </g>

              {/* Cluster 4 */}
              <g>
                <MarigoldBloom
                  x={28}
                  y={530}
                  scale={1.05}
                  rotation={-15}
                  showLeaves={true}
                  leafAngles={[-55, 30, 80]}
                />
                <MarigoldBloom
                  x={46}
                  y={558}
                  scale={0.68}
                  rotation={35}
                  showLeaves={true}
                  leafAngles={[45, 95]}
                />
              </g>

              {/* Cluster 5 (Bottom) with Golden Bell */}
              <g>
                <MarigoldBloom
                  x={28}
                  y={690}
                  scale={0.95}
                  rotation={10}
                  showLeaves={true}
                  leafAngles={[-40, 25, 75]}
                />
                <BellPendant x={28} y={740} />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* RIGHT VERTICAL GARLAND */}
      {position === 'right' && (
        <div
          className={`fixed top-0 bottom-0 right-0 z-20 pointer-events-none w-20 sm:w-24 md:w-28 h-full select-none ${className}`}
          aria-hidden="true"
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transformOrigin: '72px 0',
              animation: prefersReducedMotion
                ? 'none'
                : 'garlandSwayRight 7s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox="0 0 100 800"
              preserveAspectRatio="xMaxYMin slice"
              className="w-full h-full overflow-visible drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connecting Green Garland Vine */}
              <path
                d="M 72 0 C 70 70, 76 130, 72 170 C 68 220, 76 280, 72 340 C 68 400, 76 460, 72 510 C 68 570, 75 630, 72 680 L 72 730"
                stroke="#59764B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 72 0 C 74 70, 68 130, 72 170 C 76 220, 68 280, 72 340 C 76 400, 68 460, 72 510 C 76 570, 69 630, 72 680 L 72 730"
                stroke="#C99A45"
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />

              {/* 5 Marigold Flower Clusters */}
              {/* Cluster 1 (Top) */}
              <g>
                <MarigoldBloom
                  x={72}
                  y={60}
                  scale={0.95}
                  rotation={-15}
                  showLeaves={true}
                  leafAngles={[40, -30, -80]}
                />
                <MarigoldBloom
                  x={56}
                  y={88}
                  scale={0.65}
                  rotation={25}
                  showLeaves={true}
                  leafAngles={[-45, -95]}
                />
              </g>

              {/* Cluster 2 */}
              <g>
                <MarigoldBloom
                  x={72}
                  y={210}
                  scale={1.05}
                  rotation={10}
                  showLeaves={true}
                  leafAngles={[50, -25, -75]}
                />
                <MarigoldBloom
                  x={54}
                  y={238}
                  scale={0.68}
                  rotation={-40}
                  showLeaves={true}
                  leafAngles={[-40, -100]}
                />
              </g>

              {/* Cluster 3 (Middle) */}
              <g>
                <MarigoldBloom
                  x={72}
                  y={370}
                  scale={1.0}
                  rotation={-20}
                  showLeaves={true}
                  leafAngles={[45, -35, -85]}
                />
                <MarigoldBloom
                  x={55}
                  y={398}
                  scale={0.65}
                  rotation={30}
                  showLeaves={true}
                  leafAngles={[-35, -90]}
                />
              </g>

              {/* Cluster 4 */}
              <g>
                <MarigoldBloom
                  x={72}
                  y={530}
                  scale={1.05}
                  rotation={15}
                  showLeaves={true}
                  leafAngles={[55, -30, -80]}
                />
                <MarigoldBloom
                  x={54}
                  y={558}
                  scale={0.68}
                  rotation={-35}
                  showLeaves={true}
                  leafAngles={[-45, -95]}
                />
              </g>

              {/* Cluster 5 (Bottom) with Golden Bell */}
              <g>
                <MarigoldBloom
                  x={72}
                  y={690}
                  scale={0.95}
                  rotation={-10}
                  showLeaves={true}
                  leafAngles={[40, -25, -75]}
                />
                <BellPendant x={72} y={740} />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* TOP HORIZONTAL DRAPED TORAN GARLAND */}
      {position === 'top' && (
        <div
          className={`absolute top-0 left-0 right-0 z-20 pointer-events-none w-full overflow-hidden select-none ${className}`}
          aria-hidden="true"
        >
          <div
            style={{
              width: '100%',
              transformOrigin: 'top center',
              animation: prefersReducedMotion
                ? 'none'
                : 'garlandSwayTop 5.5s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          >
            <svg
              viewBox="0 0 1200 130"
              preserveAspectRatio="xMidYMin slice"
              className="w-full h-20 sm:h-24 md:h-28 overflow-visible drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top Golden Border Strand */}
              <line
                x1="0"
                y1="12"
                x2="1200"
                y2="12"
                stroke="#C99A45"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="15"
                x2="1200"
                y2="15"
                stroke="#59764B"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />

              {/* 4 Draped Swag Arcs (Festoon Curves) across 1200px:
                  Swag 1: 0 -> 300 (dip at 150, y=70)
                  Swag 2: 300 -> 600 (dip at 450, y=70)
                  Swag 3: 600 -> 900 (dip at 750, y=70)
                  Swag 4: 900 -> 1200 (dip at 1050, y=70)
              */}
              <path
                d="M 0 14 Q 150 78, 300 14"
                stroke="#59764B"
                strokeWidth="2.2"
                fill="none"
              />
              <path
                d="M 300 14 Q 450 78, 600 14"
                stroke="#59764B"
                strokeWidth="2.2"
                fill="none"
              />
              <path
                d="M 600 14 Q 750 78, 900 14"
                stroke="#59764B"
                strokeWidth="2.2"
                fill="none"
              />
              <path
                d="M 900 14 Q 1050 78, 1200 14"
                stroke="#59764B"
                strokeWidth="2.2"
                fill="none"
              />

              {/* Mango Leaves hanging along the draped swags */}
              {[
                { x: 75, y: 38, rot: 15 },
                { x: 225, y: 38, rot: -15 },
                { x: 375, y: 38, rot: 15 },
                { x: 525, y: 38, rot: -15 },
                { x: 675, y: 38, rot: 15 },
                { x: 825, y: 38, rot: -15 },
                { x: 975, y: 38, rot: 15 },
                { x: 1125, y: 38, rot: -15 },
              ].map((leaf, idx) => (
                <g
                  key={`top-leaf-${idx}`}
                  transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot + 90})`}
                >
                  <path
                    d="M 0 0 C 8 -12, 16 -18, 26 -16 C 22 -8, 14 -2, 0 0 Z"
                    fill="#59764B"
                    stroke="#3F5735"
                    strokeWidth="0.6"
                  />
                </g>
              ))}

              {/* Mid-dip Marigold Blooms (Center of each draped arc) */}
              <MarigoldBloom
                x={150}
                y={68}
                scale={0.78}
                rotation={5}
                showLeaves={true}
                leafAngles={[-30, 30]}
              />
              <MarigoldBloom
                x={450}
                y={68}
                scale={0.78}
                rotation={-8}
                showLeaves={true}
                leafAngles={[-30, 30]}
              />
              <MarigoldBloom
                x={750}
                y={68}
                scale={0.78}
                rotation={12}
                showLeaves={true}
                leafAngles={[-30, 30]}
              />
              <MarigoldBloom
                x={1050}
                y={68}
                scale={0.78}
                rotation={-5}
                showLeaves={true}
                leafAngles={[-30, 30]}
              />

              {/* Anchor Node Marigold Clusters & Hanging Drops (x = 0, 300, 600, 900, 1200) */}
              {[0, 300, 600, 900, 1200].map((anchorX, idx) => (
                <g key={`anchor-${idx}`}>
                  {/* Anchor Hanging Cord */}
                  <line
                    x1={anchorX}
                    y1={14}
                    x2={anchorX}
                    y2={85}
                    stroke="#59764B"
                    strokeWidth="1.8"
                  />
                  <line
                    x1={anchorX}
                    y1={14}
                    x2={anchorX}
                    y2={85}
                    stroke="#C99A45"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                  />

                  {/* Primary Anchor Marigold */}
                  <MarigoldBloom
                    x={anchorX}
                    y={18}
                    scale={0.92}
                    rotation={idx * 15}
                    showLeaves={true}
                    leafAngles={[-45, 45, 180]}
                  />

                  {/* Secondary Drop Marigold */}
                  <MarigoldBloom
                    x={anchorX}
                    y={62}
                    scale={0.65}
                    rotation={idx * -20}
                    showLeaves={true}
                    leafAngles={[-35, 35]}
                  />

                  {/* Hanging Bell / Bead */}
                  <BellPendant x={anchorX} y={92} />
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

export default MarigoldDecorations;
