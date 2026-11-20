'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';

export interface UseEnvelopeAnimationOptions {
  onComplete?: () => void;
  onStart?: () => void;
}

export interface UseEnvelopeAnimationReturn {
  envelopeRef: React.RefObject<HTMLDivElement | null>;
  flapRef: React.RefObject<HTMLDivElement | null>;
  sealRef: React.RefObject<HTMLDivElement | null>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  decorationsRef: React.RefObject<HTMLDivElement | null>;
  playAnimation: (onCompleteOverride?: () => void) => void;
  resetAnimation: () => void;
  isAnimating: boolean;
}

/**
 * Custom hook to control the GSAP-powered 3D envelope opening animation sequence.
 * Sequences realistic physical actions: button pulse -> envelope lift -> wax seal break ->
 * top flap 3D fold-back -> invitation card reveal and slide up -> cinematic card viewport expansion.
 */
export function useEnvelopeAnimation(
  options: UseEnvelopeAnimationOptions = {}
): UseEnvelopeAnimationReturn {
  const { onComplete, onStart } = options;

  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for animated elements
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const decorationsRef = useRef<HTMLDivElement | null>(null);

  // GSAP context and timeline references for safe cleanup
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Initialize GSAP context scoped to container
  useEffect(() => {
    ctxRef.current = gsap.context(() => {}, containerRef);
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ctxRef.current?.revert();
    };
  }, []);

  /**
   * Resets all animated elements back to their pristine initial states.
   */
  const resetAnimation = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    setIsAnimating(false);

    // Revert inline styles to guarantee clean DOM state
    const elements = [
      envelopeRef.current,
      flapRef.current,
      sealRef.current,
      cardRef.current,
      buttonRef.current,
      textRef.current,
      decorationsRef.current,
    ].filter(Boolean);

    if (elements.length > 0) {
      gsap.killTweensOf(elements);
      gsap.set(elements, { clearProps: 'all' });
    }

    // Set deterministic initial 3D transforms
    if (flapRef.current) {
      gsap.set(flapRef.current, {
        transformOrigin: 'top center',
        rotateX: 0,
        zIndex: 30,
      });
    }

    if (cardRef.current) {
      gsap.set(cardRef.current, {
        y: '0%',
        scale: 1,
        zIndex: 10,
        opacity: 1,
        borderRadius: '0.75rem',
      });
    }

    if (sealRef.current) {
      gsap.set(sealRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        display: 'flex',
      });
    }

    if (envelopeRef.current) {
      gsap.set(envelopeRef.current, {
        scale: 1,
        y: 0,
        opacity: 1,
      });
    }

    if (buttonRef.current) {
      gsap.set(buttonRef.current, {
        scale: 1,
        opacity: 1,
        pointerEvents: 'auto',
      });
    }

    if (textRef.current) {
      gsap.set(textRef.current, {
        opacity: 1,
        y: 0,
      });
    }

    if (decorationsRef.current) {
      gsap.set(decorationsRef.current, {
        opacity: 1,
      });
    }
  }, []);

  /**
   * Plays the complete 7-step physical envelope opening animation sequence.
   */
  const playAnimation = useCallback(
    (onCompleteOverride?: () => void) => {
      if (isAnimating) return;
      setIsAnimating(true);
      onStart?.();

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          if (onCompleteOverride) {
            onCompleteOverride();
          } else if (onComplete) {
            onComplete();
          }
        },
      });

      timelineRef.current = tl;

      // -------------------------------------------------------------
      // Step 1: Button Flash & Fade (0.0s)
      // Button glows brighter, pulses up slightly, then gently fades
      // along with helper text so full focus rests on the envelope.
      // -------------------------------------------------------------
      if (buttonRef.current) {
        tl.to(
          buttonRef.current,
          {
            scale: 1.08,
            boxShadow:
              '0 0 35px rgba(232, 201, 122, 0.9), 0 0 70px rgba(201, 154, 69, 0.6)',
            filter: 'brightness(1.25)',
            duration: 0.25,
            ease: 'power2.out',
          },
          0
        ).to(
          buttonRef.current,
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            pointerEvents: 'none',
          },
          0.25
        );
      }

      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: 'power2.in',
          },
          0.15
        );
      }

      // -------------------------------------------------------------
      // Step 2: Envelope Lift (0.3s)
      // Envelope lifts slightly forward in 3D space and shadow deepens.
      // -------------------------------------------------------------
      if (envelopeRef.current) {
        tl.to(
          envelopeRef.current,
          {
            scale: 1.05,
            y: -8,
            boxShadow:
              '0 30px 60px -10px rgba(0, 0, 0, 0.75), 0 15px 35px -5px rgba(84, 20, 38, 0.8), 0 0 40px rgba(201, 154, 69, 0.3)',
            duration: 0.5,
            ease: 'power2.out',
          },
          0.3
        );
      }

      // -------------------------------------------------------------
      // Step 3: Seal Break (0.6s)
      // Wax seal cracks - scale up slightly, fades with a gentle tilt
      // like breaking an auspicious royal wax seal.
      // -------------------------------------------------------------
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            scale: 1.25,
            rotation: 18,
            opacity: 0,
            filter: 'blur(3px)',
            duration: 0.35,
            ease: 'back.in(1.8)',
          },
          0.6
        ).set(
          sealRef.current,
          {
            display: 'none',
          },
          0.95
        );
      }

      // -------------------------------------------------------------
      // Step 4: Flap Open (0.9s)
      // Top triangular flap rotates backward 180 degrees using 3D perspective.
      // At halfway point (90 deg), its zIndex drops behind the emerging card.
      // -------------------------------------------------------------
      if (flapRef.current) {
        tl.to(
          flapRef.current,
          {
            rotateX: -180,
            duration: 0.8,
            ease: 'power2.inOut',
            transformOrigin: 'top center',
          },
          0.9
        );

        // Switch flap z-index halfway so it rests behind the card
        tl.set(
          flapRef.current,
          {
            zIndex: 5,
          },
          1.3
        );
      }

      // -------------------------------------------------------------
      // Step 5: Card Slide Up (1.3s)
      // The pristine ivory invitation card rises upward from inside
      // the pocket cavity to sit prominently above the envelope.
      // -------------------------------------------------------------
      if (cardRef.current) {
        tl.to(
          cardRef.current,
          {
            y: '-65%',
            zIndex: 35,
            boxShadow:
              '0 20px 40px -8px rgba(0, 0, 0, 0.5), 0 0 25px rgba(201, 154, 69, 0.4)',
            duration: 0.7,
            ease: 'power2.out',
          },
          1.3
        );
      }

      // -------------------------------------------------------------
      // Step 6: Card Expand (2.0s)
      // The invitation card expands grandly to fill the entire viewport:
      // - Scales up smoothly
      // - Border radius softens from rounded to 0
      // - Background fills into radiant ivory
      // - Envelope body and surrounding decorations fade away
      // -------------------------------------------------------------
      if (cardRef.current) {
        // Calculate dynamic scale factor to cover the entire viewport
        const cardEl = cardRef.current;
        const currentWidth = cardEl.offsetWidth || 360;
        const currentHeight = cardEl.offsetHeight || 240;
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;

        const scaleX = viewportWidth / currentWidth;
        const scaleY = viewportHeight / currentHeight;
        const expansionScale = Math.max(scaleX, scaleY) * 1.25;

        tl.to(
          cardRef.current,
          {
            scale: expansionScale,
            borderRadius: 0,
            backgroundColor: '#FFF9F0',
            duration: 0.8,
            ease: 'power3.inOut',
          },
          2.0
        );
      }

      // Fade out background envelope structure and decorations during expansion
      if (envelopeRef.current) {
        tl.to(
          envelopeRef.current,
          {
            opacity: 0,
            scale: 1.15,
            duration: 0.65,
            ease: 'power2.in',
          },
          2.15
        );
      }

      if (decorationsRef.current) {
        tl.to(
          decorationsRef.current,
          {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in',
          },
          2.1
        );
      }

      // -------------------------------------------------------------
      // Step 7: Fade Complete (2.8s)
      // The timeline automatically calls onComplete callback at end.
      // -------------------------------------------------------------
    },
    [isAnimating, onStart, onComplete]
  );

  return {
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
  };
}

export default useEnvelopeAnimation;
