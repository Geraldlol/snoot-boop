/**
 * SectWarPanel — Weekly war ladder (wuxia reskin).
 */

'use client';

import { useState, useEffect } from 'react';
import { engine } from '@/engine/engine';
import { WAR_TYPES, type WarType, type SectWar, type WarParticipant, type WarHistoryEntry } from '@/engine/systems/social/sect-war-system';
import { MASTERS } from '@/engine/data/masters';
import { formatNumber } from '@/engine/big-number';

const WAR_TYPE_LIST = Object.values(WAR_TYPES);
const NPC_MASTERS = Object.values(MASTERS).map((m) => ({ id: m.id, name: `${m.name} (${m.title})` }));

export default function SectWarPanel() {
  const [selectedType, setSelectedType] = useState<WarType>('boop_count');
  const [war, setWar] = useState<Readonly<SectWar> | null>(engine.sectWar.getCurrentWar());
  const [timeRemaining, setTimeRemaining] = useState(engine.sectWar.getWarTimeRemaining());
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setWar(engine.sectWar.getCurrentWar());
      setTimeRemaining(engine.sectWar.getWarTimeRemaining());
      const reward = engine.sectWar.checkWarExpiry();
      if (reward) setWar(null);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function startWar() {
    const w = engine.sectWar.startWeeklyWar(selectedType);
    if (!w) return;
    for (const npc of NPC_MASTERS) {
      const baseScore = Math.floor(Math.random() * 500) + 100;
      engine.sectWar.addNpcParticipant(npc.id, npc.name, baseScore);
    }
    engine.sectWar.updateProgress(selectedType, 0);
    setWar(engine.sectWar.getCurrentWar());
  }

  function endWar() {
    const reward = engine.sectWar.endWeeklyWar();
    if (reward) engine.economy.addCurrency('jadeCatnip', reward.jadeCatnip, 'sect_war');
    setWar(null);
  }

  const stats = engine.sectWar.getStats();
  const history = engine.sectWar.getWarHistory();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--vermillion-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>戰</span>
        </div>
        <div>
          <div className="h-section">Sect War</div>
          <div className="h-eyebrow">{stats.totalWarsParticipated} fought · {stats.totalWarsWon} won · {stats.totalJadeCatnipEarned} jc earned</div>
        </div>
      </div>

      {!war || war.finished ? (
        <>
          <div className="h-eyebrow mb-2">Choose a war type</div>
          <div className="flex flex-col gap-2 mb-4">
            {WAR_TYPE_LIST.map((wt) => {
              const active = selectedType === wt.id;
              return (
                <button
                  key={wt.id}
                  onClick={() => setSelectedType(wt.id)}
                  className={`panel card-row text-left p-3 ${active ? 'selected-ring' : ''}`}
                  style={{
                    background: active ? 'rgba(214,91,64,0.08)' : 'rgba(0,0,0,0.3)',
                    borderColor: active ? 'var(--vermillion)' : 'var(--rule)',
                  }}
                >
                  <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: active ? 'var(--vermillion-bright)' : '#fff7df' }}>
                    {wt.name}
                  </div>
                  <div className="h-eyebrow mt-0.5">{wt.description}</div>
                </button>
              );
            })}
          </div>
          <button className="btn btn-primary w-full" onClick={startWar} style={{ borderColor: 'var(--vermillion)', background: 'linear-gradient(180deg, rgba(214,91,64,0.32), rgba(91,30,20,0.22))', color: 'var(--vermillion-bright)' }}>
            ⚔ Declare War
          </button>
        </>
      ) : (
        <>
          <div className="panel p-3 mb-3" style={{ background: 'rgba(214,91,64,0.06)', borderColor: 'var(--vermillion)' }}>
            <div className="flex items-center justify-between">
              <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: 'var(--vermillion-bright)' }}>
                ⚔ {WAR_TYPES[war.warType].name}
              </span>
              <span className="font-mono text-[11px]" style={{ color: 'var(--ink-mute)' }}>
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="flex flex-col gap-1 mb-3">
            {[...war.participants].sort((a, b) => b.score - a.score).map((p, idx) => (
              <LeaderRow key={p.id} rank={idx + 1} p={p} isPlayer={p.id === 'player'} unit={WAR_TYPES[war.warType].unit} />
            ))}
          </div>

          <button className="btn w-full" onClick={endWar}>
            End War Early
          </button>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-5 pt-3 border-t" style={{ borderColor: 'var(--rule)' }}>
          <button
            className="font-display text-[10px] tracking-[0.16em] uppercase cursor-pointer"
            style={{ color: 'var(--ink-mute)' }}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '▼' : '▶'} War History · {history.length}
          </button>
          {showHistory && (
            <div className="flex flex-col gap-1 mt-2">
              {[...history].reverse().map((e) => <HistoryRow key={e.id} entry={e} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeaderRow({ rank, p, isPlayer, unit }: { rank: number; p: WarParticipant; isPlayer: boolean; unit: string }) {
  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const c = rank <= 3 ? rankColors[rank - 1] : 'var(--ink-dim)';
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 font-mono text-xs"
      style={{
        background: isPlayer ? 'rgba(255,215,0,0.06)' : 'rgba(0,0,0,0.3)',
        border: `1px solid ${isPlayer ? 'var(--gold)' : 'var(--rule)'}`,
      }}
    >
      <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: c, minWidth: 28 }}>#{rank}</span>
      <span className="flex-1 truncate" style={{ color: isPlayer ? 'var(--gold-bright)' : 'var(--ink)' }}>
        {p.name}
        {isPlayer && <span className="ml-2 font-display text-[9px] tracking-[0.16em]" style={{ color: 'var(--gold-bright)' }}>YOU</span>}
      </span>
      <span style={{ color: 'var(--ink-mute)' }}>{formatNumber(p.score)} {unit}</span>
    </div>
  );
}

function HistoryRow({ entry }: { entry: WarHistoryEntry }) {
  const winner = entry.participants.find((p) => p.id === entry.winnerId);
  const playerWon = entry.winnerId === 'player';
  return (
    <div className="px-3 py-2 font-mono text-[11px]" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <div className="flex justify-between mb-0.5">
        <span style={{ color: playerWon ? 'var(--gold-bright)' : 'var(--ink)' }}>{WAR_TYPES[entry.warType].name}</span>
        <span style={{ color: 'var(--ink-dim)' }}>{new Date(entry.startTime).toLocaleDateString()}</span>
      </div>
      <div style={{ color: 'var(--ink-mute)' }}>winner · {winner?.name ?? 'unknown'}</div>
    </div>
  );
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Ended';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${minutes}m ${seconds}s`;
}
