'use client';

import { useEffect, useRef } from 'react';
import { audioEngine } from '@/engine/audio/audio-engine';
import { ambientMusic } from '@/engine/audio/ambient-music';
import { eventBus, EVENTS } from '@/engine/event-bus';
import { useEffectsStore } from '@/store/effects-store';

/**
 * useAudio - Wire the AudioEngine + AmbientMusic to game events via eventBus.
 *
 * Initializes Web Audio on first user click (browser autoplay policy).
 * Subscribes to BOOP, GOOSE_SPAWN, GOOSE_BOOPED, ACHIEVEMENT_UNLOCK,
 * BUILDING_BUILT, and TIME_CHANGE events.
 */
export function useAudio() {
  const initRef = useRef(false);
  const musicEnabled = useEffectsStore((s) => s.musicEnabled);
  const sfxEnabled = useEffectsStore((s) => s.sfxEnabled);
  const masterVolume = useEffectsStore((s) => s.masterVolume);

  // Init audio on first user click
  useEffect(() => {
    const handleClick = () => {
      if (!initRef.current) {
        const ok = audioEngine.init();
        if (ok) {
          initRef.current = true;
          if (musicEnabled) {
            ambientMusic.start();
          }
        }
      }
    };

    document.addEventListener('click', handleClick, { once: false });
    return () => document.removeEventListener('click', handleClick);
  }, [musicEnabled]);

  // Subscribe to game events for SFX
  useEffect(() => {
    if (!sfxEnabled) return;

    const unsubs: (() => void)[] = [];

    unsubs.push(
      eventBus.on(EVENTS.BOOP, (data: unknown) => {
        const d = data as { isCrit?: boolean } | null;
        if (d?.isCrit) {
          audioEngine.playCritBoop();
        } else {
          audioEngine.playBoop();
        }
      }),
    );

    unsubs.push(
      eventBus.on(EVENTS.GOOSE_SPAWN, () => {
        audioEngine.playGooseAppear();
      }),
    );

    unsubs.push(
      eventBus.on(EVENTS.GOOSE_BOOPED, () => {
        audioEngine.playHonk();
      }),
    );

    unsubs.push(
      eventBus.on(EVENTS.ACHIEVEMENT_UNLOCK, () => {
        audioEngine.playAchievement();
      }),
    );

    unsubs.push(
      eventBus.on(EVENTS.BUILDING_BUILT, () => {
        audioEngine.playBuildComplete();
      }),
    );

    return () => unsubs.forEach((fn) => fn());
  }, [sfxEnabled]);

  // Music toggle
  useEffect(() => {
    if (!initRef.current) return;
    if (musicEnabled) {
      ambientMusic.start();
    } else {
      ambientMusic.stop();
    }
  }, [musicEnabled]);

  // Master volume
  useEffect(() => {
    audioEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  // Night mode for music (listens to TIME_CHANGE events)
  useEffect(() => {
    const unsub = eventBus.on(EVENTS.TIME_CHANGE, (data: unknown) => {
      const d = data as { timeOfDay?: string } | null;
      const isNight = d?.timeOfDay === 'night';
      ambientMusic.setNightMode(isNight);
    });
    return unsub;
  }, []);
}
