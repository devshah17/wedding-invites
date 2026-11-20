'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { colors, animations } from '@/config/theme';

export interface DecorativeDividerProps {
  /** Optional custom CSS class */
  className?: string;
  /** Whether to animate with stroke draw-in on viewport entry (default: true) */
  animated?: boolean;
  /** Divider visual style variant (default: 'ornate') */
  variant?: 'ornate' | 'simple' | 'floral';
}

export function DecorativeDivider({
  className = '',
  animated = true,
  variant = 'ornate',
}: DecorativeDividerProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;

  const gold = colors.antiqueGold; // #C99A45

  // Motion variants for SVG stroke lines (draw-in effect)
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.3,
          ease: [0.16, 1, 0.3, 1] as const,
        },
        opacity: {
          duration: 0.3,
          ease: 'linear' as const,
        },
      },
    },
  };

  // Motion variants for filled accents and jewels
  const accentVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.45,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      className={`w-full flex items-center justify-center my-4 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 400 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[420px] h-auto drop-shadow-sm select-none"
        preserveAspectRatio="xMidYMid meet"
        initial={shouldAnimate ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {variant === 'ornate' && (
          <g>
            {/* Left Main Scrollwork Line */}
            <motion.path
              d="M 20 20 C 40 21, 55 18, 70 18 C 84 18, 95 25, 108 24 C 122 23, 130 13, 148 12 C 165 11, 178 15, 190 20"
              stroke={gold}
              strokeWidth="1.25"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Main Scrollwork Line (Mirror) */}
            <motion.path
              d="M 380 20 C 360 21, 345 18, 330 18 C 316 18, 305 25, 292 24 C 278 23, 270 13, 252 12 C 235 11, 222 15, 210 20"
              stroke={gold}
              strokeWidth="1.25"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Left Upper Flourish Spiral */}
            <motion.path
              d="M 148 12 C 151 7, 157 5, 161 8 C 165 11, 162 17, 155 16 C 150 15, 149 11, 153 10"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Upper Flourish Spiral (Mirror) */}
            <motion.path
              d="M 252 12 C 249 7, 243 5, 239 8 C 235 11, 238 17, 245 16 C 250 15, 251 11, 247 10"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Left Lower Leaf Swirl */}
            <motion.path
              d="M 108 24 C 104 29, 97 32, 92 28 C 88 24, 93 19, 98 21 C 101 22, 101 26, 96 26"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Lower Leaf Swirl (Mirror) */}
            <motion.path
              d="M 292 24 C 296 29, 303 32, 308 28 C 312 24, 307 19, 302 21 C 299 22, 299 26, 304 26"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Left Outer Paisley Finial Accent */}
            <motion.path
              d="M 38 20 C 32 17, 24 18, 18 20 C 25 22, 32 23, 38 20"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Outer Paisley Finial Accent (Mirror) */}
            <motion.path
              d="M 362 20 C 368 17, 376 18, 382 20 C 375 22, 368 23, 362 20"
              stroke={gold}
              strokeWidth="1"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Central Mandala / Jewel Motif Outline */}
            <motion.path
              d="M 200 6 L 208 14 L 216 20 L 208 26 L 200 34 L 192 26 L 184 20 L 192 14 Z"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinejoin="round"
              variants={lineVariants}
            />

            {/* Central Inner Diamond */}
            <motion.path
              d="M 200 11 L 206 20 L 200 29 L 194 20 Z"
              stroke={gold}
              strokeWidth="0.9"
              variants={lineVariants}
            />

            {/* Vertical Floral Petals */}
            <motion.path
              d="M 200 6 C 197 2, 203 2, 200 0 C 197 2, 203 2, 200 6"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 34 C 197 38, 203 38, 200 40 C 197 38, 203 38, 200 34"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Central Gemstone Fill and Accents */}
            <motion.circle
              cx="200"
              cy="20"
              r="2.75"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="178"
              cy="20"
              r="1.6"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="222"
              cy="20"
              r="1.6"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="126"
              cy="18"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="274"
              cy="18"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="65"
              cy="19"
              r="1.2"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="335"
              cy="19"
              r="1.2"
              fill={gold}
              variants={accentVariants}
            />
          </g>
        )}

        {variant === 'simple' && (
          <g>
            {/* Left Horizontal Line */}
            <motion.line
              x1="32"
              y1="20"
              x2="170"
              y2="20"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Horizontal Line */}
            <motion.line
              x1="230"
              y1="20"
              x2="368"
              y2="20"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Center Diamond Outline */}
            <motion.path
              d="M 200 12 L 208 20 L 200 28 L 192 20 Z"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinejoin="round"
              variants={lineVariants}
            />

            {/* Left Accent Diamond */}
            <motion.path
              d="M 184 16 L 188 20 L 184 24 L 180 20 Z"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinejoin="round"
              variants={lineVariants}
            />

            {/* Right Accent Diamond */}
            <motion.path
              d="M 216 16 L 220 20 L 216 24 L 212 20 Z"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinejoin="round"
              variants={lineVariants}
            />

            {/* Left End Laurel Leaves */}
            <motion.path
              d="M 32 20 C 26 15, 18 16, 12 20 C 18 24, 26 25, 32 20 Z"
              stroke={gold}
              strokeWidth="0.9"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 26 19 C 22 14, 17 14, 15 16"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />
            <motion.path
              d="M 26 21 C 22 26, 17 26, 15 24"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right End Laurel Leaves (Mirror) */}
            <motion.path
              d="M 368 20 C 374 15, 382 16, 388 20 C 382 24, 374 25, 368 20 Z"
              stroke={gold}
              strokeWidth="0.9"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 374 19 C 378 14, 383 14, 385 16"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />
            <motion.path
              d="M 374 21 C 378 26, 383 26, 385 24"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Center Gemstone & Accent Dots */}
            <motion.circle
              cx="200"
              cy="20"
              r="2.2"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="174"
              cy="20"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="226"
              cy="20"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
          </g>
        )}

        {variant === 'floral' && (
          <g>
            {/* Left Flowing Vine Stem */}
            <motion.path
              d="M 20 20 C 35 17, 50 24, 70 20 C 90 16, 110 24, 130 20 C 150 16, 170 24, 190 20"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Flowing Vine Stem (Mirror) */}
            <motion.path
              d="M 380 20 C 365 17, 350 24, 330 20 C 310 16, 290 24, 270 20 C 250 16, 230 24, 210 20"
              stroke={gold}
              strokeWidth="1.2"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Central Lotus / Flower Blossom */}
            {/* North-South petals */}
            <motion.path
              d="M 200 20 C 196 14, 196 9, 200 4 C 204 9, 204 14, 200 20"
              stroke={gold}
              strokeWidth="0.9"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 20 C 196 26, 196 31, 200 36 C 204 31, 204 26, 200 20"
              stroke={gold}
              strokeWidth="0.9"
              variants={lineVariants}
            />
            {/* East-West petals */}
            <motion.path
              d="M 200 20 C 194 16, 189 16, 184 20 C 189 24, 194 24, 200 20"
              stroke={gold}
              strokeWidth="0.9"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 20 C 206 16, 211 16, 216 20 C 211 24, 206 24, 200 20"
              stroke={gold}
              strokeWidth="0.9"
              variants={lineVariants}
            />
            {/* Diagonal petals */}
            <motion.path
              d="M 200 20 C 194 13, 191 10, 189 8 C 192 11, 197 15, 200 20"
              stroke={gold}
              strokeWidth="0.8"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 20 C 206 13, 209 10, 211 8 C 208 11, 203 15, 200 20"
              stroke={gold}
              strokeWidth="0.8"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 20 C 194 27, 191 30, 189 32 C 192 29, 197 25, 200 20"
              stroke={gold}
              strokeWidth="0.8"
              variants={lineVariants}
            />
            <motion.path
              d="M 200 20 C 206 27, 209 30, 211 32 C 208 29, 203 25, 200 20"
              stroke={gold}
              strokeWidth="0.8"
              variants={lineVariants}
            />

            {/* Left Blossom at x = 130 */}
            <motion.path
              d="M 130 16 C 127 12, 133 12, 130 16 M 130 24 C 127 28, 133 28, 130 24 M 126 20 C 122 17, 122 23, 126 20 M 134 20 C 138 17, 138 23, 134 20"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right Blossom at x = 270 (Mirror) */}
            <motion.path
              d="M 270 16 C 267 12, 273 12, 270 16 M 270 24 C 267 28, 273 28, 270 24 M 266 20 C 262 17, 262 23, 266 20 M 274 20 C 278 17, 278 23, 274 20"
              stroke={gold}
              strokeWidth="0.9"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Left Floral Leaves along vine */}
            <motion.path
              d="M 160 22 C 163 27, 170 28, 172 25 C 169 23, 164 22, 160 22 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 100 18 C 97 13, 90 12, 88 15 C 91 17, 96 18, 100 18 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 46 21 C 49 26, 56 27, 58 24 C 55 22, 50 21, 46 21 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />

            {/* Right Floral Leaves along vine (Mirror) */}
            <motion.path
              d="M 240 22 C 237 27, 230 28, 228 25 C 231 23, 236 22, 240 22 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 300 18 C 303 13, 310 12, 312 15 C 309 17, 304 18, 300 18 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />
            <motion.path
              d="M 354 21 C 351 26, 344 27, 342 24 C 345 22, 350 21, 354 21 Z"
              stroke={gold}
              strokeWidth="0.8"
              fill="none"
              variants={lineVariants}
            />

            {/* Left End Tendril Curl */}
            <motion.path
              d="M 20 20 C 15 19, 10 22, 12 25 C 14 27, 18 26, 17 23"
              stroke={gold}
              strokeWidth="0.8"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Right End Tendril Curl (Mirror) */}
            <motion.path
              d="M 380 20 C 385 19, 390 22, 388 25 C 386 27, 382 26, 383 23"
              stroke={gold}
              strokeWidth="0.8"
              strokeLinecap="round"
              variants={lineVariants}
            />

            {/* Flower Center Stamen Dots & Buds */}
            <motion.circle
              cx="200"
              cy="20"
              r="2.5"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="130"
              cy="20"
              r="1.8"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="270"
              cy="20"
              r="1.8"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="70"
              cy="20"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
            <motion.circle
              cx="330"
              cy="20"
              r="1.4"
              fill={gold}
              variants={accentVariants}
            />
          </g>
        )}
      </motion.svg>
    </div>
  );
}

export default DecorativeDivider;
