'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auto-start music on first user click anywhere if not explicitly muted
    const handleFirstInteraction = () => {
      const savedPref = sessionStorage.getItem('wedding_music_enabled');
      if (!hasInteracted) {
        setHasInteracted(true);
        if (savedPref !== 'false' && audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              sessionStorage.setItem('wedding_music_enabled', 'true');
            })
            .catch(() => {
              // Browser blocked playback or file not yet available
            });
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      sessionStorage.setItem('wedding_music_enabled', 'false');
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          sessionStorage.setItem('wedding_music_enabled', 'true');
        })
        .catch(() => {
          // Playback error handling
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={weddingConfig.musicPath}
        loop
        preload="auto"
      />

      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? 'Mute background music' : 'Play traditional wedding music'}
        className={`fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-xl transition-all duration-300 border border-antique-gold/50 backdrop-blur-md ${
          isPlaying
            ? 'bg-royal-maroon text-champagne animate-pulse'
            : 'bg-ivory/90 text-royal-maroon hover:bg-ivory'
        }`}
        aria-label={isPlaying ? 'Mute background music' : 'Play traditional wedding music'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-antique-gold animate-bounce" />
        ) : (
          <VolumeX className="w-5 h-5 text-deep-burgundy/60" />
        )}
      </button>
    </>
  );
}

export default MusicToggle;
