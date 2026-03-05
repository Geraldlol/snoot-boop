'use client';

import { useState } from 'react';
import { engine } from '@/engine/engine';
import type { AchievementCategory } from '@/engine/systems/social';

const CATEGORIES: { id: AchievementCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '📋' },
  { id: 'booping', label: 'Booping', emoji: '👆' },
  { id: 'cats', label: 'Cats', emoji: '🐱' },
  { id: 'waifus', label: 'Waifus', emoji: '💕' },
  { id: 'goose', label: 'Goose', emoji: '🪶' },
  { id: 'cultivation', label: 'Cultivation', emoji: '⬆️' },
  { id: 'secret', label: 'Secret', emoji: '🔮' },
];

export default function AchievementsPanel() {
  const [activeTab, setActiveTab] = useState<AchievementCategory | 'all'>('all');
  const progress = engine.achievement.getProgress();
  const allAchievements = engine.achievement.getAll();

  const filtered = activeTab === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.category === activeTab);

  return (
    <div>
      <h2 className="text-sm font-mono text-[#FFD700] font-bold mb-2">🏆 Achievements</h2>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[9px] font-mono text-white/50 mb-1">
          <span>{progress.unlocked}/{progress.total} unlocked</span>
          <span>{progress.percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFD700] transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 mb-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className="px-2 py-1 text-[9px] font-mono rounded transition-all cursor-pointer"
            style={{
              backgroundColor: activeTab === cat.id ? '#FFD70030' : 'rgba(255,255,255,0.05)',
              color: activeTab === cat.id ? '#FFD700' : 'rgba(255,255,255,0.4)',
              borderBottom: activeTab === cat.id ? '2px solid #FFD700' : '2px solid transparent',
            }}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievement list */}
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
        {filtered.map(ach => (
          <AchievementRow key={ach.id} achievement={ach} />
        ))}
        {filtered.length === 0 && (
          <p className="text-[10px] text-white/30 font-mono text-center py-4">
            No achievements in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}

function AchievementRow({ achievement }: {
  achievement: { id: string; name: string; description: string; emoji: string; unlocked: boolean; unlockedAt?: number; reward?: { type: string; value: number | string }; hidden?: boolean };
}) {
  const isHidden = achievement.hidden && !achievement.unlocked;

  return (
    <div
      className="flex items-start gap-2 p-2 rounded-lg border transition-all"
      style={{
        borderColor: achievement.unlocked ? '#FFD70030' : 'rgba(255,255,255,0.05)',
        backgroundColor: achievement.unlocked ? '#FFD70008' : 'rgba(0,0,0,0.2)',
        opacity: achievement.unlocked ? 1 : 0.6,
      }}
    >
      <span className="text-base flex-shrink-0">{isHidden ? '❓' : achievement.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono font-bold" style={{ color: achievement.unlocked ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
          {isHidden ? '???' : achievement.name}
        </div>
        <div className="text-[9px] font-mono text-white/40">
          {isHidden ? 'Hidden achievement' : achievement.description}
        </div>
        {achievement.reward && !isHidden && (
          <div className="text-[9px] font-mono text-[#50C878] mt-0.5">
            Reward: {achievement.reward.value} {achievement.reward.type}
          </div>
        )}
      </div>
      {achievement.unlocked && (
        <span className="text-[9px] font-mono text-white/30 flex-shrink-0">✓</span>
      )}
    </div>
  );
}
