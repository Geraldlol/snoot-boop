'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { TERRITORIES, BUILDINGS, type TerritoryData } from '@/engine/systems/progression/building-system';
import type { TerritoryId } from '@/engine/types';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'core', name: 'Core', emoji: '🏛️' },
  { id: 'production', name: 'Production', emoji: '⚒️' },
  { id: 'social', name: 'Social', emoji: '💕' },
  { id: 'utility', name: 'Utility', emoji: '🔧' },
  { id: 'special', name: 'Special', emoji: '⭐' },
] as const;

export default function BuildingPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState<string>('core');
  const [, forceUpdate] = useState(0);

  const territory = engine.building.getCurrentTerritory();
  const usedSlots = engine.building.getUsedSlots();
  const totalSlots = engine.building.getAvailableSlots();
  const catCap = engine.building.getTotalCatCapacity();
  const buildings = engine.building.getAllBuildings().filter((b) => b.data.category === tab);

  function handleBuild(buildingId: string) {
    engine.buildBuilding(buildingId);
    forceUpdate((n) => n + 1);
  }

  function handleUnlockTerritory(id: TerritoryId) {
    engine.unlockTerritory(id);
    forceUpdate((n) => n + 1);
  }

  return (
    <div>
      <h2 className="text-sm font-mono text-[#8B4513] font-bold mb-3">🏯 Buildings</h2>

      {/* Territory header */}
      <div className="mb-4 p-3 rounded-lg border border-[#8B4513]/30 bg-[#8B4513]/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono font-bold text-[#8B4513]">{territory.name}</span>
          <span className="text-[9px] font-mono text-white/40">
            Slots: {usedSlots}/{totalSlots}
          </span>
        </div>
        <div className="text-[9px] font-mono text-white/40">
          Cat Capacity: {catCap} | Theme: {territory.theme}
        </div>
      </div>

      {/* Territory upgrades */}
      {Object.values(TERRITORIES).some(
        (t) => !engine.building.getUnlockedTerritories().includes(t.id)
      ) && (
        <div className="mb-4">
          <h3 className="text-[10px] font-mono text-white/60 font-bold mb-2">Territories</h3>
          <div className="flex flex-col gap-1.5">
            {Object.values(TERRITORIES)
              .filter((t) => !engine.building.getUnlockedTerritories().includes(t.id))
              .map((t) => (
                <TerritoryRow
                  key={t.id}
                  territory={t}
                  canAfford={bp >= t.cost}
                  onUnlock={() => handleUnlockTerritory(t.id)}
                />
              ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: tab === cat.id ? '#8B451330' : 'rgba(255,255,255,0.05)',
              color: tab === cat.id ? '#8B4513' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === cat.id ? '2px solid #8B4513' : '2px solid transparent',
            }}
            onClick={() => setTab(cat.id)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Building list */}
      <div className="flex flex-col gap-2">
        {buildings.map((b) => {
          const nextLevel = b.level + 1;
          const atMax = b.level >= b.data.maxLevel;
          const cost = engine.building.getBuildingCost(b.id);
          const canBuild = engine.building.canBuild(b.id, bp);
          const effectPreview = atMax ? null : b.data.effect(nextLevel);
          const needsSlot = b.level === 0;

          return (
            <div
              key={b.id}
              className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-white/80">{b.data.name}</span>
                <span className="text-[9px] font-mono text-white/40">
                  Lv {b.level}/{b.data.maxLevel}
                </span>
              </div>
              <div className="text-[9px] font-mono text-white/40 mb-2">{b.data.description}</div>

              {effectPreview && (
                <div className="text-[8px] font-mono text-[#50C878]/60 mb-2">
                  Next: {Object.entries(effectPreview).map(([k, v]) => `${k}: ${v}`).join(', ')}
                </div>
              )}

              {!atMax && (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/30">
                    {formatNumber(cost)} BP{needsSlot ? ' (1 slot)' : ''}
                  </span>
                  <button
                    className="px-3 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer"
                    style={{
                      backgroundColor: canBuild ? '#8B451320' : 'rgba(255,255,255,0.05)',
                      color: canBuild ? '#8B4513' : 'rgba(255,255,255,0.2)',
                      border: canBuild ? '1px solid #8B451330' : '1px solid transparent',
                      cursor: canBuild ? 'pointer' : 'not-allowed',
                    }}
                    disabled={!canBuild}
                    onClick={() => handleBuild(b.id)}
                  >
                    {b.level === 0 ? 'Build' : 'Upgrade'}
                  </button>
                </div>
              )}
              {atMax && (
                <div className="text-[9px] font-mono text-[#FFD700]/60">✦ Max Level</div>
              )}
            </div>
          );
        })}
        {buildings.length === 0 && (
          <div className="text-[10px] font-mono text-white/30 text-center py-4">
            No buildings in this category
          </div>
        )}
      </div>
    </div>
  );
}

function TerritoryRow({ territory, canAfford, onUnlock }: {
  territory: TerritoryData; canAfford: boolean; onUnlock: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded border border-white/5 bg-white/[0.02]">
      <div>
        <div className="text-[10px] font-mono font-bold text-white/70">{territory.name}</div>
        <div className="text-[8px] font-mono text-white/30">
          {territory.catCapacity} cats | {territory.buildingSlots} slots
        </div>
      </div>
      <button
        className="px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer"
        style={{
          backgroundColor: canAfford ? '#8B451320' : 'rgba(255,255,255,0.05)',
          color: canAfford ? '#8B4513' : 'rgba(255,255,255,0.2)',
          cursor: canAfford ? 'pointer' : 'not-allowed',
        }}
        disabled={!canAfford}
        onClick={onUnlock}
      >
        {formatNumber(territory.cost)} BP
      </button>
    </div>
  );
}
