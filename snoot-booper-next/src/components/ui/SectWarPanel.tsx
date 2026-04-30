'use client';

import { useState, useEffect } from 'react';
import { engine } from '@/engine/engine';
import { WAR_TYPES, type WarType, type SectWar, type WarParticipant, type WarHistoryEntry } from '@/engine/systems/social/sect-war-system';
import { MASTERS } from '@/engine/data/masters';
import { formatNumber } from '@/engine/big-number';

const WAR_TYPE_LIST = Object.values(WAR_TYPES);

const NPC_MASTERS = Object.values(MASTERS).map(m => ({
  id: m.id,
  name: `${m.name} (${m.title})`,
}));

export default function SectWarPanel() {
  const [selectedType, setSelectedType] = useState<WarType>('boop_count');
  const [war, setWar] = useState<Readonly<SectWar> | null>(engine.sectWar.getCurrentWar());
  const [timeRemaining, setTimeRemaining] = useState(engine.sectWar.getWarTimeRemaining());
  const [showHistory, setShowHistory] = useState(false);

  // Poll war state every second for timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWar(engine.sectWar.getCurrentWar());
      setTimeRemaining(engine.sectWar.getWarTimeRemaining());

      // Auto-end check
      const reward = engine.sectWar.checkWarExpiry();
      if (reward) {
        setWar(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartWar = () => {
    const newWar = engine.sectWar.startWeeklyWar(selectedType);
    if (newWar) {
      // Add NPC participants with randomized scores
      for (const npc of NPC_MASTERS) {
        const baseScore = Math.floor(Math.random() * 500) + 100;
        engine.sectWar.addNpcParticipant(npc.id, npc.name, baseScore);
      }
      // Ensure player is in the war
      engine.sectWar.updateProgress(selectedType, 0);
      setWar(engine.sectWar.getCurrentWar());
    }
  };

  const handleEndWar = () => {
    const reward = engine.sectWar.endWeeklyWar();
    if (reward) {
      engine.economy.addCurrency('jadeCatnip', reward.jadeCatnip, 'sect_war');
    }
    setWar(null);
  };

  const stats = engine.sectWar.getStats();
  const history = engine.sectWar.getWarHistory();

  return (
    <div>
      {/* Aggregate stats */}
      <div className="flex gap-3 mb-3 text-[9px] font-mono text-white/40">
        <span>Wars: {stats.totalWarsParticipated}</span>
        <span>Won: {stats.totalWarsWon}</span>
        <span>JC earned: {stats.totalJadeCatnipEarned}</span>
      </div>

      {!war || war.finished ? (
        /* War type picker */
        <div>
          <p className="text-xs font-mono text-white/50 mb-2">Choose a war type:</p>
          <div className="flex flex-col gap-1 mb-3">
            {WAR_TYPE_LIST.map(wt => (
              <button
                key={wt.id}
                className="text-left px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer"
                style={{
                  borderColor: selectedType === wt.id ? '#E9456030' : 'rgba(255,255,255,0.05)',
                  backgroundColor: selectedType === wt.id ? '#E9456015' : 'rgba(0,0,0,0.2)',
                  color: selectedType === wt.id ? '#E94560' : 'rgba(255,255,255,0.5)',
                }}
                onClick={() => setSelectedType(wt.id)}
              >
                <div className="font-bold">{wt.name}</div>
                <div className="text-[9px] opacity-60">{wt.description}</div>
              </button>
            ))}
          </div>
          <button
            className="w-full py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all bg-[#E94560]/20 text-[#E94560] border border-[#E94560]/30 hover:bg-[#E94560]/30"
            onClick={handleStartWar}
          >
            ⚔️ Start War
          </button>
        </div>
      ) : (
        /* Active war */
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#E94560]">
              ⚔️ {WAR_TYPES[war.warType].name}
            </span>
            <span className="text-[9px] font-mono text-white/40">
              {formatTimeRemaining(timeRemaining)}
            </span>
          </div>

          {/* Leaderboard */}
          <div className="flex flex-col gap-1 mb-3">
            {[...war.participants]
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <LeaderboardRow
                  key={p.id}
                  rank={idx + 1}
                  participant={p}
                  isPlayer={p.id === 'player'}
                  unit={WAR_TYPES[war.warType].unit}
                />
              ))}
          </div>

          <button
            className="w-full py-2 rounded-lg text-[9px] font-mono cursor-pointer transition-all bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
            onClick={handleEndWar}
          >
            End War Early
          </button>
        </div>
      )}

      {/* War history */}
      {history.length > 0 && (
        <div className="mt-4">
          <button
            className="text-[9px] font-mono text-white/40 cursor-pointer hover:text-white/60 transition-all"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '▼' : '▶'} War History ({history.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-1 mt-2">
              {[...history].reverse().map(entry => (
                <HistoryRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ rank, participant, isPlayer, unit }: {
  rank: number; participant: WarParticipant; isPlayer: boolean; unit: string;
}) {
  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const color = rank <= 3 ? rankColors[rank - 1] : 'rgba(255,255,255,0.3)';

  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded border text-xs font-mono"
      style={{
        borderColor: isPlayer ? '#FFD70030' : 'rgba(255,255,255,0.05)',
        backgroundColor: isPlayer ? '#FFD70010' : 'rgba(0,0,0,0.2)',
      }}
    >
      <span className="w-5 text-right font-bold" style={{ color }}>#{rank}</span>
      <span className="flex-1 truncate" style={{ color: isPlayer ? '#FFD700' : 'rgba(255,255,255,0.6)' }}>
        {participant.name}
      </span>
      <span className="text-white/40">{formatNumber(participant.score)} {unit}</span>
    </div>
  );
}

function HistoryRow({ entry }: { entry: WarHistoryEntry }) {
  const winner = entry.participants.find(p => p.id === entry.winnerId);
  const playerWon = entry.winnerId === 'player';

  return (
    <div className="px-2 py-1.5 rounded bg-black/20 border border-white/5 text-[9px] font-mono text-white/40">
      <div className="flex justify-between">
        <span className={playerWon ? 'text-[#FFD700]' : ''}>{WAR_TYPES[entry.warType].name}</span>
        <span>{new Date(entry.startTime).toLocaleDateString()}</span>
      </div>
      <div className="text-[10px]">
        Winner: {winner?.name ?? 'Unknown'}
      </div>
    </div>
  );
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Ended';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
}
