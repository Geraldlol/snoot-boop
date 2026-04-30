'use client';

import { useState, useCallback } from 'react';
import { engine } from '@/engine/engine';
import { GOOSE_ALLIES, LEGENDARY_GEESE } from '@/engine/systems/events/goose-system';
import { formatNumber } from '@/engine/big-number';
import type { GooseAllyType } from '@/engine/types';

export default function GoosePanel() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

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
    forceUpdate();
  }, [forceUpdate]);

  const ALLY_ENTRIES = Object.values(GOOSE_ALLIES);
  const LEGENDARY_ENTRIES = Object.values(LEGENDARY_GEESE);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-mono font-bold" style={{ color: '#F5F5F5' }}>
        Goose Management
      </h2>

      {/* Stats */}
      <div className="bg-black/30 rounded-lg p-3 space-y-2">
        <h3 className="text-xs font-mono text-white/70 uppercase tracking-wider">Stats</h3>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Geese Booped" value={formatNumber(totalBooped)} />
          <Stat label="Golden Geese" value={formatNumber(goldenBoops)} />
          <Stat
            label="Cobra Chicken"
            value={cobraDefeated ? 'Defeated' : 'Undefeated'}
            color={cobraDefeated ? '#50C878' : '#FF6347'}
          />
          <Stat
            label="Rage Goose"
            value={rageBooped ? 'Booped' : 'Not yet'}
            color={rageBooped ? '#50C878' : '#888'}
          />
          <Stat
            label="Golden Crit"
            value={goldenCrit ? 'Yes!' : 'No'}
            color={goldenCrit ? '#FFD700' : '#888'}
          />
        </div>
      </div>

      {/* Ally Selection */}
      <div className="bg-black/30 rounded-lg p-3 space-y-3">
        <h3 className="text-xs font-mono text-white/70 uppercase tracking-wider">Goose Ally</h3>

        {!allyUnlocked ? (
          <div className="text-center py-4">
            <p className="text-xs font-mono text-white/40">
              Defeat the Cobra Chicken to unlock Goose Allies
            </p>
            <p className="text-xs font-mono text-white/50 mt-1">
              (Requires 1000+ geese booped for Cobra Chicken to appear)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {ALLY_ENTRIES.map((ally) => (
              <button
                key={ally.id}
                className="w-full text-left p-3 rounded-lg border transition-all"
                style={{
                  borderColor: selectedAlly === ally.id ? '#F5F5F5' : 'rgba(255,255,255,0.1)',
                  backgroundColor: selectedAlly === ally.id ? 'rgba(245,245,245,0.1)' : 'rgba(0,0,0,0.2)',
                }}
                onClick={() => handleSelectAlly(ally.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-white/90">
                    {ally.name}
                  </span>
                  {selectedAlly === ally.id && (
                    <span className="text-xs font-mono text-[#50C878] border border-[#50C878]/50 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-white/50 mt-1">{ally.description}</p>
                <p className="text-xs font-mono text-white/50 mt-1 italic">
                  &quot;{ally.quote}&quot;
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Legendary Goose Codex */}
      <div className="bg-black/30 rounded-lg p-3 space-y-3">
        <h3 className="text-xs font-mono text-white/70 uppercase tracking-wider">
          Legendary Goose Codex
        </h3>

        <div className="space-y-2">
          {LEGENDARY_ENTRIES.map((goose) => {
            const encountered = goose.id === 'cobraChicken'
              ? cobraDefeated
              : goose.id === 'golden'
              ? goldenBoops > 0
              : totalBooped > 0; // untitled/elder encountered if any boops

            return (
              <div
                key={goose.id}
                className="p-2 rounded border"
                style={{
                  borderColor: encountered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  opacity: encountered ? 1 : 0.5,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/80">
                    {encountered ? goose.name : '???'}
                  </span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: encountered ? '#50C878' : '#888',
                      backgroundColor: encountered ? 'rgba(80,200,120,0.1)' : 'rgba(0,0,0,0.2)',
                    }}
                  >
                    {encountered ? 'Encountered' : 'Unknown'}
                  </span>
                </div>
                {encountered && (
                  <p className="text-xs font-mono text-white/40 mt-1">
                    {goose.title} — Mood: {goose.baseMood}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-black/20 rounded p-2">
      <p className="text-xs font-mono text-white/40">{label}</p>
      <p className="text-xs font-mono font-bold" style={{ color: color ?? '#F5F5F5' }}>
        {value}
      </p>
    </div>
  );
}
