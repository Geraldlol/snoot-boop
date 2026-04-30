/**
 * EquipmentPanel — Relics (wuxia reskin).
 * Inventory + paper-doll equipped view with rarity glow + set bonuses.
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import {
  EQUIPMENT_SLOTS,
  EQUIPMENT_RARITIES,
  type EquipmentSlotId,
  type EquipmentInstance,
} from '@/engine/systems/equipment/equipment-system';

const SLOT_GLYPHS: Record<string, string> = {
  hat: '冠', collar: '鈴', weapon: '劍', armor: '甲', paws: '爪', tail: '尾',
};
const SLOT_IDS: (EquipmentSlotId | 'all')[] = ['all', 'hat', 'collar', 'weapon', 'armor', 'paws', 'tail'];

function rarityColor(rarity: string): string {
  const r = EQUIPMENT_RARITIES[rarity as keyof typeof EQUIPMENT_RARITIES];
  return r?.color ?? 'var(--ink-mute)';
}

export default function EquipmentPanel() {
  const _bp = useGameStore((s) => s.currencies.bp);
  void _bp;
  const cats = useCatStore((s) => s.cats);
  const [tab, setTab] = useState<'inventory' | 'equipped'>('inventory');
  const [slotFilter, setSlotFilter] = useState<EquipmentSlotId | 'all'>('all');
  const [selectedCat, setSelectedCat] = useState<string>(cats[0]?.id ?? '');
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const inventory = engine.equipment.getInventory();
  const filtered = slotFilter === 'all' ? inventory : inventory.filter((i) => i.slot === slotFilter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="glyph-badge" style={{ color: '#9370DB', width: 38, height: 38 }}>
            <span style={{ fontSize: 16 }}>甲</span>
          </div>
          <div>
            <div className="h-section">Relic Hall</div>
            <div className="h-eyebrow">{inventory.length} relics gathered</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {(['inventory', 'equipped'] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 transition-all cursor-pointer relative"
              style={{
                color: active ? 'var(--gold-bright)' : 'var(--ink-mute)',
                borderBottom: active ? '2px solid var(--gold-bright)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {t === 'inventory' ? 'Inventory' : 'Adorned'}
            </button>
          );
        })}
      </div>

      {tab === 'inventory' && (
        <>
          {/* Slot filter */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {SLOT_IDS.map((s) => {
              const active = slotFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setSlotFilter(s)}
                  className="font-display text-[10px] tracking-[0.10em] uppercase px-2 py-1 cursor-pointer"
                  style={{
                    background: active ? 'rgba(230,194,117,0.16)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'var(--gold)' : 'var(--rule)'}`,
                    color: active ? 'var(--gold-bright)' : 'var(--ink-dim)',
                    borderRadius: 1,
                  }}
                >
                  {s === 'all' ? 'All' : `${SLOT_GLYPHS[s] ?? '?'} ${s}`}
                </button>
              );
            })}
          </div>

          {/* Item list */}
          <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-8 italic" style={{ color: 'var(--ink-dim)' }}>
                No relics in this category.
              </div>
            ) : (
              filtered.map((item) => <ItemRow key={item.id} item={item} refresh={refresh} />)
            )}
          </div>
        </>
      )}

      {tab === 'equipped' && (
        <>
          {/* Cat picker */}
          {cats.length === 0 ? (
            <p className="text-center py-12 italic" style={{ color: 'var(--ink-dim)' }}>
              No cats to adorn yet.
            </p>
          ) : (
            <>
              <div className="mb-4">
                <div className="h-eyebrow mb-1.5">Disciple</div>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full font-mono text-sm p-2"
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--rule)',
                    color: 'var(--ink)',
                    borderRadius: 1,
                  }}
                >
                  {cats.map((c) => (
                    <option key={c.instanceId} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedCat && <PaperDoll catId={selectedCat} refresh={refresh} />}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Paper-doll grid ────────────────────────────────────────

function PaperDoll({ catId, refresh }: { catId: string; refresh: () => void }) {
  const equipped = engine.equipment.getEquippedItems(catId);
  const sets = engine.equipment.calculateSetBonuses(catId);
  const stats = engine.equipment.calculateEquipmentStats(catId);
  const statEntries = Object.entries(stats).filter(([, v]) => v !== 0);

  return (
    <>
      {/* 3×2 slot grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(EQUIPMENT_SLOTS) as EquipmentSlotId[]).map((slot) => {
          const item = equipped[slot];
          return (
            <button
              key={slot}
              onClick={() => { if (item) { engine.unequipItem(catId, slot); refresh(); } }}
              className="card-row p-3 text-center cursor-pointer"
              style={{
                background: item ? `${rarityColor(item.rarity)}10` : 'rgba(0,0,0,0.3)',
                border: item ? `1px solid ${rarityColor(item.rarity)}88` : '1px dashed var(--rule)',
                borderRadius: 1,
                minHeight: 88,
              }}
            >
              <div className="font-display text-[18px]" style={{ color: item ? rarityColor(item.rarity) : 'var(--ink-dim)' }}>
                {SLOT_GLYPHS[slot] ?? '?'}
              </div>
              <div className="h-eyebrow mt-0.5">{slot}</div>
              {item ? (
                <div className="font-display text-[10px] mt-1 tracking-[0.04em]" style={{ color: rarityColor(item.rarity) }}>
                  {item.name}
                </div>
              ) : (
                <div className="font-mono text-[9px] mt-1" style={{ color: 'var(--ink-dim)' }}>empty</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Set bonuses */}
      {sets.length > 0 && (
        <div className="panel p-3 mb-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-eyebrow mb-2">Set Resonances</div>
          <div className="flex flex-col gap-1">
            {sets.map((s, i) => (
              <div key={i} className="text-sm flex items-center gap-2">
                <span className="font-mono text-[10px] px-1.5" style={{ color: 'var(--jade-bright)', border: '1px solid var(--jade-deep)' }}>
                  {s.count}pc
                </span>
                <span style={{ color: 'var(--jade-bright)' }}>{s.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {statEntries.length > 0 && (
        <div className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-eyebrow mb-2">Adornment Bonuses</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {statEntries.map(([stat, val]) => (
              <div key={stat} className="font-mono text-[11px] flex justify-between">
                <span style={{ color: 'var(--ink-mute)' }}>{stat}</span>
                <span style={{ color: 'var(--gold-bright)' }}>+{formatNumber(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Item row ───────────────────────────────────────────────

function ItemRow({ item, refresh }: { item: EquipmentInstance; refresh: () => void }) {
  const canLevel = engine.equipment.canLevelUp(item.id);
  const levelCost = engine.equipment.getLevelUpCost(item.id);
  const isEquipped = engine.equipment.isEquipped(item.id);
  const color = rarityColor(item.rarity);

  return (
    <div
      className="card-row flex items-center gap-3 p-3"
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: `1px solid ${color}55`,
        borderRadius: 1,
        boxShadow: `inset 0 0 16px ${color}10`,
      }}
    >
      <div
        className="rune flex-shrink-0"
        style={{
          width: 44, height: 44, fontSize: 18,
          background: `radial-gradient(circle at 35% 30%, ${color}55, ${color}22 60%, rgba(0,0,0,0.4))`,
          border: `1px solid ${color}88`,
          color: '#fff7df',
          textShadow: `0 0 10px ${color}cc`,
        }}
      >
        {SLOT_GLYPHS[item.slot] ?? '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-display text-[12px] tracking-[0.06em] truncate" style={{ color }}>
          {item.name}
        </div>
        <div className="h-eyebrow">
          {item.slot} · Lv.{item.level}/{item.maxLevel}
          {Object.entries(item.stats).slice(0, 2).map(([k, v]) => ` · ${k}+${v}`).join('')}
        </div>
      </div>

      <div className="flex gap-1.5 flex-shrink-0">
        {canLevel && !isEquipped && (
          <button
            className="btn"
            style={{ padding: '5px 10px', fontSize: 9, color, borderColor: `${color}66` }}
            onClick={() => { engine.levelUpEquipment(item.id); refresh(); }}
            title="Level up"
          >
            ↑ {formatNumber(levelCost)}
          </button>
        )}
        {!isEquipped && (
          <button
            className="btn"
            style={{ padding: '5px 10px', fontSize: 9 }}
            onClick={() => { engine.salvageEquipment(item.id); refresh(); }}
          >
            Salvage
          </button>
        )}
        {isEquipped && (
          <span className="font-display text-[9px] tracking-[0.16em] px-2 py-1" style={{ color: 'var(--jade-bright)', border: '1px solid var(--jade-deep)' }}>
            ADORNED
          </span>
        )}
      </div>
    </div>
  );
}
