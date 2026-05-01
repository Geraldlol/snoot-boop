/**
 * WaifuPanel — Bond Hall (wuxia reskin).
 * Companion roster with bond progression, dialogue speech-bubbles, and
 * activities. Reads engine.waifu and dispatches startWaifuActivity /
 * cancelWaifuActivity.
 */

'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { WAIFU_TEMPLATES } from '@/engine/data/waifus';

const BOND_TIERS = [
  { min: 76, label: 'MAX',  color: 'var(--vermillion-bright)' },
  { min: 51, label: 'High', color: 'var(--gold-bright)' },
  { min: 26, label: 'Mid',  color: 'var(--jade-bright)' },
  { min: 0,  label: 'Low',  color: 'var(--ink-mute)' },
];

function bondTier(bond: number) {
  return BOND_TIERS.find((t) => bond >= t.min) ?? BOND_TIERS[BOND_TIERS.length - 1];
}

export default function WaifuPanel() {
  const _bp = useGameStore((s) => s.currencies.bp);
  void _bp;
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (engine.waifu.isInActivity()) refresh();
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const unlocked = engine.waifu.getUnlockedWaifus();
  const activityProgress = engine.waifu.getActivityProgress();
  const inActivity = engine.waifu.isInActivity();
  const activeId = engine.waifu.getActiveWaifuId();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="glyph-badge" style={{ color: '#FFB6C1', width: 38, height: 38 }}>
            <span style={{ fontSize: 16 }}>情</span>
          </div>
          <div>
            <div className="h-section">Bond Hall</div>
            <div className="h-eyebrow">{unlocked.length} companions of the sect</div>
          </div>
        </div>
      </div>

      {unlocked.length === 0 ? (
        <p className="text-center py-12 italic" style={{ color: 'var(--ink-dim)' }}>
          No companions yet. Continue cultivating — wandering masters will hear of you.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {unlocked.map((ws) => {
            const tmpl = WAIFU_TEMPLATES[ws.id];
            if (!tmpl) return null;
            const tier = bondTier(ws.bondLevel);
            const isThisOne = activeId === ws.id;
            const dialogue = engine.waifu.getDialogue(ws.id);
            const activities = engine.waifu.getAvailableActivities(ws.id);

            return (
              <div
                key={ws.id}
                className="panel p-4"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: ws.bondLevel >= 76 ? '#FFB6C1aa' : 'var(--rule)' }}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="rune flex-shrink-0"
                    style={{
                      width: 56, height: 56, fontSize: 24,
                      background: `radial-gradient(circle at 35% 30%, #FFB6C155, #FFB6C122 60%, rgba(0,0,0,0.4))`,
                      border: `1px solid #FFB6C188`,
                      color: '#fff7df',
                      textShadow: '0 0 10px rgba(255,182,193,0.7)',
                    }}
                  >
                    {tmpl.emoji ?? '蓮'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-[15px] font-bold tracking-[0.06em]" style={{ color: '#fff7df' }}>
                        {tmpl.name}
                      </span>
                      <span
                        className="font-display text-[9px] px-2 py-0.5 tracking-[0.16em] uppercase"
                        style={{
                          border: `1px solid ${tier.color}`,
                          color: tier.color,
                          background: `${tier.color}15`,
                          borderRadius: 1,
                        }}
                      >
                        {tier.label} bond
                      </span>
                    </div>
                    <div className="h-eyebrow">{tmpl.title}</div>
                  </div>
                </div>

                {/* Bond meter */}
                <div className="mb-3">
                  <div className="flex justify-between h-eyebrow mb-1">
                    <span>Bond</span>
                    <span style={{ color: '#FFB6C1' }}>{ws.bondLevel} / 100</span>
                  </div>
                  <div className="meter">
                    <div
                      className="meter-fill"
                      style={{
                        width: `${ws.bondLevel}%`,
                        background: 'linear-gradient(90deg, #FFB6C133, #FFB6C1, #fff7df)',
                        boxShadow: '0 0 12px #FFB6C188',
                      }}
                    />
                  </div>
                </div>

                {/* Bonus chip */}
                <div className="text-[11px] mb-3" style={{ color: 'var(--jade-bright)' }}>
                  ✦ {tmpl.bonus.description}
                </div>

                {/* Dialogue speech-bubble */}
                <div
                  className="mb-3 p-3 italic relative text-sm"
                  style={{
                    background: 'rgba(255,182,193,0.06)',
                    border: '1px dashed rgba(255,182,193,0.30)',
                    color: '#fff7df',
                  }}
                >
                  &ldquo;{dialogue}&rdquo;
                </div>

                {/* Activity */}
                {inActivity && isThisOne && activityProgress ? (
                  <div className="panel p-3" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <div className="h-eyebrow mb-1">In activity · {Math.round(activityProgress.progress * 100)}%</div>
                    <div className="meter mb-2">
                      <div
                        className="meter-fill jade"
                        style={{ width: `${activityProgress.progress * 100}%` }}
                      />
                    </div>
                    <button
                      className="btn"
                      onClick={() => { engine.cancelWaifuActivity(); refresh(); }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : !inActivity && activities.length > 0 ? (
                  <div>
                    <div className="h-eyebrow mb-2">Activities</div>
                    <div className="flex flex-col gap-1.5">
                      {activities.slice(0, 4).map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center justify-between px-3 py-2"
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}
                        >
                          <div>
                            <div className="text-sm flex items-center gap-1.5" style={{ color: '#fff7df' }}>
                              <span>{act.emoji}</span>
                              <span className="font-display text-[12px] tracking-[0.06em]">{act.name}</span>
                              {act.preferred && (
                                <span className="font-display text-[9px] px-1.5 py-0.5" style={{ color: '#FFB6C1', background: 'rgba(255,182,193,0.15)', border: '1px solid #FFB6C166', borderRadius: 1 }}>♥</span>
                              )}
                            </div>
                            <div className="h-eyebrow mt-0.5">
                              {Math.max(1, Math.round(act.duration / 60))} min · +{act.bondGain} bond
                            </div>
                          </div>
                          <button
                            className="btn"
                            style={{ padding: '6px 12px', fontSize: 10 }}
                            onClick={() => { engine.startWaifuActivity(ws.id, act.id); refresh(); }}
                          >
                            Begin
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
