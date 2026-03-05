/**
 * ResourceBar - Top bar showing currencies and master info.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { MASTERS } from '@/engine/data/masters';

const CURRENCY_DISPLAY = [
  { id: 'bp' as const, icon: '👆', label: 'BP', color: '#E94560' },
  { id: 'pp' as const, icon: '😺', label: 'PP', color: '#FFD700' },
  { id: 'qi' as const, icon: '✨', label: 'Qi', color: '#00BFFF' },
  { id: 'jadeCatnip' as const, icon: '💎', label: 'JC', color: '#7FFFD4' },
  { id: 'spiritStones' as const, icon: '💠', label: 'SS', color: '#9370DB' },
  { id: 'gooseFeathers' as const, icon: '🪶', label: 'GF', color: '#F5F5F5' },
];

export default function ResourceBar() {
  const currencies = useGameStore((s) => s.currencies);
  const selectedMaster = useGameStore((s) => s.selectedMaster);

  const master = selectedMaster ? MASTERS[selectedMaster] : null;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-4 px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10">
      {CURRENCY_DISPLAY.map(({ id, icon, label, color }) => {
        const value = currencies[id];
        // Hide currencies that are still 0 and not primary
        if (value === 0 && id !== 'bp' && id !== 'pp') return null;
        return (
          <div key={id} className="flex items-center gap-1.5">
            <span className="text-xs">{icon}</span>
            <span className="text-[10px] text-white/40 font-mono">{label}:</span>
            <span className="text-xs font-mono font-bold" style={{ color }}>
              {formatNumber(value)}
            </span>
          </div>
        );
      })}

      {master && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-mono font-bold" style={{ color: master.color }}>
            {master.name}
          </span>
          <span className="text-[10px] text-white/30 font-mono">{master.title}</span>
        </div>
      )}
    </div>
  );
}
