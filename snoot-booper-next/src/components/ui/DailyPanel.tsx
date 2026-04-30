'use client';

import { useState } from 'react';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';

const COLOR = '#FFD700';

export default function DailyPanel() {
  const [, forceUpdate] = useState(0);

  const streak = engine.daily.getCurrentStreak();
  const commissions = engine.daily.getCommissions();
  const allDone = engine.daily.allCommissionsComplete();
  const totalCompleted = engine.daily.getTotalCompleted();

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: COLOR }}>
        📋 Daily
      </h2>

      {/* Login Streak */}
      <div className="mb-4 p-3 rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/5">
        <div className="text-[9px] font-mono text-white/40 mb-2">Login Streak</div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const current = ((streak - 1) % 7) + 1;
            const completed = day <= current;
            const isToday = day === current;
            return (
              <div
                key={day}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-mono font-bold"
                style={{
                  backgroundColor: completed ? `${COLOR}30` : 'rgba(255,255,255,0.05)',
                  color: completed ? COLOR : 'rgba(255,255,255,0.2)',
                  border: isToday ? `2px solid ${COLOR}` : '2px solid transparent',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="text-[10px] font-mono text-white/50 text-center mt-1">
          Day {streak}
        </div>
      </div>

      {/* Commissions */}
      <div className="text-[9px] font-mono text-white/40 mb-2">Daily Commissions:</div>
      <div className="flex flex-col gap-2 mb-3">
        {commissions.map((comm) => (
          <div key={comm.id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-mono font-bold text-white/80">{comm.name}</div>
              {comm.completed && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#50C87820', color: '#50C878' }}>
                  ✓ Done
                </span>
              )}
            </div>
            <div className="text-[10px] font-mono text-white/40 mb-1.5">{comm.description}</div>
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (comm.progress / comm.target) * 100)}%`,
                    backgroundColor: comm.completed ? '#50C878' : COLOR,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/40">
                {formatNumber(comm.progress)}/{formatNumber(comm.target)}
              </span>
            </div>
            {/* Rewards */}
            <div className="flex gap-1 mt-1">
              {comm.rewards.map((r, i) => (
                <span key={i} className="text-[9px] font-mono px-1 rounded bg-black/20 text-white/50">
                  {r.type}: {formatNumber(r.value)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* All-complete bonus */}
      {allDone && (
        <div className="p-3 rounded-lg border border-[#50C878]/30 bg-[#50C878]/10 text-center mb-3">
          <div className="text-xs font-mono font-bold text-[#50C878]">
            🎉 All Commissions Complete!
          </div>
          <div className="text-[10px] font-mono text-white/40">Bonus rewards claimed!</div>
        </div>
      )}

      {/* Stats */}
      <div className="text-[10px] font-mono text-white/50 text-center">
        Total commissions completed: {totalCompleted}
      </div>
    </div>
  );
}
