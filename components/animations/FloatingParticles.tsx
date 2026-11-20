'use client';

import React, { useEffect, useState } from 'react';

export interface FloatingParticlesProps {
  /** Number of floating gold particles (default: 25) */
  count?: number;
  /** Optional custom CSS class name */
  className?: string;
}

interface ParticleConfig {
  id: number;
  left: number; // percentage (0 - 100)
  top: number; // percentage (0 - 100)
  size: number; // px (2 - 6)
  color: string;
  duration: number; // seconds (5 - 12)
  delay: number; // seconds (0 - 6)
  driftX: number; // px (-20 to +20)
  driftY: number; // px (-40 to -90)
  maxOpacity: number; // 0.2 - 0.5
  glow: boolean;
}

const GOLD_SHADES = [
  '#C99A45', // Antique Gold
  '#E8C872', // Light Gold
  '#F5C518', // Sun Gold
  '#E2CA9D', // Champagne Gold
];

export function FloatingParticles({
  count = 25,
  className = '',
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Page Visibility API to pause animations when tab is not active
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Generate randomized particles deterministically on client mount
    const generated: ParticleConfig[] = Array.from({ length: count }, (_, i) => {
      const size = +(2 + Math.random() * 4).toFixed(1); // 2 - 6px
      const duration = +(5 + Math.random() * 7).toFixed(1); // 5 - 12s
      const delay = +(Math.random() * 6).toFixed(1); // 0 - 6s
      const driftX = +(-20 + Math.random() * 40).toFixed(1); // -20 to 20px
      const driftY = +(-40 - Math.random() * 50).toFixed(1); // -40 to -90px
      const maxOpacity = +(0.2 + Math.random() * 0.3).toFixed(2); // 0.2 - 0.5
      const color = GOLD_SHADES[i % GOLD_SHADES.length];
      const left = +(Math.random() * 100).toFixed(1);
      const top = +(10 + Math.random() * 85).toFixed(1);
      const glow = Math.random() > 0.4;

      return {
        id: i,
        left,
        top,
        size,
        color,
        duration,
        delay,
        driftX,
        driftY,
        maxOpacity,
        glow,
      };
    });

    setParticles(generated);
    setMounted(true);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [count]);

  // If reduced motion is requested or before mount, render nothing
  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes goldenParticleFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: var(--particle-opacity, 0.4);
          }
          80% {
            opacity: var(--particle-opacity, 0.4);
          }
          100% {
            transform: translate3d(var(--drift-x, 15px), var(--drift-y, -60px), 0);
            opacity: 0;
          }
        }
      `}</style>
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={
              {
                position: 'absolute',
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: p.glow
                  ? `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 3}px rgba(232, 200, 114, 0.5)`
                  : 'none',
                '--particle-opacity': p.maxOpacity,
                '--drift-x': `${p.driftX}px`,
                '--drift-y': `${p.driftY}px`,
                animation: `goldenParticleFloat ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
                willChange: 'transform, opacity',
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}

export default FloatingParticles;
