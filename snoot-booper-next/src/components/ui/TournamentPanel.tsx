/**
 * TournamentPanel — Celestial Tournament status & leaderboard.
 *
 * Phase 5 surfaces the tournament's weekly status, lifetime stats, and
 * leaderboard in the wuxia visual language. The full battle-initiation flow
 * (which requires constructing CombatStats per cat) is deferred — the
 * tournament engine system already exists and is loaded; we only show its
 * data here. A future phase can wire the "enter tournament" button.
 */

'use client';

import { engine } from '@/engine/engine';
import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';

export default function TournamentPanel() {
  const _bp = useGameStore((s) => s.currencies.bp);
  void _bp;

  const t = engine.tournament;
  const weekly = t.getWeeklyData();
  const stats = t.getStats();
  const leaderboard = t.getLeaderboard();
  const inT = t.isInTournament();
  const round = t.getCurrentRound();
  const bracket = t.getBracket();
  const rewards = t.getPendingRewards();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>盃</span>
        </div>
        <div>
          <div className="h-section">Celestial Tournament</div>
          <div className="h-eyebrow">Weekly bracket of the Seven Friends</div>
        </div>
      </div>

      {/* Weekly hero */}
      <div className="panel panel-ornate p-4 mb-4" style={{ background: 'rgba(255,215,0,0.04)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: 'var(--gold-bright)' }}>
            This Week
          </span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
            {weekly.completed ? '✓ done' : inT ? `round ${round + 1} / ${bracket.length}` : 'awaiting entry'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Mini label="Wins"   value={String(weekly.wins ?? 0)}   tone="var(--jade-bright)" />
          <Mini label="Losses" value={String(weekly.losses ?? 0)} tone="var(--vermillion-bright)" />
          <Mini label="Status" value={weekly.completed ? 'Sealed' : inT ? 'Active' : 'Open'} tone="var(--gold-bright)" />
        </div>
      </div>

      {/* Pending rewards */}
      {(rewards.reputation > 0 || rewards.jadeCatnip > 0 || rewards.destinyThreads > 0) && (
        <div className="panel p-3 mb-4" style={{ background: 'rgba(109,197,168,0.06)', borderColor: 'var(--jade)' }}>
          <div className="h-eyebrow mb-2">Pending Rewards</div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div>rep · <span style={{ color: 'var(--gold-bright)' }}>{formatNumber(rewards.reputation)}</span></div>
            <div>jc · <span style={{ color: 'var(--gold-bright)' }}>{formatNumber(rewards.jadeCatnip)}</span></div>
            <div>dt · <span style={{ color: 'var(--gold-bright)' }}>{formatNumber(rewards.destinyThreads)}</span></div>
          </div>
        </div>
      )}

      {/* Lifetime stats */}
      <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-2">Lifetime</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
          <Pair label="Tournaments" value={String(stats.totalTournaments)} />
          <Pair label="Wins"        value={String(stats.totalWins)} />
          <Pair label="Losses"      value={String(stats.totalLosses)} />
          <Pair label="Championships" value={String(stats.championCount)} />
        </div>
        {Object.keys(stats.defeatedMasters).length > 0 && (
          <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--rule)' }}>
            <div className="h-eyebrow mb-1">Defeated Masters</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(stats.defeatedMasters).map(([masterId, count]) => (
                <span key={masterId} className="trait-chip">
                  {masterId} ×{count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <>
          <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>All-Time Champions</div>
          <div className="flex flex-col gap-1">
            {leaderboard.map((entry, idx) => (
              <div
                key={`${entry.name}-${entry.timestamp}-${idx}`}
                className="flex items-center gap-3 px-3 py-2 font-mono text-xs"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}
              >
                <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: idx < 3 ? 'var(--gold-bright)' : 'var(--ink-dim)', minWidth: 28 }}>
                  #{idx + 1}
                </span>
                <span className="flex-1 truncate" style={{ color: 'var(--ink)' }}>{entry.name}</span>
                <span style={{ color: 'var(--ink-mute)' }}>
                  {entry.wins} wins · {entry.championCount} 🏆
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {leaderboard.length === 0 && stats.totalTournaments === 0 && (
        <p className="text-center py-6 italic" style={{ color: 'var(--ink-dim)' }}>
          The bracket awaits a champion. Tournament battles are forged through cultivation.
        </p>
      )}
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="px-3 py-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <div className="h-eyebrow">{label}</div>
      <div className="font-display nums text-[14px] mt-0.5" style={{ color: tone }}>{value}</div>
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
