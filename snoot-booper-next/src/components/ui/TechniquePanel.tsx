/**
 * TechniquePanel — wuxia reskin.
 * Stances + Hidden Skills tabs. Reads engine.technique.
 */

'use client';

import { engine } from '@/engine/engine';
import { STANCES, HIDDEN_SKILLS, type StanceData } from '@/engine/systems/progression/technique-system';
import { useState } from 'react';

type Tab = 'stances' | 'skills';

export default function TechniquePanel() {
  const [tab, setTab] = useState<Tab>('stances');
  const [, force] = useState(0);
  const tech = engine.technique;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--vermillion-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>技</span>
        </div>
        <div>
          <div className="h-section">Combat Techniques</div>
          <div className="h-eyebrow">Stances of the inner discipline</div>
        </div>
      </div>

      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {(['stances', 'skills'] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: active ? 'var(--vermillion-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${active ? 'var(--vermillion-bright)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {t === 'stances' ? 'Stances' : 'Hidden Skills'}
            </button>
          );
        })}
      </div>

      {tab === 'stances' && (
        <div className="flex flex-col gap-3">
          {Object.values(STANCES).map((stance) => {
            const unlocked = tech.unlockedStances.includes(stance.id);
            const active = tech.currentStance === stance.id;
            const masteryLevel = tech.stanceMastery[stance.id] ?? 1;
            const masteryXP = tech.stanceMasteryXP[stance.id] ?? 0;
            const xpNeeded = Math.pow(masteryLevel + 1, 2) * 100;
            const masteryProgress = masteryLevel >= stance.mastery.maxLevel ? 1 : masteryXP / xpNeeded;
            return (
              <StanceCard
                key={stance.id}
                stance={stance}
                unlocked={unlocked}
                active={active}
                masteryLevel={masteryLevel}
                masteryProgress={masteryProgress}
                maxMastery={stance.mastery.maxLevel}
                onSwitch={() => { tech.switchStance(stance.id); force((n) => n + 1); }}
              />
            );
          })}
        </div>
      )}

      {tab === 'skills' && (
        <div>
          <div className="h-eyebrow mb-3">
            Discovered: {tech.learnedSkills.length} / {HIDDEN_SKILLS.length}
          </div>
          <div className="flex flex-col gap-2">
            {HIDDEN_SKILLS.map((skill) => {
              const found = tech.learnedSkills.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  className="panel p-3"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    opacity: found ? 1 : 0.4,
                    filter: found ? 'none' : 'grayscale(0.6)',
                  }}
                >
                  {found ? (
                    <>
                      <div className="font-display text-[12px] tracking-[0.06em] mb-1" style={{ color: 'var(--vermillion-bright)' }}>
                        {skill.name}
                      </div>
                      <div className="text-xs mb-1" style={{ color: 'var(--ink-mute)' }}>{skill.description}</div>
                      <div className="font-mono text-[10px]" style={{ color: 'var(--jade-bright)' }}>
                        {Object.entries(skill.effect).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </div>
                    </>
                  ) : (
                    <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: 'var(--ink-dim)' }}>
                      ??? Hidden Skill
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StanceCard({ stance, unlocked, active, masteryLevel, masteryProgress, maxMastery, onSwitch }: {
  stance: StanceData;
  unlocked: boolean;
  active: boolean;
  masteryLevel: number;
  masteryProgress: number;
  maxMastery: number;
  onSwitch: () => void;
}) {
  return (
    <div
      className={`panel p-4 ${active ? 'selected-ring' : ''}`}
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderColor: active ? stance.color : `${stance.color}33`,
        opacity: unlocked ? 1 : 0.45,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: unlocked ? stance.color : 'var(--ink-mute)' }}>
            {stance.name}
          </span>
          {active && (
            <span className="font-display text-[9px] tracking-[0.16em] px-1.5 py-0.5 uppercase" style={{ background: `${stance.color}22`, color: stance.color, border: `1px solid ${stance.color}66` }}>
              Active
            </span>
          )}
        </div>
        {!unlocked && (
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink-dim)' }}>
            requires {stance.unlockRealm.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--ink-mute)' }}>{stance.description}</p>

      <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3 font-mono text-[10px]">
        <Stat label="Power"     value={`${stance.stats.boopPower}x`} />
        <Stat label="Speed"     value={`${stance.stats.boopSpeed}x`} />
        <Stat label="Crit"      value={`${(stance.stats.critChance * 100).toFixed(0)}%`} />
        <Stat label="Crit Mult" value={`${stance.stats.critMultiplier}x`} />
        <Stat label="Decay"     value={`${stance.stats.comboDecay}x`} />
      </div>

      <div className="text-xs mb-3" style={{ color: 'var(--gold-bright)' }}>
        ✦ {stance.special.name}: <span style={{ color: 'var(--ink-mute)' }}>{stance.special.description}</span>
      </div>

      {stance.id === 'forbiddenTechnique' && (
        <div className="font-mono text-[10px] mb-3" style={{ color: 'var(--vermillion-bright)' }}>
          ⚠ costs 5 qi per boop
        </div>
      )}

      {unlocked && (
        <>
          <div className="flex justify-between h-eyebrow mb-1">
            <span>Mastery · Lv {masteryLevel}/{maxMastery}</span>
            <span>{(masteryProgress * 100).toFixed(0)}%</span>
          </div>
          <div className="meter mb-3">
            <div
              className="meter-fill"
              style={{ width: `${Math.min(100, masteryProgress * 100)}%`, background: `linear-gradient(90deg, ${stance.color}55, ${stance.color})` }}
            />
          </div>
          {!active && (
            <button
              className="btn w-full"
              style={{ borderColor: `${stance.color}66`, color: stance.color }}
              onClick={onSwitch}
            >
              Adopt · {stance.name}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--ink-dim)' }}>{label}</span>
      <span style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  );
}
