'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalligraphyGanesha } from '@/components/sacred/CalligraphyGanesha';

export interface Royal3DMedallionProps {
  className?: string;
  size?: number; // Size in px (default: 130)
}

/**
 * Royal3DMedallion Component
 * A luxurious, interactive 3D ceremonial gold medallion featuring:
 * - Pure hardware-accelerated CSS 3D transforms (preserve-3d, translateZ layers)
 * - Front face: Auspicious Lord Shree Ganesha in relief with Sanskrit mantra
 * - Back face: Royal "D & V" monogram with the auspicious wedding date
 * - Interactive: Responsive pointer tilt & specular light sheen, and tap/click to flip in 3D
 * - Eye-catching yet subtle: Ambient floating shimmer with gold bevel luster
 */
export function Royal3DMedallion({ className = '', size = 130 }: Royal3DMedallionProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle pointer tracking for 3D tilt and specular highlight
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Up to 14 degrees of physical tilt
    const rotateX = -((y - centerY) / centerY) * 14;
    const rotateY = ((x - centerX) / centerX) * 14;
    const sheenX = Math.round((x / rect.width) * 100);
    const sheenY = Math.round((y / rect.height) * 100);

    setTilt({ rotateX, rotateY, sheenX, sheenY });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        aria-label="3D Royal Gold Medallion - Click or tap to flip"
        className="relative cursor-pointer group focus:outline-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Ambient Subtle 3D Floating & Hover Glow Container */}
        <div
          className="w-full h-full relative transition-transform duration-200 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${
              tilt.rotateY + (isFlipped ? 180 : 0)
            }deg)`,
            transition: isHovered
              ? 'transform 0.1s ease-out'
              : 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Outer Ambient Gold Glow Behind Medallion */}
          <div
            className="absolute inset-[-10px] rounded-full pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-90 blur-md"
            style={{
              background:
                'radial-gradient(circle, rgba(232, 201, 122, 0.45) 0%, rgba(201, 154, 69, 0.2) 60%, transparent 80%)',
            }}
          />

          {/* ========================================================== */}
          {/* FRONT FACE: Sacred Lord Shree Ganesha in 3D Gold Relief     */}
          {/* ========================================================== */}
          <div
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center p-2.5 overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              background:
                'radial-gradient(circle at 32% 28%, #FFF6E5 0%, #F5DEB3 18%, #D4AF37 45%, #AA7C11 75%, #6B4912 100%)',
              border: '2.5px solid #FFF3DB',
              boxShadow:
                '0 12px 28px -4px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(0, 0, 0, 0.55)',
            }}
          >
            {/* Outer Concentric Beaded / Dashed Ring */}
            <div
              className="absolute inset-1 rounded-full border border-antique-gold/70 border-dashed pointer-events-none"
              style={{ transform: 'translateZ(2px)' }}
            />
            {/* Inner Recessed Groove Ring */}
            <div
              className="absolute inset-2 rounded-full border border-royal-maroon/25 pointer-events-none"
              style={{ transform: 'translateZ(4px)' }}
            />

            {/* Sacred Ganesha Calligraphy with 3D Relief Elevation */}
            <div
              className="relative z-10 flex flex-col items-center justify-center -mt-1 pointer-events-none"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div
                className="w-14 h-16 sm:w-16 sm:h-20 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{
                  filter: 'drop-shadow(0 2px 3px rgba(84, 20, 38, 0.45))',
                }}
              >
                <CalligraphyGanesha className="w-full h-full text-royal-maroon" />
              </div>
              <span
                className="font-serif text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-royal-maroon/90 -mt-0.5 leading-none"
                style={{
                  textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)',
                }}
              >
                ॥ श्री गणेशाय नमः ॥
              </span>
            </div>

            {/* Dynamic Specular Sheen on Front Face */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transform: 'translateZ(12px)',
                background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.38) 0%, transparent 60%)`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          {/* ========================================================== */}
          {/* BACK FACE: Royal "D & V" Monogram & Auspicious Date        */}
          {/* ========================================================== */}
          <div
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center p-2.5 overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
              background:
                'radial-gradient(circle at 32% 28%, #FFF6E5 0%, #F5DEB3 18%, #D4AF37 45%, #AA7C11 75%, #6B4912 100%)',
              border: '2.5px solid #FFF3DB',
              boxShadow:
                '0 12px 28px -4px rgba(0, 0, 0, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(0, 0, 0, 0.55)',
            }}
          >
            {/* Outer Concentric Beaded / Dashed Ring */}
            <div
              className="absolute inset-1 rounded-full border border-antique-gold/70 border-dashed pointer-events-none"
              style={{ transform: 'translateZ(2px)' }}
            />
            {/* Inner Recessed Groove Ring */}
            <div
              className="absolute inset-2 rounded-full border border-royal-maroon/25 pointer-events-none"
              style={{ transform: 'translateZ(4px)' }}
            />

            {/* Royal Monogram Content with 3D Relief Elevation */}
            <div
              className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none"
              style={{ transform: 'translateZ(10px)' }}
            >
              <span
                className="font-serif text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-royal-maroon/80 font-bold mb-0.5"
                style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}
              >
                Royal Union
              </span>

              {/* D & V Monogram — unclipped, perfectly balanced */}
              <div className="flex items-center justify-center select-none leading-none my-0.5 pr-0.5">
                <span
                  className="font-script text-3xl sm:text-4xl font-bold text-royal-maroon inline-block"
                  style={{
                    textShadow: '0 1px 1.5px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  D
                </span>
                <span
                  className="font-serif text-xs sm:text-sm font-semibold text-royal-maroon/90 mx-1 -mt-1 inline-block"
                  style={{
                    textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)',
                  }}
                >
                  &amp;
                </span>
                <span
                  className="font-script text-3xl sm:text-4xl font-bold text-royal-maroon inline-block pr-1"
                  style={{
                    textShadow: '0 1px 1.5px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  V
                </span>
              </div>

              {/* Auspicious Wedding Date */}
              <span
                className="font-serif text-[9px] sm:text-[10px] font-semibold text-deep-burgundy tracking-wider mt-0.5"
                style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.7)' }}
              >
                Jan 20, 2027
              </span>
            </div>

            {/* Dynamic Specular Sheen on Back Face */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                transform: 'translateZ(12px)',
                background: `radial-gradient(circle at ${100 - tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.38) 0%, transparent 60%)`,
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtle Interactive Hint Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-2.5 flex items-center gap-1.5 text-[10px] sm:text-xs text-antique-gold/90 font-serif tracking-widest uppercase select-none opacity-80 group-hover:opacity-100 cursor-pointer"
        onClick={handleClick}
      >
        <span className="inline-block transition-transform duration-500 hover:rotate-180">↻</span>
        <span>Tap to flip medallion</span>
      </motion.div>
    </div>
  );
}

export default Royal3DMedallion;
