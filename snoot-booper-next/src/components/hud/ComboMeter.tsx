'use client';

/**
 * ComboMeter — center-screen combo readout.
 * Reads from game-store.boop.comboCount which decays itself on the 2s timer.
 * Heat tints at ×10 (gold) and ×25 (vermillion).
 */

import { useEffect, useState } from 'react';

export default function ComboMeter() {
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    function onBoop(e: Event) {
      const detail = (e as CustomEvent<{ combo?: number }>).detail ?? {};
      setCombo(detail.combo ?? 0);
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => setCombo(0), 1400);
    }

    window.addEventListener('snoot:boop', onBoop);
    return () => {
      window.removeEventListener('snoot:boop', onBoop);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  if (combo < 5) return null;

  const heat = combo >= 25 ? 'rage' : combo >= 10 ? 'hot' : 'warm';
  const color =
    heat === 'rage' ? 'var(--vermillion-bright)' : heat === 'hot' ? 'var(--gold-bright)' : '#fff7df';
  const glow =
    heat === 'rage'
      ? '0 0 18px rgba(255,139,110,0.55)'
      : heat === 'hot'
      ? '0 0 16px rgba(255,225,170,0.45)'
      : '0 0 10px rgba(255,225,170,0.35)';
  const fontSize = Math.min(34, 22 + combo * 0.18);

  return (
    <div
      className="pointer-events-none fixed right-8 top-24 z-40 select-none border px-3 py-2 text-right"
      style={{
        background: 'rgba(6, 10, 20, 0.62)',
        borderColor: heat === 'rage' ? 'rgba(214,91,64,0.44)' : 'rgba(230,194,117,0.24)',
        boxShadow: '0 10px 28px -20px rgba(0,0,0,0.9)',
        transition: 'opacity 120ms ease-out',
      }}
    >
      <div
        className="font-display nums font-black uppercase"
        style={{
          color,
          textShadow: glow,
          fontSize,
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        ×{combo}
      </div>
      <div
        className="font-mono text-[10px] uppercase"
        style={{ color: 'var(--ink-mute)', letterSpacing: 0 }}
      >
        combo
      </div>
    </div>
  );
}
