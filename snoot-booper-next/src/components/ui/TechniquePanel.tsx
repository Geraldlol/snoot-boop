'use client';

import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { STANCES, HIDDEN_SKILLS, type StanceData } from '@/engine/systems/progression/technique-system';
import { useState } from 'react';

type Tab = 'stances' | 'skills';

export default function TechniquePanel() {
  const [tab, setTab] = useState<Tab>('stances');
  const [, forceUpdate] = useState(0);

  const tech = engine.technique;

  return (
    <div>
      <h2 className="text-sm font-mono text-[#DC143C] font-bold mb-3">⚔️ Techniques</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['stances', 'skills'] as Tab[]).map((t) => (
          <button
            key={t}
            className="px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: tab === t ? '#DC143C30' : 'rgba(255,255,255,0.05)',
              color: tab === t ? '#DC143C' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t ? '2px solid #DC143C' : '2px solid transparent',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'stances' ? '🥋 Stances' : '🔮 Hidden Skills'}
          </button>
        ))}
      </div>

      {tab === 'stances' && (
        <StancesTab tech={tech} onSwitch={(id) => { tech.switchStance(id); forceUpdate((n) => n + 1); }} />
      )}
      {tab === 'skills' && <SkillsTab tech={tech} />}
    </div>
  );
}

function StancesTab({ tech, onSwitch }: {
  tech: typeof engine.technique;
  onSwitch: (id: string) => void;
}) {
  const currentStance = tech.currentStance;

  return (
    <div className="flex flex-col gap-2.5">
      {Object.values(STANCES).map((stance) => {
        const unlocked = tech.unlockedStances.includes(stance.id);
        const active = currentStance === stance.id;
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
            onSwitch={() => onSwitch(stance.id)}
          />
        );
      })}
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
      className="p-3 rounded-lg border"
      style={{
        borderColor: active ? `${stance.color}60` : unlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        backgroundColor: active ? `${stance.color}10` : 'rgba(255,255,255,0.02)',
        opacity: unlocked ? 1 : 0.4,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold" style={{ color: unlocked ? stance.color : 'rgba(255,255,255,0.4)' }}>
            {stance.name}
          </span>
          {active && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold" style={{ backgroundColor: `${stance.color}30`, color: stance.color }}>
              Active
            </span>
          )}
        </div>
        {!unlocked && (
          <span className="text-[8px] font-mono text-white/30">
            Requires: {stance.unlockRealm.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="text-[9px] font-mono text-white/40 mb-2">{stance.description}</div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 mb-2 text-[8px] font-mono">
        <Stat label="Power" value={`${stance.stats.boopPower}x`} />
        <Stat label="Speed" value={`${stance.stats.boopSpeed}x`} />
        <Stat label="Crit" value={`${(stance.stats.critChance * 100).toFixed(0)}%`} />
        <Stat label="Crit Mult" value={`${stance.stats.critMultiplier}x`} />
        <Stat label="Decay" value={`${stance.stats.comboDecay}x`} />
      </div>

      {/* Special */}
      <div className="text-[8px] font-mono text-[#FFD700]/60 mb-2">
        ⚡ {stance.special.name}: {stance.special.description}
      </div>

      {stance.id === 'forbiddenTechnique' && (
        <div className="text-[8px] font-mono text-red-400/60 mb-2">
          ⚠️ Costs 5 Qi per boop
        </div>
      )}

      {/* Mastery bar */}
      {unlocked && (
        <div className="mb-2">
          <div className="flex justify-between text-[8px] font-mono text-white/30 mb-0.5">
            <span>Mastery Lv {masteryLevel}/{maxMastery}</span>
            <span>{(masteryProgress * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, masteryProgress * 100)}%`, backgroundColor: stance.color }}
            />
          </div>
        </div>
      )}

      {/* Switch button */}
      {unlocked && !active && (
        <button
          className="w-full px-2 py-1.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer"
          style={{
            backgroundColor: `${stance.color}20`,
            color: stance.color,
            border: `1px solid ${stance.color}30`,
          }}
          onClick={onSwitch}
        >
          Switch to {stance.name}
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/30">{label}</span>
      <span className="text-white/60">{value}</span>
    </div>
  );
}

function SkillsTab({ tech }: { tech: typeof engine.technique }) {
  const learned = tech.learnedSkills;
  const totalSkills = HIDDEN_SKILLS.length;
  const remaining = totalSkills - learned.length;

  return (
    <div>
      <div className="text-[9px] font-mono text-white/40 mb-3">
        Discovered: {learned.length}/{totalSkills}
      </div>

      <div className="flex flex-col gap-2">
        {HIDDEN_SKILLS.map((skill) => {
          const discovered = learned.includes(skill.id);
          return (
            <div
              key={skill.id}
              className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
              style={{ opacity: discovered ? 1 : 0.3 }}
            >
              {discovered ? (
                <>
                  <div className="text-[10px] font-mono font-bold text-[#DC143C] mb-0.5">{skill.name}</div>
                  <div className="text-[9px] font-mono text-white/40">{skill.description}</div>
                  <div className="text-[8px] font-mono text-[#50C878]/50 mt-1">
                    {Object.entries(skill.effect).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </div>
                </>
              ) : (
                <div className="text-[10px] font-mono text-white/20">??? Unknown Skill</div>
              )}
            </div>
          );
        })}
      </div>

      {remaining > 0 && (
        <div className="text-[9px] font-mono text-white/20 text-center mt-3">
          {remaining} skill{remaining !== 1 ? 's' : ''} yet to discover...
        </div>
      )}
    </div>
  );
}
