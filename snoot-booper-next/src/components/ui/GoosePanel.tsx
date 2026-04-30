/**
 * GoosePanel — Goose Watch (wuxia reskin).
 * Stats + ally selection (4 allies, 2x2 grid) + legendary codex.
 */

'use client';

import { useState, useCallback } from 'react';
import { engine } from '@/engine/engine';
import { GOOSE_ALLIES, LEGENDARY_GEESE } from '@/engine/systems/events/goose-system';
import { formatNumber } from '@/engine/big-number';
import type { GooseAllyType } from '@/engine/types';

const ALLY_GLYPHS: Record<string, string> = {
  guard: '盾', attack: '矛', chaos: '亂', honk: '鳴',
};

export default function GoosePanel() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const goose = engine.goose;
  const totalBooped = goose.gooseBoops;
  const cobraDefeated = goose.cobraChickenDefeated;
  const allyUnlocked = goose.gooseAllyUnlocked;
  const selectedAlly = goose.selectedAlly;
  const goldenBoops = goose.goldenGooseBoops;
  const rageBooped = goose.rageGooseBooped;
  const goldenCrit = goose.goldenGooseCrit;

  const handleSelectAlly = useCallback((allyId: GooseAllyType) => {
    engine.selectGooseAlly(allyId);
    refresh();
  }, [refresh]);

  const ALLY_ENTRIES = Object.values(GOOSE_ALLIES);
  const LEGENDARY_ENTRIES = Object.values(LEGENDARY_GEESE);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="glyph-badge" style={{ color: '#F5F5F5', width: 38, height: 38 }}>
            <span style={{ fontSize: 16 }}>鵝</span>
          </div>
          <div>
            <div className="h-section">Goose Watch</div>
            <div className="h-eyebrow">Vigilance against the honking menace</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-3">Tally of Encounters</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Stat label="Geese Booped" value={formatNumber(totalBooped)} />
          <Stat label="Golden Geese" value={formatNumber(goldenBoops)} tone="var(--gold-bright)" />
          <Stat
            label="Cobra Chicken"
            value={cobraDefeated ? 'Defeated' : 'At Large'}
            tone={cobraDefeated ? 'var(--jade-bright)' : 'var(--vermillion-bright)'}
          />
          <Stat label="Rage Booped" value={rageBooped ? 'Yes' : 'Not yet'} tone={rageBooped ? 'var(--jade-bright)' : 'var(--ink-mute)'} />
          <Stat label="Golden Crit"  value={goldenCrit ? 'Achieved' : 'Sought'} tone={goldenCrit ? 'var(--gold-bright)' : 'var(--ink-mute)'} />
        </div>
      </div>

      {/* Ally selection */}
      <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-3">Goose Ally</div>
        {!allyUnlocked ? (
          <div className="text-center py-6">
            <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
              The Cobra Chicken still walks the mountain.
            </p>
            <p className="text-sm italic mt-1" style={{ color: 'var(--ink-dim)' }}>
              Defeat it to recruit a goose ally. Requires 1000+ geese booped first.
            </p>
            <div className="meter mt-4 max-w-sm mx-auto">
              <div
                className="meter-fill crimson"
                style={{ width: `${Math.min(100, (totalBooped / 1000) * 100)}%` }}
              />
            </div>
            <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--ink-dim)' }}>
              {totalBooped} / 1000 boops
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ALLY_ENTRIES.map((ally) => {
              const active = selectedAlly === ally.id;
              const glyph = ALLY_GLYPHS[ally.id] ?? '鵝';
              return (
                <button
                  key={ally.id}
                  onClick={() => handleSelectAlly(ally.id)}
                  className={`panel card-row text-left p-3 ${active ? 'selected-ring' : ''}`}
                  style={{
                    background: active ? 'rgba(245,245,245,0.06)' : 'rgba(0,0,0,0.3)',
                    borderColor: active ? '#F5F5F5' : 'var(--rule)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="rune flex-shrink-0"
                      style={{
                        width: 44, height: 44, fontSize: 18,
                        background: 'radial-gradient(circle at 35% 30%, rgba(245,245,245,0.45), rgba(120,120,120,0.3) 60%, rgba(0,0,0,0.4))',
                        border: '1px solid rgba(245,245,245,0.7)',
                        color: '#fff7df',
                      }}
                    >
                      {glyph}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>
                          {ally.name}
                        </span>
                        {active && (
                          <span className="font-display text-[9px] tracking-[0.16em] px-1.5 py-0.5" style={{ color: 'var(--jade-bright)', border: '1px solid var(--jade-deep)' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--ink-mute)' }}>{ally.description}</p>
                      <p className="text-xs italic mt-1" style={{ color: 'var(--ink-dim)' }}>
                        &ldquo;{ally.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Legendary codex */}
      <div className="panel p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-3">Legendary Codex</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {LEGENDARY_ENTRIES.map((g) => {
            const encountered =
              g.id === 'cobraChicken'
                ? cobraDefeated
                : g.id === 'golden'
                ? goldenBoops > 0
                : totalBooped > 0;
            return (
              <div
                key={g.id}
                className="card-row p-3"
                style={{
                  background: encountered ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
                  border: `1px solid ${encountered ? 'var(--rule)' : 'var(--rule)'}`,
                  opacity: encountered ? 1 : 0.5,
                  filter: encountered ? 'none' : 'grayscale(0.7)',
                  borderRadius: 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>
                    {encountered ? g.name : '???'}
                  </span>
                  <span
                    className="font-display text-[9px] tracking-[0.16em] uppercase px-1.5 py-0.5"
                    style={{
                      color: encountered ? 'var(--jade-bright)' : 'var(--ink-dim)',
                      border: `1px solid ${encountered ? 'var(--jade-deep)' : 'var(--rule)'}`,
                    }}
                  >
                    {encountered ? 'Encountered' : 'Unknown'}
                  </span>
                </div>
                {encountered && (
                  <div className="h-eyebrow mt-1">
                    {g.title} · Mood: {g.baseMood}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <div className="h-eyebrow">{label}</div>
      <div className="font-display nums text-[14px] mt-0.5" style={{ color: tone ?? '#fff7df' }}>
        {value}
      </div>
    </div>
  );
}
