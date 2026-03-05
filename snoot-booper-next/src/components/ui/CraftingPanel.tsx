'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { MATERIAL_TEMPLATES } from '@/engine/systems/equipment/crafting-system';

const COLOR = '#DC143C';

export default function CraftingPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState<'craft' | 'materials' | 'enchant'>('craft');
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  return (
    <div>
      <h2 className="text-sm font-mono font-bold mb-3" style={{ color: COLOR }}>
        🔨 Crafting
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {(['craft', 'materials', 'enchant'] as const).map((t) => (
          <button
            key={t}
            className="text-[10px] font-mono px-3 py-1.5 rounded cursor-pointer"
            style={{
              backgroundColor: tab === t ? `${COLOR}30` : 'rgba(255,255,255,0.05)',
              color: tab === t ? COLOR : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t ? `2px solid ${COLOR}` : '2px solid transparent',
            }}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'craft' && <CraftTab refresh={refresh} />}
      {tab === 'materials' && <MaterialsTab />}
      {tab === 'enchant' && <EnchantTab refresh={refresh} bp={bp} />}
    </div>
  );
}

function CraftTab({ refresh }: { refresh: () => void }) {
  const queue = engine.crafting.getQueue();
  const blueprints = engine.crafting.getAvailableBlueprints();
  const materials = engine.crafting.getAllMaterials();

  return (
    <div>
      {/* Queue */}
      {queue.length > 0 && (
        <div className="mb-3">
          <div className="text-[8px] font-mono text-white/40 mb-1">Queue ({queue.length}/3):</div>
          {queue.map((job) => {
            const progress = engine.crafting.getCraftProgress(job.id);
            return (
              <div key={job.id} className="p-2 rounded bg-black/20 border border-white/5 mb-1 flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-[9px] font-mono text-white/60">{job.blueprintId}</div>
                  <div className="h-1 bg-black/30 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progress * 100}%`, backgroundColor: '#50C878' }}
                    />
                  </div>
                </div>
                <button
                  className="text-[7px] font-mono px-1.5 py-0.5 rounded cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
                  onClick={() => { engine.cancelCraft(job.id); refresh(); }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Blueprints */}
      <div className="text-[8px] font-mono text-white/40 mb-1">Blueprints:</div>
      <div className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto">
        {blueprints.map((bp) => {
          const canCraft = engine.crafting.canCraft(bp.id);
          return (
            <div key={bp.id} className="p-2 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-mono font-bold text-white/80">{bp.name}</div>
                <button
                  className="text-[8px] font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: canCraft ? `${COLOR}20` : 'rgba(255,255,255,0.05)',
                    color: canCraft ? COLOR : 'rgba(255,255,255,0.2)',
                    border: canCraft ? `1px solid ${COLOR}30` : '1px solid transparent',
                    cursor: canCraft ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => { if (canCraft) { engine.startCraft(bp.id); refresh(); } }}
                >
                  Craft
                </button>
              </div>
              <div className="text-[8px] font-mono text-white/30">
                Time: {Math.round(bp.craftTime / 1000)}s
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(bp.materials).map(([matId, needed]) => {
                  const have = materials[matId] ?? 0;
                  const ok = have >= needed;
                  return (
                    <span
                      key={matId}
                      className="text-[7px] font-mono px-1 rounded"
                      style={{ color: ok ? '#50C878' : '#E94560', backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      {matId}: {have}/{needed}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        {blueprints.length === 0 && (
          <div className="text-[9px] font-mono text-white/30 text-center py-4">No blueprints unlocked</div>
        )}
      </div>
    </div>
  );
}

function MaterialsTab() {
  const materials = engine.crafting.getAllMaterials();
  const entries = Object.entries(materials).filter(([, v]) => v > 0);

  const findTemplate = (id: string) => MATERIAL_TEMPLATES.find((m) => m.id === id);

  // Group by category
  const grouped: Record<string, [string, number][]> = {};
  for (const [id, count] of entries) {
    const tmpl = findTemplate(id);
    const cat = tmpl?.category ?? 'unknown';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push([id, count]);
  }

  return (
    <div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-3">
          <div className="text-[9px] font-mono text-white/40 mb-1 capitalize">{cat}:</div>
          <div className="flex flex-col gap-0.5">
            {items.map(([id, count]) => {
              const tmpl = findTemplate(id);
              return (
                <div key={id} className="flex items-center justify-between px-2 py-1 rounded bg-black/20">
                  <span className="text-[9px] font-mono text-white/60">
                    {tmpl?.emoji ?? '?'} {tmpl?.name ?? id}
                  </span>
                  <span className="text-[9px] font-mono text-white/70">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-[9px] font-mono text-white/30 text-center py-4">No materials collected</div>
      )}
    </div>
  );
}

function EnchantTab({ refresh, bp }: { refresh: () => void; bp: number }) {
  const enchantments = engine.crafting.getAvailableEnchantments();

  return (
    <div>
      <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
        {enchantments.map((ench) => {
          const canEnchant = engine.crafting.canEnchant(ench.id, bp);
          return (
            <div key={ench.id} className="p-2 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-[10px] font-mono font-bold text-white/80">{ench.name}</div>
                  <div className="text-[8px] font-mono text-white/30">Tier {ench.tier}</div>
                </div>
                <button
                  className="text-[8px] font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: canEnchant ? '#DC143C20' : 'rgba(255,255,255,0.05)',
                    color: canEnchant ? '#DC143C' : 'rgba(255,255,255,0.2)',
                    cursor: canEnchant ? 'pointer' : 'not-allowed',
                  }}
                  onClick={() => { if (canEnchant) { engine.crafting.enchant(ench.id); refresh(); } }}
                >
                  Enchant ({formatNumber(ench.bpCost)} BP)
                </button>
              </div>
              <div className="text-[8px] font-mono text-white/40">
                Stats: {Object.entries(ench.stats).map(([k, v]) => `${k}: +${v}`).join(', ')}
              </div>
            </div>
          );
        })}
        {enchantments.length === 0 && (
          <div className="text-[9px] font-mono text-white/30 text-center py-4">No enchantments available</div>
        )}
      </div>
    </div>
  );
}
