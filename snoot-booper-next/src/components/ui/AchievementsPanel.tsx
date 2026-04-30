/**
 * AchievementsPanel — wuxia reskin.
 */

'use client';

import { useState } from 'react';
import { engine } from '@/engine/engine';
import type { AchievementCategory } from '@/engine/systems/social';

const CATS: { id: AchievementCategory | 'all'; label: string; glyph: string }[] = [
  { id: 'all',         label: 'All',         glyph: '全' },
  { id: 'booping',     label: 'Booping',     glyph: '鼻' },
  { id: 'cats',        label: 'Cats',        glyph: '貓' },
  { id: 'waifus',      label: 'Waifus',      glyph: '情' },
  { id: 'goose',       label: 'Goose',       glyph: '鵝' },
  { id: 'cultivation', label: 'Cultivation', glyph: '境' },
  { id: 'secret',      label: 'Secret',      glyph: '秘' },
];

export default function AchievementsPanel() {
  const [active, setActive] = useState<AchievementCategory | 'all'>('all');
  const progress = engine.achievement.getProgress();
  const all = engine.achievement.getAll();
  const filtered = active === 'all' ? all : all.filter((a) => a.category === active);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>勳</span>
        </div>
        <div>
          <div className="h-section">Hall of Merit</div>
          <div className="h-eyebrow">{progress.unlocked} / {progress.total} achievements ({progress.percentage.toFixed(1)}%)</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="meter mb-4">
        <div className="meter-fill" style={{ width: `${progress.percentage}%` }} />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {CATS.map((c) => {
          const a = active === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="font-display text-[10px] tracking-[0.16em] uppercase px-3 py-2 cursor-pointer"
              style={{
                color: a ? 'var(--gold-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${a ? 'var(--gold)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {c.glyph} {c.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map((ach) => <AchRow key={ach.id} a={ach} />)}
        {filtered.length === 0 && (
          <p className="text-center py-8 italic" style={{ color: 'var(--ink-dim)' }}>
            No achievements in this branch yet.
          </p>
        )}
      </div>
    </div>
  );
}

function AchRow({ a }: {
  a: { id: string; name: string; description: string; emoji: string; unlocked: boolean; reward?: { type: string; value: number | string }; hidden?: boolean };
}) {
  const isHidden = a.hidden && !a.unlocked;
  return (
    <div
      className="flex items-start gap-3 p-3"
      style={{
        background: a.unlocked ? 'rgba(230,194,117,0.06)' : 'rgba(0,0,0,0.3)',
        border: `1px solid ${a.unlocked ? 'rgba(230,194,117,0.4)' : 'var(--rule)'}`,
        opacity: a.unlocked ? 1 : 0.6,
      }}
    >
      <div
        className="rune flex-shrink-0"
        style={{
          width: 40, height: 40, fontSize: 20,
          background: a.unlocked
            ? 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.55), rgba(120,80,30,0.45) 60%, rgba(0,0,0,0.4))'
            : 'rgba(0,0,0,0.4)',
          border: `1px solid ${a.unlocked ? 'var(--gold)' : 'var(--rule)'}`,
          color: a.unlocked ? '#fff7df' : 'var(--ink-dim)',
        }}
      >
        {isHidden ? '?' : a.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: a.unlocked ? 'var(--gold-bright)' : 'var(--ink-mute)' }}>
          {isHidden ? '???' : a.name}
        </div>
        <div className="h-eyebrow">{isHidden ? 'Hidden achievement' : a.description}</div>
        {a.reward && !isHidden && (
          <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--jade-bright)' }}>
            ✦ reward · {a.reward.value} {a.reward.type}
          </div>
        )}
      </div>
      {a.unlocked && (
        <span className="font-display text-[14px] flex-shrink-0" style={{ color: 'var(--gold-bright)' }}>✓</span>
      )}
    </div>
  );
}
