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

const COLOR = '#9370DB';
const SLOT_EMOJIS: Record<string, string> = {
  hat: '🎩', collar: '📿', weapon: '⚔️', armor: '🛡️', paws: '🐾', tail: '🎀',
};
const SLOT_IDS: (EquipmentSlotId | 'all')[] = ['all', 'hat', 'collar', 'weapon', 'armor', 'paws', 'tail'];

function rarityColor(rarity: string): string {
  const r = EQUIPMENT_RARITIES[rarity as keyof typeof EQUIPMENT_RARITIES];
  return r?.color ?? '#aaa';
}

export default function EquipmentPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
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
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: COLOR }}>
        ⚔️ Equipment ({inventory.length} items)
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {(['inventory', 'equipped'] as const).map((t) => (
          <button
            key={t}
            className="text-xs font-mono px-3 py-1.5 rounded cursor-pointer"
            style={{
              backgroundColor: tab === t ? `${COLOR}30` : 'rgba(255,255,255,0.05)',
              color: tab === t ? COLOR : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t ? `2px solid ${COLOR}` : '2px solid transparent',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'inventory' ? 'Inventory' : 'Equipped'}
          </button>
        ))}
      </div>

      {tab === 'inventory' && (
        <>
          {/* Slot filter */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {SLOT_IDS.map((s) => (
              <button
                key={s}
                className="text-[10px] font-mono px-2 py-1 rounded cursor-pointer"
                style={{
                  backgroundColor: slotFilter === s ? `${COLOR}20` : 'rgba(255,255,255,0.05)',
                  color: slotFilter === s ? COLOR : 'rgba(255,255,255,0.3)',
                }}
                onClick={() => setSlotFilter(s)}
              >
                {s === 'all' ? 'All' : `${SLOT_EMOJIS[s]} ${s}`}
              </button>
            ))}
          </div>

          {/* Item list */}
          <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
            {filtered.map((item) => (
              <ItemRow key={item.id} item={item} refresh={refresh} />
            ))}
            {filtered.length === 0 && (
              <div className="text-[9px] font-mono text-white/50 text-center py-4">No items</div>
            )}
          </div>
        </>
      )}

      {tab === 'equipped' && (
        <>
          {/* Cat selector */}
          <div className="mb-3">
            <select
              className="w-full text-xs font-mono bg-black/30 border border-white/10 rounded p-1.5 text-white/70"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              {cats.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCat && (
            <>
              {/* Slot grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {(Object.keys(EQUIPMENT_SLOTS) as EquipmentSlotId[]).map((slot) => {
                  const equipped = engine.equipment.getEquippedItems(selectedCat);
                  const item = equipped[slot];
                  return (
                    <div
                      key={slot}
                      className="p-2 rounded border border-white/5 bg-black/20 text-center cursor-pointer"
                      onClick={() => { if (item) { engine.unequipItem(selectedCat, slot); refresh(); } }}
                    >
                      <div className="text-[10px] font-mono text-white/50 mb-0.5">
                        {SLOT_EMOJIS[slot]} {slot}
                      </div>
                      {item ? (
                        <div className="text-[10px] font-mono font-bold" style={{ color: rarityColor(item.rarity) }}>
                          {item.name} Lv.{item.level}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-white/50">Empty</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Set bonuses */}
              {(() => {
                const sets = engine.equipment.calculateSetBonuses(selectedCat);
                if (sets.length === 0) return null;
                return (
                  <div className="mb-3 p-2 rounded border border-white/5 bg-black/20">
                    <div className="text-[10px] font-mono text-white/40 mb-1">Set Bonuses:</div>
                    {sets.map((s, i) => (
                      <div key={i} className="text-[10px] font-mono text-[#50C878]">
                        {s.description} ({s.count}pc)
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Total stats */}
              {(() => {
                const stats = engine.equipment.calculateEquipmentStats(selectedCat);
                const entries = Object.entries(stats).filter(([, v]) => v !== 0);
                if (entries.length === 0) return null;
                return (
                  <div className="p-2 rounded border border-white/5 bg-black/20">
                    <div className="text-[10px] font-mono text-white/40 mb-1">Total Equipment Stats:</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      {entries.map(([stat, val]) => (
                        <div key={stat} className="text-[10px] font-mono text-white/50">
                          {stat}: <span className="text-white/70">+{formatNumber(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </>
      )}
    </div>
  );
}

function ItemRow({ item, refresh }: { item: EquipmentInstance; refresh: () => void }) {
  const canLevel = engine.equipment.canLevelUp(item.id);
  const levelCost = engine.equipment.getLevelUpCost(item.id);
  const isEquipped = engine.equipment.isEquipped(item.id);

  return (
    <div className="p-2 rounded-lg border border-white/5 bg-white/[0.02] flex items-center gap-2">
      <span className="text-sm">{SLOT_EMOJIS[item.slot] ?? '?'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono font-bold" style={{ color: rarityColor(item.rarity) }}>
          {item.name}
        </div>
        <div className="text-[10px] font-mono text-white/50">
          {item.slot} · Lv.{item.level}/{item.maxLevel}
          {Object.entries(item.stats).slice(0, 2).map(([k, v]) => ` · ${k}:${v}`).join('')}
        </div>
      </div>
      <div className="flex gap-1">
        {canLevel && !isEquipped && (
          <button
            className="text-[9px] font-mono px-1.5 py-0.5 rounded cursor-pointer"
            style={{ backgroundColor: '#9370DB20', color: '#9370DB', border: '1px solid #9370DB30' }}
            onClick={() => { engine.levelUpEquipment(item.id); refresh(); }}
          >
            ↑{formatNumber(levelCost)}
          </button>
        )}
        {!isEquipped && (
          <button
            className="text-[9px] font-mono px-1.5 py-0.5 rounded cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
            onClick={() => { engine.salvageEquipment(item.id); refresh(); }}
          >
            Salvage
          </button>
        )}
      </div>
    </div>
  );
}
