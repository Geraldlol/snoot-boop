/**
 * MasterSelect - Character selection screen
 */

'use client';

import { useState, useEffect } from 'react';
import { MASTERS, MASTER_IDS } from '@/engine/data/masters';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import type { MasterId } from '@/engine/types';

const ROLE_ICONS: Record<string, string> = {
  'Sect Leader': '\uD83D\uDC09',
  'War General': '\uD83D\uDC4A',
  'Strategist': '\uD83C\uDF0A',
  'Scout': '\u26A1',
  'Assassin': '\uD83C\uDF19',
  'Healer': '\uD83C\uDF38',
  'Guardian': '\u26F0\uFE0F',
};

export default function MasterSelect() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const setScreen = useUIStore((s) => s.setScreen);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const activeId = hoveredId ?? selectedForDetail;
  const hovered = activeId ? MASTERS[activeId] : null;

  useEffect(() => {
    if (hovered) {
      setDetailVisible(false);
      const t = setTimeout(() => setDetailVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setDetailVisible(false);
    }
  }, [hovered]);

  const handleSelect = (masterId: string) => {
    if (isTouchDevice && selectedForDetail !== masterId) {
      setSelectedForDetail(masterId);
      return;
    }
    engine.master.selectMaster(masterId as MasterId);
    useGameStore.setState({ selectedMaster: masterId as MasterId });
    setScreen('game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-8 relative overflow-hidden">
      {/* Background shimmer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse, #50C878 0%, transparent 70%)',
            animation: 'shimmerPulse 4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-mono text-[#50C878] mb-2 tracking-wider relative z-10">
        CHOOSE YOUR PATH
      </h1>
      <p className="text-sm text-[#7FFFD4]/60 font-mono mb-8">
        Select a Master of the Celestial Snoot Sect
      </p>

      {/* Master Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 max-w-5xl">
        {MASTER_IDS.map((id) => {
          const master = MASTERS[id];
          const icon = ROLE_ICONS[master.role] || '\uD83D\uDC31';
          const isActive = activeId === id;

          return (
            <button
              key={id}
              className="flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#50C878]"
              style={{
                borderColor: isActive ? master.color : 'rgba(255,255,255,0.1)',
                backgroundColor: isActive ? `${master.color}15` : 'rgba(255,255,255,0.03)',
                boxShadow: isActive ? `0 0 20px ${master.color}40` : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(id)}
              aria-label={`Select ${master.name}, ${master.title}`}
            >
              {/* Portrait icon */}
              <div
                className="w-20 h-20 rounded-lg mb-2 flex items-center justify-center text-3xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${master.color}40, ${master.color}15)`,
                  border: `2px solid ${master.color}50`,
                  boxShadow: isActive ? `inset 0 0 15px ${master.color}30, 0 0 10px ${master.color}20` : `inset 0 2px 4px rgba(0,0,0,0.3)`,
                }}
              >
                {icon}
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: master.color }}>
                {master.name}
              </span>
              <span className="text-xs text-white/50 font-mono">{master.role}</span>
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
          transform: detailVisible ? 'translateY(0)' : 'translateY(8px)',
          opacity: detailVisible ? 1 : 0,
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
              <span className="text-xs text-white/50 font-mono uppercase tracking-wider">
                Passive: {hovered.passive.name}
              </span>
              <p className="text-xs text-[#7FFFD4] font-mono mt-1">{hovered.passive.description}</p>
            </div>
            <p className="text-xs text-white/50 font-mono mt-3 italic">
              &quot;{hovered.quotes[0]}&quot;
            </p>
            {isTouchDevice && selectedForDetail === activeId && (
              <button
                className="mt-3 px-4 py-2 rounded border font-mono text-xs transition-all focus-visible:ring-2 focus-visible:ring-[#50C878]"
                style={{
                  borderColor: hovered.color,
                  color: hovered.color,
                  backgroundColor: `${hovered.color}15`,
                }}
                onClick={() => {
                  engine.master.selectMaster(activeId as MasterId);
                  useGameStore.setState({ selectedMaster: activeId as MasterId });
                  setScreen('game');
                }}
              >
                Select {hovered.name}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-white/50 font-mono text-center pt-12">
            {isTouchDevice ? 'Tap a master to see their details' : 'Hover over a master to see their details'}
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-white/40 font-mono mt-8">
        &quot;The journey of a thousand boops begins with a single snoot.&quot;
      </p>

      <style>{`
        @keyframes shimmerPulse {
          0%, 100% { opacity: 0.08; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.15; transform: translateX(-50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
