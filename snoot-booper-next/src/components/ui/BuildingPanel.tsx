/**
 * BuildingPanel — Sect Hall (wuxia reskin).
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { TERRITORIES, type TerritoryData } from '@/engine/systems/progression/building-system';
import type { TerritoryId } from '@/engine/types';
import { useState } from 'react';

const CATEGORIES: Array<{ id: string; name: string; glyph: string }> = [
  { id: 'core',       name: 'Core',       glyph: '本' },
  { id: 'production', name: 'Production', glyph: '產' },
  { id: 'social',     name: 'Social',     glyph: '朋' },
  { id: 'utility',    name: 'Utility',    glyph: '具' },
  { id: 'special',    name: 'Special',    glyph: '奇' },
];

export default function BuildingPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState('core');
  const [, force] = useState(0);

  const territory = engine.building.getCurrentTerritory();
  const usedSlots = engine.building.getUsedSlots();
  const totalSlots = engine.building.getAvailableSlots();
  const catCap = engine.getCatCapacity();
  const buildings = engine.building.getAllBuildings().filter((b) => b.data.category === tab);
  const lockedTerritories = Object.values(TERRITORIES).filter(
    (t) => !engine.building.getUnlockedTerritories().includes(t.id)
  );

  function build(id: string) { engine.buildBuilding(id); force((n) => n + 1); }
  function unlockTerr(id: TerritoryId) { engine.unlockTerritory(id); force((n) => n + 1); }

  const slotPct = totalSlots > 0 ? (usedSlots / totalSlots) * 100 : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: '#8B4513', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>殿</span>
        </div>
        <div>
          <div className="h-section">Sect Hall</div>
          <div className="h-eyebrow">Build the seat of your sect</div>
        </div>
      </div>

      {/* Territory hero */}
      <div className="panel panel-ornate p-4 mb-4" style={{ background: 'rgba(139,69,19,0.10)', borderColor: '#8B4513aa' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-[14px] tracking-[0.06em]" style={{ color: '#fff7df' }}>
            {territory.name}
          </span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
            slots {usedSlots}/{totalSlots} · capacity {catCap} cats
          </span>
        </div>
        <div className="meter">
          <div className="meter-fill" style={{ width: `${slotPct}%`, background: 'linear-gradient(90deg, #5b3a1ecc, #8B4513, #d29b66)' }} />
        </div>
      </div>

      {/* Territory upgrades */}
      {lockedTerritories.length > 0 && (
        <div className="mb-4">
          <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Territories</div>
          <div className="flex flex-col gap-1.5">
            {lockedTerritories.map((t) => (
              <TerritoryRow
                key={t.id}
                territory={t}
                canAfford={bp >= t.cost}
                onUnlock={() => unlockTerr(t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex flex-wrap gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {CATEGORIES.map((cat) => {
          const active = tab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setTab(cat.id)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-3 py-2 cursor-pointer"
              style={{
                color: active ? 'var(--gold-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${active ? 'var(--gold)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {cat.glyph} {cat.name}
            </button>
          );
        })}
      </div>

      {/* Buildings */}
      <div className="flex flex-col gap-2">
        {buildings.length === 0 && (
          <div className="text-center py-8 italic" style={{ color: 'var(--ink-dim)' }}>
            No structures of this kind in this territory.
          </div>
        )}
        {buildings.map((b) => {
          const nextLvl = b.level + 1;
          const atMax = b.level >= b.data.maxLevel;
          const cost = engine.building.getBuildingCost(b.id);
          const canBuild = engine.building.canBuild(b.id, bp);
          const eff = atMax ? null : b.data.effect(nextLvl);
          const needsSlot = b.level === 0;
          return (
            <div key={b.id} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>
                  {b.data.name}
                </span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                  Lv {b.level}/{b.data.maxLevel}
                </span>
              </div>
              <div className="meter mb-2" style={{ height: 4 }}>
                <div className="meter-fill" style={{ width: `${(b.level / b.data.maxLevel) * 100}%`, background: 'linear-gradient(90deg, #5b3a1ecc, #8B4513, #d29b66)' }} />
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--ink-mute)' }}>{b.data.description}</p>

              {eff && (
                <div className="font-mono text-[10px] mb-2" style={{ color: 'var(--jade-bright)' }}>
                  next: {Object.entries(eff).map(([k, v]) => `${k} ${v}`).join(' · ')}
                </div>
              )}

              {!atMax && (
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                    {formatNumber(cost)} bp{needsSlot ? ' · 1 slot' : ''}
                  </span>
                  <button className="btn" disabled={!canBuild} onClick={() => build(b.id)}>
                    {b.level === 0 ? 'Construct' : 'Refine'}
                  </button>
                </div>
              )}
              {atMax && (
                <div className="text-center font-display text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--gold-bright)' }}>
                  ✦ Mastered
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TerritoryRow({ territory, canAfford, onUnlock }: {
  territory: TerritoryData; canAfford: boolean; onUnlock: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}>
      <div>
        <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{territory.name}</div>
        <div className="h-eyebrow">{territory.catCapacity} cats · {territory.buildingSlots} slots</div>
      </div>
      <button className="btn" disabled={!canAfford} onClick={onUnlock}>
        {formatNumber(territory.cost)} bp
      </button>
    </div>
  );
}
