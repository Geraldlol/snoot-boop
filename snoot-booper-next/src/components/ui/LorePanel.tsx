'use client';

import { useState } from 'react';
import { engine } from '@/engine/engine';
import { LORE_ENTRIES } from '@/engine/systems/meta/lore-system';

const COLOR = '#C4A7E7';
const CATEGORIES = ['cats', 'masters', 'waifus', 'sect'] as const;

export default function LorePanel() {
  const [tab, setTab] = useState<string>('cats');

  const progress = engine.lore.getProgress();

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: COLOR }}>
        📖 Lore Codex
      </h2>

      {/* Progress */}
      <div className="mb-4 p-3 rounded-lg border border-[#C4A7E7]/20 bg-[#C4A7E7]/5">
        <div className="flex justify-between text-[9px] font-mono text-white/40 mb-1">
          <span>Stories Discovered</span>
          <span>{progress.unlocked}/{progress.total} ({Math.round(progress.percentComplete)}%)</span>
        </div>
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress.percentComplete}%`, backgroundColor: COLOR }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="text-xs font-mono px-3 py-1.5 rounded cursor-pointer capitalize"
            style={{
              backgroundColor: tab === cat ? `${COLOR}30` : 'rgba(255,255,255,0.05)',
              color: tab === cat ? COLOR : 'rgba(255,255,255,0.4)',
              borderBottom: tab === cat ? `2px solid ${COLOR}` : '2px solid transparent',
            }}
            onClick={() => setTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        {Object.entries(LORE_ENTRIES[tab as keyof typeof LORE_ENTRIES] ?? {}).map(([id, entry]) => {
          const prog = engine.lore.getEntryProgress(id);
          const unlocked = prog?.unlocked ?? false;
          const current = prog?.current ?? 0;
          const required = entry.fragments;

          return (
            <div key={id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-mono font-bold" style={{ color: unlocked ? COLOR : 'rgba(255,255,255,0.3)' }}>
                  {unlocked ? entry.title : '???'}
                </div>
                {unlocked && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${COLOR}20`, color: COLOR }}>
                    Unlocked
                  </span>
                )}
              </div>

              {/* Fragment progress */}
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(current / required) * 100}%`,
                      backgroundColor: unlocked ? '#50C878' : COLOR,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/50">
                  {current}/{required} fragments
                </span>
              </div>

              {/* Story text */}
              {unlocked ? (
                <div className="text-[10px] font-mono text-white/50 italic leading-relaxed mt-1">
                  {entry.story}
                </div>
              ) : (
                <div className="text-[10px] font-mono text-white/50 italic">
                  Collect more fragments to reveal this story...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
