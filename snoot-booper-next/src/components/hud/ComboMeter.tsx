'use client';

/**
 * ComboMeter — center-screen combo readout.
 * Reads from game-store.boop.comboCount which decays itself on the 2s timer.
 * Heat tints at ×10 (gold) and ×25 (vermillion).
 */

import { useGameStore } from '@/store/game-store';

export default function ComboMeter() {
  const combo = useGameStore((s) => s.boop.comboCount);
  if (combo < 2) return null;

  const heat = combo >= 25 ? 'rage' : combo >= 10 ? 'hot' : 'warm';
  const color =
    heat === 'rage' ? 'var(--vermillion-bright)' : heat === 'hot' ? 'var(--gold-bright)' : '#fff7df';
  const glow =
    heat === 'rage'
      ? '0 0 32px rgba(255,139,110,0.9), 0 0 64px rgba(214,91,64,0.6)'
      : heat === 'hot'
      ? '0 0 28px rgba(255,225,170,0.8), 0 0 56px rgba(230,194,117,0.5)'
      : '0 0 18px rgba(255,225,170,0.6)';
  const scale = Math.min(1.5, 1 + combo * 0.01);

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-32 -translate-x-1/2 z-40 select-none"
      style={{ transition: 'transform 120ms ease-out' }}
    >
      <div
        className="font-display nums font-black tracking-[0.18em] uppercase text-center"
        style={{
          color,
          textShadow: glow,
          fontSize: 56 * scale,
          lineHeight: 1,
        }}
      >
        ×{combo}
      </div>
      <div
        className="h-eyebrow text-center mt-1"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.32em' }}
      >
        combo
      </div>
    </div>
  );
}
