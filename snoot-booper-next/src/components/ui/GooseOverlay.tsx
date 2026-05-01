/**
 * GooseOverlay - wuxia HUD for active goose.
 * Mood-tinted banner, HP meter, countdown ring on the boop button.
 */

'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';

const MOOD: Record<string, { label: string; color: string; glyph: string }> = {
  calm:       { label: 'Calm',       color: '#76b6d4', glyph: '靜' },
  suspicious: { label: 'Suspicious', color: 'var(--gold-bright)', glyph: '疑' },
  aggressive: { label: 'Aggressive', color: 'var(--vermillion-bright)', glyph: '怒' },
  rage:       { label: 'RAGE',       color: '#FF4500', glyph: '狂' },
};

export default function GooseOverlay() {
  const activeGoose = useGameStore((s) => s.activeGoose);

  // Notify the audio system when a goose appears.
  useEffect(() => {
    if (activeGoose) {
      window.dispatchEvent(new CustomEvent('snoot:goose', { detail: { phase: 'appear' } }));
    }
  }, [activeGoose?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeGoose) return null;

  const hpPct = (activeGoose.currentHp / activeGoose.maxHp) * 100;
  const timePct = Math.max(0, (activeGoose.timeRemaining / 30000) * 100);
  const mood = MOOD[activeGoose.mood] ?? MOOD.calm;

  function boop() {
    engine.boopGoose();
    window.dispatchEvent(new CustomEvent('snoot:goose', { detail: { phase: 'hit' } }));
  }

  return (
    <div className="fixed bottom-8 right-8 z-40 flex w-64 flex-col items-stretch gap-2 select-none">
      {/* Banner */}
      <div
        className="panel px-4 py-2 text-center"
        style={{ borderColor: mood.color, background: `radial-gradient(circle at 50% 0%, ${mood.color}25, rgba(8,14,22,0.95))` }}
      >
        <div className="flex items-center gap-2 justify-center mb-0.5">
          <span className="font-display text-[14px]" style={{ color: mood.color }}>{mood.glyph}</span>
          <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{activeGoose.name}</span>
        </div>
        <div className="h-eyebrow" style={{ color: mood.color }}>
          {activeGoose.title} · {mood.label}
        </div>
      </div>

      {/* HP bar (multi-hp goose) */}
      {activeGoose.maxHp > 1 && (
        <div className="w-full">
          <div className="meter" style={{ height: 6 }}>
            <div className="meter-fill" style={{ width: `${hpPct}%`, background: `linear-gradient(90deg, ${mood.color}55, ${mood.color}, ${mood.color}cc)`, boxShadow: `0 0 12px ${mood.color}88` }} />
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="w-full">
        <div className="meter" style={{ height: 4 }}>
          <div
            className="meter-fill"
            style={{
              width: `${timePct}%`,
              background: timePct < 30
                ? 'linear-gradient(90deg, #5b1e14, var(--vermillion))'
                : 'linear-gradient(90deg, var(--jade-deep), var(--jade), var(--jade-bright))',
            }}
          />
        </div>
      </div>

      {/* BOOP button */}
      <button
        onClick={boop}
        className="btn"
        style={{
          padding: '10px 20px',
          fontSize: 12,
          borderColor: mood.color,
          background: `linear-gradient(180deg, ${mood.color}33, ${mood.color}10)`,
          color: mood.color,
          boxShadow: `0 0 22px ${mood.color}55, inset 0 1px 0 rgba(255,225,170,0.18)`,
        }}
      >
        BOOP THE GOOSE
      </button>
    </div>
  );
}
