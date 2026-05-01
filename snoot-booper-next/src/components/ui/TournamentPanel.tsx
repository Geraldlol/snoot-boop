/**
 * TournamentPanel — Celestial Tournament status & leaderboard.
 *
 * Weekly bracket flow with auto-picked top cats, round simulation, rewards,
 * lifetime stats, and leaderboard in the wuxia visual language.
 */

'use client';

import { engine } from '@/engine/engine';
import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { useState } from 'react';
import type { BattleResult } from '@/engine/systems/combat/tournament-system';

export default function TournamentPanel() {
  const _currencies = useGameStore((s) => s.currencies);
  void _currencies;
  const [, force] = useState(0);
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = () => force((n) => n + 1);

  const t = engine.tournament;
  const weekly = t.getWeeklyData();
  const stats = t.getStats();
  const leaderboard = t.getLeaderboard();
  const inT = t.isInTournament();
  const round = t.getCurrentRound();
  const bracket = t.getBracket();
  const rewards = t.getPendingRewards();
  const team = engine.getTournamentTeamPreview();
  const canEnter = !inT && !weekly.completed && team.length >= 4;
  const canFight = inT && round < bracket.length;
  const canClaim = weekly.completed && !weekly.rewardsClaimed;

  function enterTournament() {
    const result = engine.enterTournament();
    setError(result.success ? null : result.error ?? 'Could not enter tournament.');
    refresh();
  }

  function fightRound() {
    const result = engine.runTournamentRound();
    if (!result.success) {
      setError(result.error ?? 'Could not resolve tournament round.');
      return;
    }
    setError(null);
    setLastResult(result.result ?? null);
    refresh();
  }

  function claimRewards() {
    const claimed = engine.claimTournamentRewards();
    setError(claimed ? null : 'No tournament rewards to claim.');
    refresh();
  }

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

      <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <div className="h-eyebrow mb-1">Tournament Team</div>
            <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: team.length >= 4 ? 'var(--jade-bright)' : 'var(--ink-mute)' }}>
              {team.length}/4 cats ready
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!inT && !weekly.completed && (
              <button className={`btn ${canEnter ? 'btn-primary' : ''}`} disabled={!canEnter} onClick={enterTournament}>
                Enter Tournament
              </button>
            )}
            {canFight && (
              <button className="btn btn-primary" onClick={fightRound}>
                Fight Round {round + 1}
              </button>
            )}
            {canClaim && (
              <button className="btn btn-primary" onClick={claimRewards}>
                Claim Rewards
              </button>
            )}
          </div>
        </div>

        {team.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {team.map((cat) => (
              <div key={cat.id} className="px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--rule)' }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[11px] tracking-[0.06em] truncate" style={{ color: '#fff7df' }}>{cat.name}</span>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--gold-bright)' }}>{formatNumber(cat.power)}</span>
                </div>
                <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--ink-mute)' }}>
                  hp {formatNumber(cat.hp)} · atk {formatNumber(cat.attack)} · def {formatNumber(cat.defense)} · crit {Math.round(cat.critChance * 100)}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 italic" style={{ color: 'var(--ink-dim)' }}>
            Recruit cats to open the bracket.
          </p>
        )}

        {error && (
          <div className="mt-3 font-mono text-[11px]" style={{ color: 'var(--vermillion-bright)' }}>
            {error}
          </div>
        )}
      </div>

      {inT && bracket.length > 0 && (
        <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-eyebrow mb-2">Bracket</div>
          <div className="flex flex-col gap-1">
            {bracket.map((opponent, idx) => {
              const done = idx < round;
              const active = idx === round;
              return (
                <div
                  key={`${opponent.id}-${idx}`}
                  className="flex items-center gap-3 px-3 py-2 font-mono text-[11px]"
                  style={{
                    background: active ? `${opponent.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? opponent.color : 'var(--rule)'}`,
                    opacity: done ? 0.55 : 1,
                  }}
                >
                  <span style={{ color: done ? 'var(--jade-bright)' : active ? opponent.color : 'var(--ink-dim)' }}>
                    {done ? '✓' : `R${idx + 1}`}
                  </span>
                  <span className="flex-1" style={{ color: '#fff7df' }}>{opponent.name}</span>
                  <span style={{ color: 'var(--ink-mute)' }}>{opponent.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lastResult && (
        <div className="panel p-3 mb-4" style={{ background: 'rgba(0,0,0,0.3)', borderColor: lastResult.victory ? 'var(--jade)' : 'var(--vermillion)' }}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="font-display text-[12px] tracking-[0.16em] uppercase" style={{ color: lastResult.victory ? 'var(--jade-bright)' : 'var(--vermillion-bright)' }}>
              {lastResult.victory ? 'Victory' : 'Defeat'}
            </div>
            <div className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
              {lastResult.turnsTaken} turns
            </div>
          </div>
          {lastResult.rewards && (
            <div className="font-mono text-[10px] mb-2" style={{ color: 'var(--gold-bright)' }}>
              +{formatNumber(lastResult.rewards.reputation)} rep · +{formatNumber(lastResult.rewards.jadeCatnip)} jade · +{formatNumber(lastResult.rewards.destinyThreads)} threads
            </div>
          )}
          <div className="max-h-40 overflow-y-auto pr-1">
            {lastResult.log.slice(-8).map((line, idx) => (
              <div key={`${line}-${idx}`} className="font-mono text-[10px] py-0.5" style={{ color: 'var(--ink-mute)' }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

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
