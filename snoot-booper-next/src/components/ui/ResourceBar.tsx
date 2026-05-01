/**
 * ResourceBar - Top bar showing currencies and master info.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber, formatDetailed } from '@/engine/big-number';
import { MASTERS } from '@/engine/data/masters';

const CURRENCY_DISPLAY = [
  { id: 'bp' as const, icon: '\uD83D\uDC46', label: 'BP', fullName: 'Boop Points', color: '#E94560', primary: true },
  { id: 'pp' as const, icon: '\uD83D\uDE3A', label: 'PP', fullName: 'Purr Power', color: '#FFD700', primary: true },
  { id: 'qi' as const, icon: '\u2728', label: 'Qi', fullName: 'Qi Energy', color: '#00BFFF', primary: false },
  { id: 'jadeCatnip' as const, icon: '\uD83D\uDC8E', label: 'JC', fullName: 'Jade Catnip', color: '#7FFFD4', primary: false },
  { id: 'spiritStones' as const, icon: '\uD83D\uDCA0', label: 'SS', fullName: 'Spirit Stones', color: '#9370DB', primary: false },
  { id: 'destinyThreads' as const, icon: '\uD83E\uDDF5', label: 'DT', fullName: 'Destiny Threads', color: '#D3B8FF', primary: false },
  { id: 'gooseFeathers' as const, icon: '\uD83E\uDEB6', label: 'GF', fullName: 'Goose Feathers', color: '#F5F5F5', primary: false },
];

export default function ResourceBar() {
  const currencies = useGameStore((s) => s.currencies);
  const selectedMaster = useGameStore((s) => s.selectedMaster);

  const master = selectedMaster ? MASTERS[selectedMaster] : null;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-1 px-4 py-2 bg-black/50 backdrop-blur-sm border-b border-white/10">
      {CURRENCY_DISPLAY.map(({ id, icon, label, fullName, color, primary }, idx) => {
        const value = currencies[id];
        // Hide non-primary currencies that are still 0
        if (value === 0 && !primary) return null;
        return (
          <div key={id} className="flex items-center gap-1.5 group relative">
            {idx > 0 && <div className="w-px h-4 bg-white/10 mr-1" />}
            <span className="text-xs">{icon}</span>
            <span className="text-xs text-white/60 font-mono">{label}:</span>
            <span className="text-sm font-mono font-bold" style={{ color }} aria-label={`${fullName}: ${formatDetailed(value)}`}>
              {formatNumber(value)}
            </span>
            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-black/90 rounded text-xs text-white/70 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {fullName}: {formatDetailed(value)}
            </div>
          </div>
        );
      })}

      {master && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-mono font-bold" style={{ color: master.color }}>
            {master.name}
          </span>
          <span className="text-xs text-white/50 font-mono">{master.title}</span>
        </div>
      )}
    </div>
  );
}
