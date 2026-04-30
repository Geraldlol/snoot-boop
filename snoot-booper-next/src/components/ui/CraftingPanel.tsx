/**
 * CraftingPanel — Forge (wuxia reskin).
 * Three sub-tabs: Craft / Materials / Enchant.
 */

'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { MATERIAL_TEMPLATES } from '@/engine/systems/equipment/crafting-system';

export default function CraftingPanel() {
  const bp = useGameStore((s) => s.currencies.bp);
  const [tab, setTab] = useState<'craft' | 'materials' | 'enchant'>('craft');
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--vermillion-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>匠</span>
        </div>
        <div>
          <div className="h-section">The Forge</div>
          <div className="h-eyebrow">Craft and enchant the relics of the sect</div>
        </div>
      </div>

      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {(['craft', 'materials', 'enchant'] as const).map((t) => {
          const a = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: a ? 'var(--vermillion-bright)' : 'var(--ink-mute)',
                borderBottom: `2px solid ${a ? 'var(--vermillion)' : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          );
        })}
      </div>

      {tab === 'craft' && <Craft refresh={refresh} />}
      {tab === 'materials' && <Materials />}
      {tab === 'enchant' && <Enchant refresh={refresh} bp={bp} />}
    </div>
  );
}

// ─── Craft ─────────────────────────────────────────────────

function Craft({ refresh }: { refresh: () => void }) {
  const queue = engine.crafting.getQueue();
  const blueprints = engine.crafting.getAvailableBlueprints();
  const materials = engine.crafting.getAllMaterials();

  return (
    <div>
      {queue.length > 0 && (
        <div className="mb-4">
          <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Forge Queue · {queue.length}/3</div>
          {queue.map((job) => {
            const progress = engine.crafting.getCraftProgress(job.id);
            return (
              <div key={job.id} className="panel p-3 mb-1.5 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="flex-1">
                  <div className="font-display text-[11px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{job.blueprintId}</div>
                  <div className="meter mt-1.5" style={{ height: 4 }}>
                    <div className="meter-fill jade" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
                <button
                  className="btn"
                  style={{ padding: '4px 10px', fontSize: 9 }}
                  onClick={() => { engine.cancelCraft(job.id); refresh(); }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Available Blueprints</div>
      <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
        {blueprints.length === 0 && (
          <p className="text-center py-8 italic" style={{ color: 'var(--ink-dim)' }}>
            No blueprints unlocked. Defeat dungeon bosses to discover them.
          </p>
        )}
        {blueprints.map((b) => {
          const canCraft = engine.crafting.canCraft(b.id);
          return (
            <div key={b.id} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center justify-between mb-1">
                <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{b.name}</div>
                <button
                  className="btn"
                  style={{ padding: '5px 12px', fontSize: 10, borderColor: canCraft ? 'var(--vermillion)' : undefined, color: canCraft ? 'var(--vermillion-bright)' : undefined }}
                  disabled={!canCraft}
                  onClick={() => { engine.startCraft(b.id); refresh(); }}
                >
                  Forge
                </button>
              </div>
              <div className="h-eyebrow mb-2">time · {Math.round(b.craftTime / 1000)}s</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(b.materials).map(([matId, needed]) => {
                  const have = materials[matId] ?? 0;
                  const ok = have >= needed;
                  return (
                    <span
                      key={matId}
                      className="font-mono text-[10px] px-1.5 py-0.5"
                      style={{
                        color: ok ? 'var(--jade-bright)' : 'var(--vermillion-bright)',
                        background: 'rgba(0,0,0,0.4)',
                        border: `1px solid ${ok ? 'var(--jade-deep)' : 'var(--vermillion)'}`,
                      }}
                    >
                      {matId} {have}/{needed}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Materials ────────────────────────────────────────────

function Materials() {
  const materials = engine.crafting.getAllMaterials();
  const entries = Object.entries(materials).filter(([, v]) => v > 0);
  const find = (id: string) => MATERIAL_TEMPLATES.find((m) => m.id === id);

  const grouped: Record<string, [string, number][]> = {};
  for (const [id, count] of entries) {
    const tmpl = find(id);
    const cat = tmpl?.category ?? 'unknown';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push([id, count]);
  }

  if (entries.length === 0) {
    return (
      <p className="text-center py-12 italic" style={{ color: 'var(--ink-dim)' }}>
        No materials gathered yet.
      </p>
    );
  }

  return (
    <div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-4">
          <div className="h-section text-left mb-2 capitalize" style={{ fontSize: 11 }}>{cat}</div>
          <div className="flex flex-col gap-1">
            {items.map(([id, count]) => {
              const tmpl = find(id);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between px-3 py-2 font-mono text-[11px]"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--rule)' }}
                >
                  <span style={{ color: 'var(--ink)' }}>
                    <span className="mr-1">{tmpl?.emoji ?? '·'}</span>
                    {tmpl?.name ?? id}
                  </span>
                  <span style={{ color: 'var(--gold-bright)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Enchant ──────────────────────────────────────────────

function Enchant({ refresh, bp }: { refresh: () => void; bp: number }) {
  const enchantments = engine.crafting.getAvailableEnchantments();

  if (enchantments.length === 0) {
    return (
      <p className="text-center py-12 italic" style={{ color: 'var(--ink-dim)' }}>
        No enchantments learned. Defeat foes in the Pagoda to learn from their relics.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
      {enchantments.map((e) => {
        const canEnchant = engine.crafting.canEnchant(e.id, bp);
        return (
          <div key={e.id} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <div className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{e.name}</div>
                <div className="h-eyebrow">tier {e.tier}</div>
              </div>
              <button
                className="btn"
                style={{ padding: '5px 12px', fontSize: 10, borderColor: canEnchant ? 'var(--vermillion)' : undefined, color: canEnchant ? 'var(--vermillion-bright)' : undefined }}
                disabled={!canEnchant}
                onClick={() => { engine.crafting.enchant(e.id); refresh(); }}
              >
                Enchant · {formatNumber(e.bpCost)} bp
              </button>
            </div>
            <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--jade-bright)' }}>
              {Object.entries(e.stats).map(([k, v]) => `${k} +${v}`).join(' · ')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
