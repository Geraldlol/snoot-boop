/**
 * LorePanel — Codex (wuxia reskin).
 */

'use client';

import { useState } from 'react';
import { engine } from '@/engine/engine';
import { LORE_ENTRIES } from '@/engine/systems/meta/lore-system';

const CATEGORIES = ['cats', 'masters', 'waifus', 'sect'] as const;

export default function LorePanel() {
  const [tab, setTab] = useState<typeof CATEGORIES[number]>('cats');
  const progress = engine.lore.getProgress();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: '#C4A7E7', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>經</span>
        </div>
        <div>
          <div className="h-section">Sect Codex</div>
          <div className="h-eyebrow">{progress.unlocked} / {progress.total} stories revealed</div>
        </div>
      </div>

      <div className="meter mb-4">
        <div className="meter-fill" style={{ width: `${progress.percentComplete}%`, background: 'linear-gradient(90deg, #5b3b8a, #C4A7E7, #fff7df)' }} />
      </div>

      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {CATEGORIES.map((c) => {
          const active = tab === c;
          return (
            <button
              key={c}
              onClick={() => setTab(c)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: active ? '#C4A7E7' : 'var(--ink-mute)',
                borderBottom: `2px solid ${active ? '#C4A7E7' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
        {Object.entries(LORE_ENTRIES[tab] ?? {}).map(([id, entry]) => {
          const prog = engine.lore.getEntryProgress(id);
          const unlocked = prog?.unlocked ?? false;
          const current = prog?.current ?? 0;
          const required = entry.fragments;
          const pct = (current / required) * 100;
          return (
            <div
              key={id}
              className="panel p-3"
              style={{
                background: unlocked ? 'rgba(196,167,231,0.05)' : 'rgba(0,0,0,0.3)',
                borderColor: unlocked ? '#C4A7E788' : 'var(--rule)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: unlocked ? '#C4A7E7' : 'var(--ink-mute)' }}>
                  {unlocked ? entry.title : '???'}
                </div>
                <span className="h-eyebrow">{current} / {required} fragments</span>
              </div>
              <div className="meter mb-2" style={{ height: 4 }}>
                <div className="meter-fill" style={{ width: `${pct}%`, background: unlocked ? 'linear-gradient(90deg, #5b3b8a, #C4A7E7, #fff7df)' : 'rgba(196,167,231,0.4)' }} />
              </div>
              <div className="text-xs italic leading-relaxed" style={{ color: unlocked ? 'var(--ink)' : 'var(--ink-dim)' }}>
                {unlocked ? entry.story : 'Collect more fragments to reveal this scroll...'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
