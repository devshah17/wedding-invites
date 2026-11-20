'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { theme } from '@/config/theme';
import { FlowerPetals } from '@/components/effects/FlowerPetals';
import { useEnvelopeAnimation } from './EnvelopeAnimation';
import { CalligraphyGanesha } from '@/components/sacred/CalligraphyGanesha';

export interface InvitationEnvelopeProps {
  /** Callback fired when the envelope opening sequence finishes */
  onOpen?: () => void;
  /** Whether the envelope is bypassed by default */
  defaultOpen?: boolean;
}

/**
 * InvitationEnvelope Component
 * The grand, ceremonial entry point to the wedding celebration.
 * Features a realistic 3D maroon envelope, authentic gold wax seal,
 * marigold garlands, swinging temple bells, flickering diyas,
 * and floating petals powered by GSAP and Framer Motion.
 */
export function InvitationEnvelope({
  onOpen,
  defaultOpen = false,
}: InvitationEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showInvitation, setShowInvitation] = useState(defaultOpen);

  const {
    envelopeRef,
    flapRef,
    sealRef,
    cardRef,
    containerRef,
    buttonRef,
    textRef,
    decorationsRef,
    playAnimation,
    resetAnimation,
    isAnimating,
  } = useEnvelopeAnimation({
    onComplete: () => {
      setIsOpen(true);
      setShowInvitation(true);
      onOpen?.();
    },
  });

  // Handle immediate skip
  const handleSkip = () => {
    if (isAnimating) return;
    setIsOpen(true);
    setShowInvitation(true);
    onOpen?.();
  };

  // Handle replay to re-experience the envelope opening
  const handleReplay = () => {
    resetAnimation();
    setIsOpen(false);
    setShowInvitation(false);
  };

  // Handle user initiating opening
  const handleOpenClick = () => {
    if (isAnimating || isOpen) return;
    playAnimation();
  };

  // Interactive 3D tilt & dynamic specular light sheen state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });

  const handleEnvelopePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAnimating || isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Elegant, subtle 3D tilt angle (up to ~7.5 degrees)
    const rotateX = -((y - centerY) / centerY) * 7.5;
    const rotateY = ((x - centerX) / centerX) * 7.5;
    const sheenX = Math.round((x / rect.width) * 100);
    const sheenY = Math.round((y / rect.height) * 100);
    setTilt({ rotateX, rotateY, sheenX, sheenY });
  };

  const handleEnvelopePointerLeave = () => {
    if (isAnimating) return;
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 });
  };

  return (
    <>
      {/* ============================================================== */}
      {/* 1. Main Full-Screen Envelope Experience Overlay                */}
      {/* ============================================================== */}
      <AnimatePresence>
        {!showInvitation && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden select-none"
            style={{
              backgroundColor: '#FAF8F5',
              backgroundImage:
                'radial-gradient(ellipse at 50% 20%, #FFF9F2 0%, #FAF8F5 55%, #F5EFE6 100%)',
            }}
          >
            {/* ---------------------------------------------------------- */}
            {/* Damask Jacquard Wallpaper Texture Overlay                  */}
            {/* ---------------------------------------------------------- */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.07]"
              aria-hidden="true"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B1E2F' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='60' cy='60' r='14' fill='none' stroke='%23C99A45' stroke-width='1.5' stroke-dasharray='3 2'/%3E%3Ccircle cx='60' cy='60' r='6' fill='%23C99A45'/%3E%3Cpath d='M60 20 C54 36, 54 44, 60 50 C66 44, 66 36, 60 20 Z' /%3E%3Cpath d='M60 100 C54 84, 54 76, 60 70 C66 76, 66 84, 60 100 Z' /%3E%3Cpath d='M20 60 C36 54, 44 54, 50 60 C44 66, 36 66, 20 60 Z' /%3E%3Cpath d='M100 60 C84 54, 76 54, 70 60 C76 66, 84 66, 100 60 Z' /%3E%3Cpath d='M31.7 31.7 C44.4 41.6, 49.5 47.3, 52.9 52.9 C47.3 49.5, 41.6 44.4, 31.7 31.7 Z' /%3E%3Cpath d='M88.3 88.3 C75.6 78.4, 70.5 72.7, 67.1 67.1 C72.7 70.5, 78.4 75.6, 88.3 88.3 Z' /%3E%3Cpath d='M88.3 31.7 C78.4 44.4, 72.7 49.5, 67.1 52.9 C70.5 47.3, 75.6 41.6, 88.3 31.7 Z' /%3E%3Cpath d='M31.7 88.3 C41.6 75.6, 47.3 70.5, 52.9 67.1 C49.5 72.7, 44.4 78.4, 31.7 88.3 Z' /%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '120px 120px',
              }}
            />

            {/* ---------------------------------------------------------- */}
            {/* Antique Gold Filigree Double Border Frame                  */}
            {/* ---------------------------------------------------------- */}
            <div
              className="absolute inset-3 md:inset-5 pointer-events-none z-10 rounded-2xl"
              aria-hidden="true"
              style={{
                border: '1.5px solid rgba(201,154,69,0.35)',
                boxShadow: 'inset 0 0 60px rgba(201,154,69,0.06)',
              }}
            />
            <div
              className="absolute inset-5 md:inset-8 pointer-events-none z-10 rounded-xl"
              aria-hidden="true"
              style={{ border: '0.75px solid rgba(201,154,69,0.18)' }}
            />

            {/* ---------------------------------------------------------- */}
            {/* Top Marigold Toran Border Strip                            */}
            {/* ---------------------------------------------------------- */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-14 overflow-hidden z-20" aria-hidden="true">
              <ToranStrip />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Bottom Lotus Corner Accents                                */}
            {/* ---------------------------------------------------------- */}
            <div className="pointer-events-none absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20" aria-hidden="true">
              <CornerLotus flip={false} />
            </div>
            <div className="pointer-events-none absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20" aria-hidden="true">
              <CornerLotus flip={true} />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Floating Auspicious Rose Petals                            */}
            {/* ---------------------------------------------------------- */}
            <FlowerPetals count={26} />

            {/* ---------------------------------------------------------- */}
            {/* Top Bar: Skip Button & Header Accents                      */}
            {/* ---------------------------------------------------------- */}
            <header className="relative w-full max-w-5xl flex items-center justify-between z-30 pt-2">
              <div className="flex items-center gap-2 text-antique-gold text-xs tracking-widest font-sans uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-antique-gold animate-pulse" />
                <span>Wedding Invitation</span>
              </div>

              {/* Skip button */}
              <button
                type="button"
                onClick={handleSkip}
                aria-label="Skip envelope opening animation"
                className="group flex items-center gap-1.5 text-deep-burgundy/70 hover:text-deep-burgundy transition-colors duration-200 text-xs md:text-sm font-sans tracking-wider py-1.5 px-3 rounded-full border border-antique-gold/40 hover:border-antique-gold/70 bg-white/40 backdrop-blur-xs cursor-pointer"
              >
                <span>Skip</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </header>

            {/* ---------------------------------------------------------- */}
            {/* Traditional Hanging Temple Bells (Top Corners)             */}
            {/* ---------------------------------------------------------- */}
            <div
              ref={decorationsRef}
              className="pointer-events-none absolute inset-x-0 top-0 h-48 overflow-hidden z-25"
              aria-hidden="true"
            >
              {/* Left bells cluster */}
              <div className="absolute left-4 md:left-14 top-14 flex gap-4 md:gap-7 items-start">
                {/* Bell 1: Longer chain */}
                <div className="flex flex-col items-center animate-bell-swing">
                  <div className="w-[1.5px] h-16 md:h-20 bg-gradient-to-b from-antique-gold/90 via-antique-gold to-antique-gold/70" />
                  <GoldenBell size={28} />
                </div>
                {/* Bell 2: Shorter chain */}
                <div
                  className="flex flex-col items-center animate-bell-swing"
                  style={{ animationDelay: '1.2s' }}
                >
                  <div className="w-[1.5px] h-10 md:h-12 bg-gradient-to-b from-antique-gold/90 via-antique-gold to-antique-gold/70" />
                  <GoldenBell size={22} />
                </div>
              </div>

              {/* Right bells cluster */}
              <div className="absolute right-4 md:right-14 top-14 flex gap-4 md:gap-7 items-start">
                {/* Bell 3: Shorter chain */}
                <div
                  className="flex flex-col items-center animate-bell-swing"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div className="w-[1.5px] h-10 md:h-12 bg-gradient-to-b from-antique-gold/90 via-antique-gold to-antique-gold/70" />
                  <GoldenBell size={22} />
                </div>
                {/* Bell 4: Longer chain */}
                <div
                  className="flex flex-col items-center animate-bell-swing"
                  style={{ animationDelay: '1.8s' }}
                >
                  <div className="w-[1.5px] h-16 md:h-20 bg-gradient-to-b from-antique-gold/90 via-antique-gold to-antique-gold/70" />
                  <GoldenBell size={28} />
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Side Swaying Banana Leaf Fronds (Left & Right)             */}
            {/* ---------------------------------------------------------- */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-14 md:w-20 hidden sm:flex flex-col items-start justify-around z-20 overflow-hidden" aria-hidden="true">
              <BananaLeafSide side="left" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-14 md:w-20 hidden sm:flex flex-col items-end justify-around z-20 overflow-hidden" aria-hidden="true">
              <BananaLeafSide side="right" />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* Center Stage: Blessing, 3D Envelope, and CTA Button        */}
            {/* ---------------------------------------------------------- */}
            <main className="relative flex-1 flex flex-col items-center justify-center w-full max-w-xl z-20 py-2">
              {/* Text above envelope */}
              <div ref={textRef} className="text-center mb-5 md:mb-7 space-y-1.5">
                {/* Calligraphic Ganesha Emblem */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
                  className="flex justify-center mb-3"
                >
                  <CalligraphyGanesha className="w-16 h-16 md:w-20 md:h-20" />
                </motion.div>

                {/* Auspicious Blessing invocation */}
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-script text-3xl md:text-4xl text-royal-maroon tracking-wide drop-shadow-sm"
                >
                  With the blessings of Lord Ganesha
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-serif text-sm md:text-base tracking-[0.2em] uppercase text-deep-burgundy/75"
                >
                  An invitation awaits you
                </motion.p>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Central 3D Envelope Container                            */}
              {/* -------------------------------------------------------- */}
              <div
                className="relative w-full flex items-center justify-center my-1"
                style={{ perspective: '1100px' }}
                onPointerMove={handleEnvelopePointerMove}
                onPointerLeave={handleEnvelopePointerLeave}
              >
                <div
                  ref={envelopeRef}
                  onClick={handleOpenClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenClick();
                    }
                  }}
                  aria-label="Click to open wedding invitation envelope"
                  className="group relative w-[min(340px,88vw)] sm:w-[410px] md:w-[460px] h-[min(230px,58vw)] sm:h-[270px] md:h-[300px] rounded-2xl cursor-pointer transition-shadow duration-300"
                  style={{
                    backgroundColor: theme.colors.royalMaroon,
                    boxShadow:
                      '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 10px 25px -5px rgba(84, 20, 38, 0.6), 0 0 30px rgba(201, 154, 69, 0.2)',
                    border: '1px solid rgba(201, 154, 69, 0.35)',
                    transform: !isAnimating
                      ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
                      : undefined,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                    transition: isAnimating ? undefined : 'transform 0.12s ease-out',
                  }}
                >
                  {/* Subtle envelope paper texture and lighting */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-royal-maroon via-[#691A2E] to-deep-burgundy opacity-95 overflow-hidden">
                    {/* Inner gold frame line on envelope */}
                    <div className="absolute inset-2.5 rounded-xl border border-antique-gold/25 pointer-events-none" />
                  </div>

                  {/* Dynamic 3D Specular Light Sheen */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 240, 200, 0.18) 0%, transparent 65%)`,
                      mixBlendMode: 'screen',
                      zIndex: 15,
                    }}
                  />

                  {/* ------------------------------------------------------ */}
                  {/* Inside Invitation Card (Slides up and expands)         */}
                  {/* ------------------------------------------------------ */}
                  <div
                    ref={cardRef}
                    className="absolute inset-x-3 sm:inset-x-5 top-2.5 bottom-2.5 rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none"
                    style={{
                      backgroundColor: theme.colors.ivory,
                      border: '1.5px solid rgba(201, 154, 69, 0.55)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                      zIndex: 10,
                      transformOrigin: 'center center',
                    }}
                  >
                    {/* Card Inner Border & Corner Motifs */}
                    <div className="absolute inset-1.5 sm:inset-2.5 rounded-lg border border-antique-gold/30 pointer-events-none" />

                    {/* Auspicious Ganesha Emblem on Card */}
                    <div className="mb-1 text-antique-gold">
                      <GaneshaIcon className="w-6 h-6 sm:w-7 sm:h-7 mx-auto" />
                    </div>

                    <div className="font-serif text-[10px] sm:text-xs tracking-[0.25em] uppercase text-deep-burgundy/80 font-semibold mb-1">
                      Together With Their Families
                    </div>

                    {/* Couple Initials Preview — perfectly balanced and unclipped */}
                    <div className="flex items-center justify-center select-none leading-none my-1">
                      <span className="font-script text-3xl sm:text-4xl text-royal-maroon font-bold">
                        D
                      </span>
                      <span className="font-serif text-sm sm:text-base text-antique-gold/90 mx-1.5 -mt-1 font-semibold">
                        &amp;
                      </span>
                      <span className="font-script text-3xl sm:text-4xl text-royal-maroon font-bold pr-1.5">
                        V
                      </span>
                    </div>

                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-antique-gold to-transparent my-1.5" />

                    <div className="font-serif text-xs sm:text-sm text-deep-burgundy font-medium tracking-wide">
                      January 20, 2027
                    </div>

                    <div className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-antique-gold/90 mt-1">
                      Petlad, Gujarat • Chitri, Rajasthan
                    </div>
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* Envelope Front Pocket (Left, Right, Bottom flaps)      */}
                  {/* ------------------------------------------------------ */}
                  {/* Left triangle fold */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: 'polygon(0 0, 48% 50%, 0 100%)',
                      backgroundColor: '#6A192D',
                      zIndex: 20,
                      boxShadow: 'inset -2px 0 10px rgba(0, 0, 0, 0.3)',
                    }}
                  />

                  {/* Right triangle fold */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: 'polygon(100% 0, 52% 50%, 100% 100%)',
                      backgroundColor: '#65172A',
                      zIndex: 20,
                      boxShadow: 'inset 2px 0 10px rgba(0, 0, 0, 0.35)',
                    }}
                  />

                  {/* Bottom triangular flap rising up */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-b-2xl overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 100%, 100% 100%, 50% 38%)',
                      backgroundColor: '#731D33',
                      zIndex: 22,
                      boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Bottom flap gold border highlight */}
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="100"
                        x2="50"
                        y2="38"
                        stroke="rgba(201, 154, 69, 0.4)"
                        strokeWidth="0.75"
                      />
                      <line
                        x1="100"
                        y1="100"
                        x2="50"
                        y2="38"
                        stroke="rgba(201, 154, 69, 0.4)"
                        strokeWidth="0.75"
                      />
                    </svg>
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* 3D Top Flap (Rotates backwards on open)                 */}
                  {/* ------------------------------------------------------ */}
                  <div
                    ref={flapRef}
                    className="absolute inset-x-0 top-0 h-[62%] rounded-t-2xl pointer-events-none"
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      zIndex: 30,
                    }}
                  >
                    {/* Top flap front face */}
                    <div
                      className="w-full h-full"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        background:
                          'linear-gradient(180deg, #84233B 0%, #781F35 60%, #601628 100%)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {/* Gold filigree trim along top flap */}
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="50"
                          y2="100"
                          stroke="rgba(201, 154, 69, 0.6)"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="100"
                          y1="0"
                          x2="50"
                          y2="100"
                          stroke="rgba(201, 154, 69, 0.6)"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* ------------------------------------------------------ */}
                  {/* Auspicious Royal Golden Wax Seal (Interactive Button)  */}
                  {/* ------------------------------------------------------ */}
                  <div
                    ref={sealRef}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenClick();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenClick();
                      }
                    }}
                    aria-label="Dev & Vishakha seal button - click to open envelope"
                    className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-transform duration-300 group-hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      zIndex: 40,
                      background:
                        'radial-gradient(circle at 35% 35%, #FFF3DB 0%, #E8C97A 25%, #C99A45 60%, #A07628 85%, #6B4912 100%)',
                      boxShadow:
                        '0 8px 22px rgba(0, 0, 0, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -3px 5px rgba(0, 0, 0, 0.45)',
                      border: '1.5px solid rgba(255, 243, 219, 0.6)',
                      transformStyle: 'preserve-3d',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Concentric inner engraved ring */}
                    <div className="absolute inset-2 sm:inset-2.5 rounded-full border border-antique-gold/70 border-dashed pointer-events-none" />

                    {/* Seal Monogram Initials — perfectly centered, unclipped royal layout */}
                    <div className="relative flex items-center justify-center select-none leading-none pr-0.5 pointer-events-none">
                      <span
                        className="font-script text-2xl sm:text-3xl font-bold text-deep-burgundy inline-block"
                        style={{
                          textShadow: '0 1px 1.5px rgba(255, 255, 255, 0.75)',
                        }}
                      >
                        D
                      </span>
                      <span
                        className="font-serif text-xs sm:text-sm font-semibold text-royal-maroon/90 mx-0.5 -mt-0.5 inline-block"
                        style={{
                          textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        &amp;
                      </span>
                      <span
                        className="font-script text-2xl sm:text-3xl font-bold text-deep-burgundy inline-block pr-1.5"
                        style={{
                          textShadow: '0 1px 1.5px rgba(255, 255, 255, 0.75)',
                        }}
                      >
                        V
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Action Button: "OPEN YOUR INVITATION"                     */}
              {/* -------------------------------------------------------- */}
              <div className="mt-6 md:mt-8">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={handleOpenClick}
                  disabled={isAnimating}
                  aria-label="Open your wedding invitation"
                  className="group relative inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 rounded-full font-sans font-semibold text-sm md:text-base tracking-widest uppercase transition-all duration-300 cursor-pointer overflow-hidden shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: theme.colors.deepBurgundy,
                    background:
                      'linear-gradient(135deg, #C99A45 0%, #FFF3DB 50%, #C99A45 100%)',
                    boxShadow:
                      '0 10px 30px -5px rgba(201, 154, 69, 0.5), 0 0 15px rgba(201, 154, 69, 0.3)',
                    border: '1.5px solid #FFF3DB',
                  }}
                >
                  {/* Subtle animated border shimmer effect */}
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                    }}
                  />
                  <span className="relative flex items-center gap-2 font-bold drop-shadow-xs">
                    <span className="text-royal-maroon">✨</span>
                    <span>OPEN YOUR INVITATION</span>
                    <span className="text-royal-maroon">✨</span>
                  </span>
                </button>
              </div>
            </main>

            {/* ---------------------------------------------------------- */}
            {/* Traditional Diyas Lighting (Bottom Corners)                */}
            {/* ---------------------------------------------------------- */}
            <footer className="relative w-full max-w-5xl flex items-end justify-between z-30 pb-2 pointer-events-none">
              {/* Bottom-left Diya */}
              <div className="flex flex-col items-center">
                <TraditionalDiya />
              </div>

              {/* Centered micro-note */}
              <div className="text-center pb-2 text-[11px] font-serif tracking-widest text-royal-maroon/60 uppercase hidden sm:block">
                Dev &amp; Vishakha • January 2027
              </div>

              {/* Bottom-right Diya */}
              <div className="flex flex-col items-center">
                <TraditionalDiya />
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. Floating Replay Button (Always available once opened)       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {showInvitation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50"
          >
            <button
              type="button"
              onClick={handleReplay}
              title="Replay Envelope Opening"
              aria-label="Replay Envelope Opening"
              className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-deep-burgundy/90 hover:bg-deep-burgundy text-antique-gold border border-antique-gold/50 shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90 duration-300" />
              <span className="text-xs font-sans font-medium tracking-wider text-champagne hidden md:inline">
                Replay Envelope
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Traditional Brass Golden Temple Bell Component
 */
function GoldenBell({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
    >
      {/* Top hanger loop */}
      <circle cx="16" cy="4" r="3" stroke="#E8C97A" strokeWidth="1.5" />
      {/* Bell body */}
      <path
        d="M16 6 C10 6 9 14 7 24 C6 28 4 30 4 32 C4 34 8 34 16 34 C24 34 28 34 28 32 C28 30 26 28 25 24 C23 14 22 6 16 6 Z"
        fill="url(#bellGradient)"
        stroke="#E8C97A"
        strokeWidth="1"
      />
      {/* Ornate decorative bands */}
      <path
        d="M7 23 C11 25 21 25 25 23"
        stroke="#7A571A"
        strokeWidth="1.2"
      />
      <path
        d="M5 30 C10 32 22 32 27 30"
        stroke="#7A571A"
        strokeWidth="1"
      />
      {/* Clapper / internal knocker with bead */}
      <circle cx="16" cy="36" r="2.5" fill="#C99A45" stroke="#FFF3DB" strokeWidth="0.5" />

      <defs>
        <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3DB" />
          <stop offset="35%" stopColor="#E8C97A" />
          <stop offset="70%" stopColor="#C99A45" />
          <stop offset="100%" stopColor="#8A631E" />
        </linearGradient>
      </defs>
    </svg>
  );
}


/**
 * Auspicious Lord Ganesha Emblem SVG
 */
function GaneshaIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      aria-label="Lord Ganesha Emblem"
    >
      {/* Stylized Lord Ganesha line art */}
      {/* Crown / Mukut */}
      <path
        d="M32 6 L36 14 L28 14 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="32" cy="4" r="1.5" fill="currentColor" />

      {/* Tilak / Trishul on forehead */}
      <path
        d="M30 16 L34 16 L33 22 L31 22 Z"
        fill="currentColor"
      />
      <circle cx="32" cy="18" r="1" fill="#781F35" />

      {/* Ears and Face */}
      <path
        d="M23 18 C16 18 14 26 19 32 C23 35 25 31 26 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M41 18 C48 18 50 26 45 32 C41 35 39 31 38 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Auspicious Trunk curving right */}
      <path
        d="M32 22 C32 30 28 38 31 46 C33 50 40 50 41 44 C42 39 36 38 36 40"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tusk */}
      <line
        x1="27"
        y1="34"
        x2="24"
        y2="37"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Modak in trunk's reach */}
      <circle cx="43" cy="41" r="2.2" fill="#FFB703" />

      {/* Auspicious dots */}
      <circle cx="28" cy="24" r="1" fill="currentColor" />
      <circle cx="36" cy="24" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Traditional Brass Diya with Animated Warm Glow Component
 */
function TraditionalDiya() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Animated Diya Flame */}
      <motion.div
        animate={{
          scale: [1, 1.08, 0.96, 1.05, 1],
          opacity: [0.9, 1, 0.88, 1, 0.9],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Radiant Ambient Glow Halo */}
        <div
          className="absolute -top-3 w-8 h-8 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 183, 3, 0.6) 0%, rgba(216, 90, 50, 0.3) 50%, transparent 80%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Teardrop Flame SVG */}
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          className="filter drop-shadow-[0_0_8px_rgba(255,183,3,0.8)]"
        >
          {/* Outer orange flame */}
          <path
            d="M8 0 C12 7 16 13 16 18 C16 21.3 12.4 24 8 24 C3.6 24 0 21.3 0 18 C0 13 4 7 8 0 Z"
            fill="url(#outerFlame)"
          />
          {/* Inner golden/white heart */}
          <path
            d="M8 6 C10 10 12 14 12 18 C12 20.2 10.2 22 8 22 C5.8 22 4 20.2 4 18 C4 14 6 10 8 6 Z"
            fill="url(#innerFlame)"
          />

          <defs>
            <linearGradient id="outerFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFF3DB" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D85A32" />
            </linearGradient>
            <linearGradient id="innerFlame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFF3DB" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Brass Diya Bowl & Base */}
      <svg
        width="44"
        height="22"
        viewBox="0 0 44 22"
        fill="none"
        className="-mt-1 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
      >
        {/* Diya lip and oil reservoir */}
        <path
          d="M2 5 C12 8 32 8 42 5 C40 14 30 18 22 18 C14 18 4 14 2 5 Z"
          fill="url(#diyaBrass)"
          stroke="#E8C97A"
          strokeWidth="1"
        />
        {/* Pedestal stand */}
        <path
          d="M17 18 L15 21 L29 21 L27 18 Z"
          fill="#A07628"
          stroke="#E8C97A"
          strokeWidth="0.8"
        />
        {/* Subtle oil reflection */}
        <ellipse cx="22" cy="7" rx="14" ry="2" fill="#D85A32" opacity="0.6" />

        <defs>
          <linearGradient id="diyaBrass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3DB" />
            <stop offset="35%" stopColor="#E8C97A" />
            <stop offset="70%" stopColor="#C99A45" />
            <stop offset="100%" stopColor="#7A571A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Marigold & Jasmine Toran Strip for the top border of the envelope page
 */
function ToranStrip() {
  const count = 18;
  return (
    <svg
      viewBox="0 0 1200 56"
      preserveAspectRatio="none"
      className="w-full h-14"
      aria-hidden="true"
    >
      {/* Top horizontal rope */}
      <path
        d="M0 6 Q300 2 600 6 Q900 10 1200 6"
        stroke="#C99A45"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Marigold & jasmine flower clusters along the rope */}
      {Array.from({ length: count }).map((_, i) => {
        const x = (i / (count - 1)) * 1200;
        const isMarigold = i % 2 === 0;
        const flowerColor = isMarigold ? '#D85A32' : '#FFD5A8';
        const innerColor = isMarigold ? '#FFB703' : '#FFF9F0';
        const dropLen = 10 + (i % 3) * 8;

        return (
          <g key={i} transform={`translate(${x}, 6)`}>
            {/* Hanging string */}
            <line x1="0" y1="0" x2="0" y2={dropLen} stroke="#C99A45" strokeWidth="0.8" opacity="0.6" />
            {/* Flower */}
            <circle cx="0" cy={dropLen + 7} r="7" fill={flowerColor} opacity="0.9" />
            <circle cx="0" cy={dropLen + 7} r="4" fill={innerColor} />
            <circle cx="0" cy={dropLen + 7} r="2" fill="#8B1E2F" opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Blooming Pink Lotus Corner Accent
 */
function CornerLotus({ flip }: { flip: boolean }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      {/* Outer petals */}
      {[0, 45, 90, 135].map((angle) => (
        <ellipse
          key={angle}
          cx="40"
          cy="40"
          rx="6"
          ry="20"
          fill="#E8B4C0"
          opacity="0.75"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}
      {/* Middle petals */}
      {[22, 67, 112, 157].map((angle) => (
        <ellipse
          key={angle}
          cx="40"
          cy="40"
          rx="5"
          ry="16"
          fill="#D4788C"
          opacity="0.8"
          transform={`rotate(${angle} 40 40)`}
        />
      ))}
      {/* Inner golden center */}
      <circle cx="40" cy="40" r="7" fill="#C99A45" opacity="0.9" />
      <circle cx="40" cy="40" r="4" fill="#FFF3DB" opacity="0.95" />
      {/* Sage leaf sprigs */}
      <path d="M40 40 Q50 50 60 70" stroke="#6B8C5A" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="58" cy="66" rx="5" ry="8" fill="#7DAF5E" opacity="0.5" transform="rotate(-30 58 66)" />
      <path d="M40 40 Q30 55 25 72" stroke="#6B8C5A" strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="26" cy="69" rx="4" ry="7" fill="#7DAF5E" opacity="0.45" transform="rotate(20 26 69)" />
    </svg>
  );
}

/**
 * Animated Banana Leaf Fronds for envelope page side borders
 */
function BananaLeafSide({ side }: { side: 'left' | 'right' }) {
  const isRight = side === 'right';
  return (
    <div
      className="flex flex-col items-center gap-6 py-8"
      style={{
        animation: 'sway 5s ease-in-out infinite',
        transformOrigin: 'top center',
      }}
    >
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width="52"
          height="90"
          viewBox="0 0 52 90"
          fill="none"
          aria-hidden="true"
          style={{
            transform: isRight ? 'scaleX(-1)' : 'none',
            animationDelay: `${i * 0.6}s`,
            opacity: 0.8 - i * 0.1,
          }}
        >
          {/* Stem */}
          <path
            d="M26 90 C26 70 20 50 10 20"
            stroke="#5D8A3C"
            strokeWidth="2"
            fill="none"
          />
          {/* Broad leaf */}
          <path
            d="M10 20 C0 10 -8 30 10 50 C20 60 26 70 26 90 C26 70 32 55 20 40 C12 30 20 10 10 20 Z"
            fill={`url(#leafGrad${i}${side})`}
            opacity="0.85"
          />
          {/* Midrib */}
          <path
            d="M10 20 C18 35 22 55 26 90"
            stroke="#3D6B25"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
          <defs>
            <linearGradient id={`leafGrad${i}${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8BC34A" />
              <stop offset="50%" stopColor="#5D8A3C" />
              <stop offset="100%" stopColor="#3D6B25" />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
}

export default InvitationEnvelope;
