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
   * Plays the complete physical envelope opening animation sequence.
   * Purely GPU-composited (transform, opacity) with zero paint/rasterization thrashing.
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
      // Step 1: Seal Breaking & Button/Text Fade (0.0s - 0.28s)
      // Wax seal pops and dissolves with a gentle tilt; button & text fade.
      // -------------------------------------------------------------
      if (buttonRef.current) {
        tl.to(
          buttonRef.current,
          {
            scale: 0.94,
            opacity: 0,
            duration: 0.25,
            ease: 'power2.out',
            pointerEvents: 'none',
          },
          0
        );
      }

      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.25,
            ease: 'power2.out',
          },
          0
        );
      }

      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            scale: 1.15,
            rotation: 12,
            opacity: 0,
            duration: 0.28,
            ease: 'power2.out',
          },
          0
        ).set(
          sealRef.current,
          {
            display: 'none',
          },
          0.29
        );
      }

      // -------------------------------------------------------------
      // Step 2: 3D Top Flap Opens Backward (0.20s - 0.75s)
      // Triangular flap smoothly hinges open backward in 3D.
      // At midpoint (0.45s), zIndex switches behind the rising card.
      // -------------------------------------------------------------
      if (flapRef.current) {
        tl.to(
          flapRef.current,
          {
            rotateX: -180,
            duration: 0.55,
            ease: 'power2.inOut',
            transformOrigin: 'top center',
          },
          0.2
        );

        tl.set(
          flapRef.current,
          {
            zIndex: 5,
          },
          0.45
        );
      }

      // -------------------------------------------------------------
      // Step 3: Royal Invitation Card Glides Up (0.48s - 1.15s)
      // The sacred ivory card rises cleanly out of the pocket cavity,
      // presenting the blessings and names with dignified grandeur.
      // -------------------------------------------------------------
      if (cardRef.current) {
        tl.to(
          cardRef.current,
          {
            y: '-72%',
            scale: 1.02,
            zIndex: 35,
            duration: 0.65,
            ease: 'power3.out',
          },
          0.48
        );
      }

      // -------------------------------------------------------------
      // Step 4: Velvety Dissolve into Main Invitation (1.20s - 1.75s)
      // The revealed card and envelope lift forward together slightly
      // and fade out gracefully, transitioning seamlessly into the page.
      // -------------------------------------------------------------
      if (envelopeRef.current) {
        tl.to(
          envelopeRef.current,
          {
            opacity: 0,
            scale: 1.05,
            y: -16,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          1.2
        );
      }

      if (decorationsRef.current) {
        tl.to(
          decorationsRef.current,
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
          },
          1.2
        );
      }
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
