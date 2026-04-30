'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { CULTIVATION_REALMS, type RealmPassive } from '@/engine/systems/progression/cultivation-system';
import { useState } from 'react';

export default function CultivationPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [, forceUpdate] = useState(0);

  const cult = engine.cultivation;
  const realmData = cult.getCurrentRealmData();
  const progress = cult.getProgress();
  const xpNeeded = cult.getXPForNextRank();
  const canBreak = cult.canBreakthrough();
  const stats = cult.getStats();
  const nextRealm = getNextRealmName();

  function getNextRealmName(): string | null {
    const order = ['mortal', 'qi_condensation', 'foundation', 'core_formation', 'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign'];
    const idx = order.indexOf(cult.currentRealm);
    if (idx < 0 || idx >= order.length - 1) return null;
    return CULTIVATION_REALMS[order[idx + 1] as keyof typeof CULTIVATION_REALMS].name;
  }

  function handleBreakthrough() {
    engine.attemptBreakthrough();
    forceUpdate((n) => n + 1);
  }

  const attempts = cult.tribulationAttempts[
    Object.keys(CULTIVATION_REALMS).find(
      (k) => CULTIVATION_REALMS[k as keyof typeof CULTIVATION_REALMS].order === realmData.order + 1
    ) ?? ''
  ] ?? 0;
  const successChance = Math.min(95, 60 + attempts * 5);

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: realmData.color }}>
        🧘 Cultivation
      </h2>

      {/* Realm Progress */}
      <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: `${realmData.color}30`, backgroundColor: `${realmData.color}10` }}>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-mono font-bold"
            style={{ backgroundColor: `${realmData.color}30`, color: realmData.color }}
          >
            {realmData.name}
          </span>
          <span className="text-xs text-white/50 font-mono">
            Rank {cult.currentRank}/{realmData.ranks === 999 ? '∞' : realmData.ranks}
          </span>
        </div>

        {/* XP Bar */}
        <div className="mb-1">
          <div className="flex justify-between text-[9px] font-mono text-white/40 mb-1">
            <span>XP</span>
            <span>{formatNumber(cult.cultivationXP)} / {formatNumber(xpNeeded)}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress * 100)}%`, backgroundColor: realmData.color }}
            />
          </div>
        </div>

        {/* Breakthrough */}
        {canBreak && nextRealm && (
          <div className="mt-3">
            <div className="text-[9px] font-mono text-white/40 mb-1">
              Breakthrough to {nextRealm} — {successChance}% success
            </div>
            <button
              className="w-full px-3 py-2 rounded text-xs font-mono font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: `${realmData.color}20`,
                color: realmData.color,
                border: `1px solid ${realmData.color}30`,
              }}
              onClick={handleBreakthrough}
            >
              ⚡ Attempt Breakthrough
            </button>
          </div>
        )}
      </div>

      {/* Passives */}
      <div className="mb-4">
        <h3 className="text-xs font-mono text-white/60 font-bold mb-2">Realm Passives</h3>
        <div className="flex flex-col gap-1.5">
          {realmData.passives.map((passive) => {
            const key = `${cult.currentRealm}_${passive.rank}`;
            const unlocked = cult.passivesUnlocked.includes(key);
            return (
              <PassiveRow key={key} passive={passive} unlocked={unlocked} color={realmData.color} />
            );
          })}
        </div>
      </div>

      {/* Previously unlocked passives from earlier realms */}
      {cult.passivesUnlocked.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-mono text-white/60 font-bold mb-2">
            All Unlocked ({cult.getUnlockedPassives().length})
          </h3>
          <div className="flex flex-col gap-1">
            {cult.getUnlockedPassives().map((p, i) => (
              <div key={i} className="text-[9px] font-mono text-white/40 flex items-center gap-1">
                <span style={{ color: realmData.color }}>✦</span>
                <span className="text-white/60">{p.name}</span>
                <span className="text-white/50">— {p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="pt-3 border-t border-white/5">
        <h3 className="text-xs font-mono text-white/60 font-bold mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-white/40">
          <span>Total XP:</span><span className="text-right text-white/60">{formatNumber(stats.totalXPEarned)}</span>
          <span>Breakthroughs:</span><span className="text-right text-white/60">{stats.realmBreakthroughs}</span>
          <span>Tribulation Wins:</span><span className="text-right text-white/60">{stats.tribulationSuccesses}</span>
          <span>Tribulation Fails:</span><span className="text-right text-white/60">{stats.tribulationFailures}</span>
          <span>Dao Wounds:</span><span className="text-right text-white/60">{cult.daoWounds}</span>
        </div>
      </div>
    </div>
  );
}

function PassiveRow({ passive, unlocked, color }: { passive: RealmPassive; unlocked: boolean; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono"
      style={{
        backgroundColor: unlocked ? `${color}10` : 'rgba(255,255,255,0.02)',
        opacity: unlocked ? 1 : 0.4,
      }}
    >
      <span className="text-white/50 w-6">R{passive.rank}</span>
      <span style={{ color: unlocked ? color : 'rgba(255,255,255,0.4)' }} className="font-bold">
        {passive.name}
      </span>
      <span className="text-white/40 ml-auto text-[9px]">{passive.description}</span>
    </div>
  );
}
