'use client';

/**
 * AudioController — unlocks AudioContext on first user gesture and routes
 * snoot:* window events to SFX.
 *
 * Mounted once at the root of the game shell. Listens for:
 *   - snoot:boop  { combo, isCrit }       → playBoop / playCrit
 *   - snoot:goose { phase: 'appear'|'hit'} → playHonk
 *   - snoot:victory                       → playVictory
 *   - snoot:ascend                        → playAscend
 */

import { useEffect } from 'react';
import { audio } from '@/lib/audio';
import { useEffectsStore } from '@/store/effects-store';

interface BoopDetail {
  combo?: number;
  isCrit?: boolean;
}

export default function AudioController() {
  const sfxEnabled = useEffectsStore((s) => s.sfxEnabled ?? true);
  const masterVolume = useEffectsStore((s) => s.masterVolume ?? 0.6);

  // Sync settings → audio engine
  useEffect(() => {
    audio.setMuted(!sfxEnabled);
    audio.setVolume(masterVolume);
  }, [sfxEnabled, masterVolume]);

  // First-gesture unlock
  useEffect(() => {
    const unlock = () => {
      audio.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: false });
    window.addEventListener('keydown', unlock, { once: false });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Event router
  useEffect(() => {
    function onBoop(e: Event) {
      const d = (e as CustomEvent<BoopDetail>).detail ?? {};
      if (d.isCrit) audio.playCrit();
      else audio.playBoop(d.combo ?? 0);
    }
    function onGoose(e: Event) {
      const d = (e as CustomEvent<{ phase?: string }>).detail ?? {};
      if (d.phase === 'appear' || d.phase === 'hit') audio.playHonk();
    }
    function onVictory() { audio.playVictory(); }
    function onAscend() { audio.playAscend(); }

    window.addEventListener('snoot:boop', onBoop);
    window.addEventListener('snoot:goose', onGoose);
    window.addEventListener('snoot:victory', onVictory);
    window.addEventListener('snoot:ascend', onAscend);
    return () => {
      window.removeEventListener('snoot:boop', onBoop);
      window.removeEventListener('snoot:goose', onGoose);
      window.removeEventListener('snoot:victory', onVictory);
      window.removeEventListener('snoot:ascend', onAscend);
    };
  }, []);

  return null;
}
