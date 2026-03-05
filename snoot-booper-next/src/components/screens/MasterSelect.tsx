/**
 * MasterSelect - Character selection screen
 */

'use client';

import { useState } from 'react';
import { MASTERS, MASTER_IDS } from '@/engine/data/masters';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import type { MasterId } from '@/engine/types';

const ROLE_ICONS: Record<string, string> = {
  'Sect Leader': '🐉',
  'War General': '👊',
  'Strategist': '🌊',
  'Scout': '⚡',
  'Assassin': '🌙',
  'Healer': '🌸',
  'Guardian': '⛰️',
};

export default function MasterSelect() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const setScreen = useUIStore((s) => s.setScreen);

  const handleSelect = (masterId: string) => {
    engine.master.selectMaster(masterId as MasterId);
    useGameStore.setState({ selectedMaster: masterId as MasterId });
    setScreen('game');
  };

  const hovered = hoveredId ? MASTERS[hoveredId] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-8">
      {/* Title */}
      <h1 className="text-3xl font-mono text-[#50C878] mb-2 tracking-wider">
        CHOOSE YOUR PATH
      </h1>
      <p className="text-sm text-[#7FFFD4]/60 font-mono mb-8">
        Select a Master of the Celestial Snoot Sect
      </p>

      {/* Master Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 max-w-5xl">
        {MASTER_IDS.map((id) => {
          const master = MASTERS[id];
          const icon = ROLE_ICONS[master.role] || '🐱';
          const isHovered = hoveredId === id;

          return (
            <button
              key={id}
              className="flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105"
              style={{
                borderColor: isHovered ? master.color : 'rgba(255,255,255,0.1)',
                backgroundColor: isHovered ? `${master.color}15` : 'rgba(255,255,255,0.03)',
                boxShadow: isHovered ? `0 0 20px ${master.color}40` : 'none',
              }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(id)}
            >
              {/* Placeholder portrait */}
              <div
                className="w-16 h-16 rounded-lg mb-2 flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${master.color}30` }}
              >
                {icon}
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: master.color }}>
                {master.name}
              </span>
              <span className="text-[10px] text-white/40 font-mono">{master.role}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div
        className="w-full max-w-lg p-6 rounded-lg border transition-all duration-300 min-h-[160px]"
        style={{
          borderColor: hovered ? `${hovered.color}60` : 'rgba(255,255,255,0.1)',
          backgroundColor: hovered ? `${hovered.color}08` : 'rgba(255,255,255,0.02)',
        }}
      >
        {hovered ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-mono font-bold" style={{ color: hovered.color }}>
                {hovered.name}
              </span>
              <span className="text-xs text-white/50 font-mono">{hovered.title}</span>
            </div>
            <p className="text-xs text-white/60 font-mono mb-3">{hovered.description}</p>
            <div className="p-3 rounded border border-white/10 bg-white/5">
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                Passive: {hovered.passive.name}
              </span>
              <p className="text-xs text-[#7FFFD4] font-mono mt-1">{hovered.passive.description}</p>
            </div>
            <p className="text-xs text-white/30 font-mono mt-3 italic">
              &quot;{hovered.quotes[0]}&quot;
            </p>
          </>
        ) : (
          <p className="text-xs text-white/30 font-mono text-center pt-12">
            Hover over a master to see their details
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="text-[10px] text-white/20 font-mono mt-8">
        &quot;The journey of a thousand boops begins with a single snoot.&quot;
      </p>
    </div>
  );
}
