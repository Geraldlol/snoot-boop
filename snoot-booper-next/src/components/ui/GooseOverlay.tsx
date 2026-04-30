/**
 * GooseOverlay - HUD for active goose: HP bar, timer, mood indicator.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';

const MOOD_LABELS: Record<string, { label: string; color: string }> = {
  calm: { label: 'CALM', color: '#87CEEB' },
  suspicious: { label: 'SUSPICIOUS', color: '#FFD700' },
  aggressive: { label: 'AGGRESSIVE', color: '#FF6347' },
  rage: { label: 'RAGE', color: '#FF0000' },
};

export default function GooseOverlay() {
  const activeGoose = useGameStore((s) => s.activeGoose);

  if (!activeGoose) return null;

  const hpPercent = (activeGoose.currentHp / activeGoose.maxHp) * 100;
  const timePercent = Math.max(0, (activeGoose.timeRemaining / 30000) * 100);
  const mood = MOOD_LABELS[activeGoose.mood] ?? MOOD_LABELS.calm;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
      {/* Goose banner */}
      <div
        className="px-4 py-2 rounded-lg border backdrop-blur-sm font-mono text-xs text-center"
        style={{ borderColor: mood.color, backgroundColor: `${mood.color}20`, color: mood.color }}
      >
        <div className="font-bold text-sm">{activeGoose.name}</div>
        <div className="text-xs opacity-70">{activeGoose.title} - {mood.label}</div>
      </div>

      {/* HP bar */}
      {activeGoose.maxHp > 1 && (
        <div className="w-48 h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${hpPercent}%`, backgroundColor: mood.color }}
          />
        </div>
      )}

      {/* Timer bar */}
      <div className="w-48 h-1.5 bg-black/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${timePercent}%`,
            backgroundColor: timePercent < 30 ? '#FF4500' : '#50C878',
          }}
        />
      </div>

      {/* Boop goose button */}
      <button
        className="mt-1 px-4 py-1 rounded border font-mono text-xs font-bold cursor-pointer transition-transform active:scale-95"
        style={{
          borderColor: mood.color,
          backgroundColor: `${mood.color}30`,
          color: mood.color,
        }}
        onClick={() => engine.boopGoose()}
      >
        BOOP THE GOOSE
      </button>
    </div>
  );
}
