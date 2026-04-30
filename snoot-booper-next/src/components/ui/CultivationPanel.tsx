/**
 * CultivationPanel — Realms (wuxia reskin).
 * Realm progression with breakthrough ritual button.
 */

'use client';

import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { CULTIVATION_REALMS, type RealmPassive } from '@/engine/systems/progression/cultivation-system';
import { useState } from 'react';

const REALM_ORDER = [
  'mortal', 'qi_condensation', 'foundation', 'core_formation',
  'nascent_soul', 'dao_seeking', 'tribulation', 'immortal', 'heavenly_sovereign',
] as const;

export default function CultivationPanel() {
  const [, force] = useState(0);
  const cult = engine.cultivation;
  const realmData = cult.getCurrentRealmData();
  const progress = cult.getProgress();
  const xpNeeded = cult.getXPForNextRank();
  const canBreak = cult.canBreakthrough();
  const stats = cult.getStats();
  const idx = REALM_ORDER.indexOf(cult.currentRealm as typeof REALM_ORDER[number]);
  const nextRealm = idx >= 0 && idx < REALM_ORDER.length - 1 ? CULTIVATION_REALMS[REALM_ORDER[idx + 1]] : null;
  const attempts = cult.tribulationAttempts[
    Object.keys(CULTIVATION_REALMS).find(
      (k) => CULTIVATION_REALMS[k as keyof typeof CULTIVATION_REALMS].order === realmData.order + 1
    ) ?? ''
  ] ?? 0;
  const successChance = Math.min(95, 60 + attempts * 5);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="glyph-badge"
          style={{ color: realmData.color, width: 38, height: 38 }}
        >
          <span style={{ fontSize: 16 }}>境</span>
        </div>
        <div>
          <div className="h-section">Cultivation Realms</div>
          <div className="h-eyebrow">The path of qi refinement</div>
        </div>
      </div>

      {/* Current realm hero card */}
      <div
        className="panel panel-ornate panel-elite p-5 mb-5 relative"
        style={{ borderColor: `${realmData.color}aa`, background: `linear-gradient(180deg, ${realmData.color}10, rgba(8,14,22,0.95))` }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="rune"
            style={{
              width: 64, height: 64, fontSize: 30,
              background: `radial-gradient(circle at 35% 30%, ${realmData.color}66, ${realmData.color}22 60%, rgba(0,0,0,0.4))`,
              border: `1px solid ${realmData.color}aa`,
              color: '#fff7df',
              textShadow: `0 0 16px ${realmData.color}cc`,
            }}
          >
            道
          </div>
          <div className="flex-1">
            <div className="font-display text-[18px] font-black tracking-[0.08em]" style={{ color: realmData.color }}>
              {realmData.name}
            </div>
            <div className="h-eyebrow mt-1">
              Rank {cult.currentRank} / {realmData.ranks === 999 ? '∞' : realmData.ranks}
            </div>
          </div>
        </div>

        <div className="flex justify-between h-eyebrow mb-1">
          <span>Cultivation XP</span>
          <span>{formatNumber(cult.cultivationXP)} / {formatNumber(xpNeeded)}</span>
        </div>
        <div className="meter mb-3">
          <div
            className="meter-fill"
            style={{ width: `${Math.min(100, progress * 100)}%`, background: `linear-gradient(90deg, ${realmData.color}55, ${realmData.color}, ${realmData.color}cc)` }}
          />
        </div>

        {canBreak && nextRealm && (
          <>
            <div className="h-eyebrow mb-2">
              Breakthrough to <span style={{ color: nextRealm.color }}>{nextRealm.name}</span> · {successChance}% success
            </div>
            <button
              className="btn ascend-btn ready w-full"
              onClick={() => { engine.attemptBreakthrough(); force((n) => n + 1); }}
            >
              ⚡ Attempt the Breakthrough
            </button>
          </>
        )}
      </div>

      {/* Current realm passives */}
      <div className="mb-5">
        <div className="h-section mb-2 text-left" style={{ fontSize: 11 }}>Realm Passives</div>
        <div className="flex flex-col gap-1.5">
          {realmData.passives.map((p) => {
            const key = `${cult.currentRealm}_${p.rank}`;
            const unlocked = cult.passivesUnlocked.includes(key);
            return <PassiveRow key={key} passive={p} unlocked={unlocked} color={realmData.color} />;
          })}
        </div>
      </div>

      {/* All unlocked */}
      {cult.passivesUnlocked.length > 0 && (
        <div className="mb-5">
          <div className="h-section mb-2 text-left" style={{ fontSize: 11 }}>
            Unlocked Across All Realms ({cult.getUnlockedPassives().length})
          </div>
          <div className="flex flex-col gap-0.5">
            {cult.getUnlockedPassives().map((p, i) => (
              <div key={i} className="text-xs flex items-center gap-2">
                <span style={{ color: realmData.color }}>✦</span>
                <span style={{ color: 'var(--ink)' }}>{p.name}</span>
                <span style={{ color: 'var(--ink-dim)' }}>— {p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-2">Sect Records</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
          <Pair label="Total XP" value={formatNumber(stats.totalXPEarned)} />
          <Pair label="Breakthroughs" value={String(stats.realmBreakthroughs)} />
          <Pair label="Tribulation Wins" value={String(stats.tribulationSuccesses)} />
          <Pair label="Tribulation Fails" value={String(stats.tribulationFailures)} />
          <Pair label="Dao Wounds" value={String(cult.daoWounds)} />
        </div>
      </div>
    </div>
  );
}

function PassiveRow({ passive, unlocked, color }: { passive: RealmPassive; unlocked: boolean; color: string }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 font-mono text-xs"
      style={{
        background: unlocked ? `${color}10` : 'rgba(0,0,0,0.3)',
        border: `1px solid ${unlocked ? `${color}44` : 'var(--rule)'}`,
        opacity: unlocked ? 1 : 0.5,
      }}
    >
      <span className="font-display text-[10px] tracking-[0.16em]" style={{ color: 'var(--ink-dim)', minWidth: 24 }}>
        R{passive.rank}
      </span>
      <span className="font-display text-[12px]" style={{ color: unlocked ? color : 'var(--ink-mute)' }}>
        {passive.name}
      </span>
      <span className="ml-auto" style={{ color: 'var(--ink-mute)' }}>{passive.description}</span>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: 'var(--ink-dim)' }}>{label}</span>
      <span className="text-right" style={{ color: 'var(--gold-bright)' }}>{value}</span>
    </>
  );
}
