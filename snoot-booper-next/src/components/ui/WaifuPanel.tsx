'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { WAIFU_TEMPLATES, BOND_ACTIVITIES } from '@/engine/data/waifus';

const COLOR = '#FFB6C1';

function getBondTier(bond: number): string {
  if (bond >= 76) return 'Max';
  if (bond >= 51) return 'High';
  if (bond >= 26) return 'Mid';
  return 'Low';
}

export default function WaifuPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const unlocked = engine.waifu.getUnlockedWaifus();
  const activityProgress = engine.waifu.getActivityProgress();
  const inActivity = engine.waifu.isInActivity();

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: COLOR }}>
        💕 Companions ({unlocked.length} unlocked)
      </h2>

      <div className="flex flex-col gap-3">
        {unlocked.map((ws) => {
          const tmpl = WAIFU_TEMPLATES[ws.id];
          if (!tmpl) return null;
          const bond = ws.bondLevel;
          const tier = getBondTier(bond);
          const dialogue = engine.waifu.getDialogue(ws.id);
          const activities = engine.waifu.getAvailableActivities(ws.id);

          return (
            <div key={ws.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{tmpl.emoji}</span>
                <div>
                  <div className="text-[10px] font-mono font-bold text-white/80">{tmpl.name}</div>
                  <div className="text-[8px] font-mono text-white/40">{tmpl.title}</div>
                </div>
                <span
                  className="ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${COLOR}20`, color: COLOR }}
                >
                  {tier} Bond
                </span>
              </div>

              {/* Bond Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[8px] font-mono text-white/40 mb-0.5">
                  <span>Bond</span>
                  <span>{bond}/100</span>
                </div>
                <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${bond}%`, backgroundColor: COLOR }}
                  />
                </div>
              </div>

              {/* Bonus */}
              <div className="text-[8px] font-mono text-white/40 mb-1">
                Bonus: {tmpl.bonus.description}
              </div>

              {/* Dialogue */}
              <div
                className="text-[9px] font-mono italic mb-2 p-2 rounded bg-black/20"
                style={{ color: `${COLOR}cc` }}
              >
                &ldquo;{dialogue}&rdquo;
              </div>

              {/* Activity Section */}
              {inActivity && activityProgress && (engine.waifu as any).currentActivity?.waifuId === ws.id ? (
                <div className="p-2 rounded border border-white/5 bg-black/20">
                  <div className="text-[9px] font-mono text-white/60 mb-1">
                    In activity... ({Math.round(activityProgress.progress * 100)}%)
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${activityProgress.progress * 100}%`, backgroundColor: '#50C878' }}
                    />
                  </div>
                  <button
                    className="text-[8px] font-mono px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
                    onClick={() => { engine.cancelWaifuActivity(); refresh(); }}
                  >
                    Cancel
                  </button>
                </div>
              ) : !inActivity && activities.length > 0 ? (
                <div>
                  <div className="text-[8px] font-mono text-white/30 mb-1">Activities:</div>
                  <div className="flex flex-col gap-1">
                    {activities.slice(0, 4).map((act) => (
                      <div key={act.id} className="flex items-center justify-between p-1.5 rounded bg-black/20">
                        <div>
                          <span className="text-[9px] font-mono text-white/60">
                            {act.emoji} {act.name}
                          </span>
                          {act.preferred && (
                            <span className="ml-1 text-[7px] font-mono px-1 rounded" style={{ backgroundColor: `${COLOR}30`, color: COLOR }}>
                              ♥
                            </span>
                          )}
                          <div className="text-[7px] font-mono text-white/30">
                            {Math.round(act.duration / 60000)}min · +{act.bondGain} bond
                          </div>
                        </div>
                        <button
                          className="text-[8px] font-mono px-2 py-1 rounded cursor-pointer"
                          style={{ backgroundColor: `${COLOR}20`, color: COLOR, border: `1px solid ${COLOR}30` }}
                          onClick={() => { engine.startWaifuActivity(ws.id, act.id); refresh(); }}
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {unlocked.length === 0 && (
          <div className="text-[10px] font-mono text-white/30 text-center py-8">
            No companions unlocked yet. Keep cultivating!
          </div>
        )}
      </div>
    </div>
  );
}
