/**
 * DailyPanel — Daily Commissions (wuxia reskin).
 */

'use client';

import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';

export default function DailyPanel() {
  const streak = engine.daily.getCurrentStreak();
  const commissions = engine.daily.getCommissions();
  const allDone = engine.daily.allCommissionsComplete();
  const totalCompleted = engine.daily.getTotalCompleted();

  const currentDay = ((streak - 1) % 7) + 1;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>務</span>
        </div>
        <div>
          <div className="h-section">Daily Commissions</div>
          <div className="h-eyebrow">{totalCompleted} commissions completed lifetime</div>
        </div>
      </div>

      {/* Login streak */}
      <div className="panel p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-3 text-center">Login Streak · Day {streak}</div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => {
            const reached = d <= currentDay;
            const today = d === currentDay;
            return (
              <div
                key={d}
                className="font-display flex items-center justify-center"
                style={{
                  width: 36, height: 36, fontSize: 14,
                  background: reached
                    ? 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.5), rgba(120,80,30,0.4) 60%, rgba(0,0,0,0.4))'
                    : 'rgba(0,0,0,0.3)',
                  border: today ? '2px solid var(--gold-bright)' : `1px solid ${reached ? 'var(--gold)' : 'var(--rule)'}`,
                  color: reached ? '#fff7df' : 'var(--ink-dim)',
                  textShadow: reached ? '0 0 8px rgba(255,225,170,0.7)' : undefined,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {/* Commissions */}
      <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Today&apos;s Tasks</div>
      <div className="flex flex-col gap-2 mb-4">
        {commissions.map((c) => {
          const pct = Math.min(100, (c.progress / c.target) * 100);
          return (
            <div key={c.id} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center justify-between mb-1">
                <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{c.name}</div>
                {c.completed && (
                  <span className="font-display text-[9px] tracking-[0.16em] uppercase px-1.5 py-0.5" style={{ color: 'var(--jade-bright)', border: '1px solid var(--jade-deep)' }}>
                    ✓ Done
                  </span>
                )}
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--ink-mute)' }}>{c.description}</p>

              <div className="flex items-center gap-2">
                <div className="meter flex-1" style={{ height: 4 }}>
                  <div className={`meter-fill ${c.completed ? 'jade' : ''}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                  {formatNumber(c.progress)}/{formatNumber(c.target)}
                </span>
              </div>

              {c.rewards.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.rewards.map((r, i) => (
                    <span key={i} className="trait-chip">{r.type} +{formatNumber(r.value)}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="panel panel-elite p-3 text-center" style={{ background: 'rgba(109,197,168,0.08)', borderColor: 'var(--jade-bright)' }}>
          <div className="font-display text-[12px] tracking-[0.16em] uppercase" style={{ color: 'var(--jade-bright)' }}>
            ✦ All Commissions Complete
          </div>
          <div className="h-eyebrow mt-1">Bonus rewards have been claimed.</div>
        </div>
      )}
    </div>
  );
}
