/**
 * UpgradePanel — wuxia reskin.
 * Tabbed by upgrade category. Reads engine.upgrade.*; calls engine.purchaseUpgrade.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { UPGRADE_CATEGORIES, UPGRADE_TEMPLATES, type UpgradeTemplate } from '@/engine/systems/core/upgrade-system';
import { useState } from 'react';

export default function UpgradePanel() {
  const [selected, setSelected] = useState(UPGRADE_CATEGORIES[0].id);
  const bp = useGameStore((s) => s.currencies.bp);
  const upgrades = UPGRADE_TEMPLATES.filter((t) => t.category === selected);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>增</span>
        </div>
        <div>
          <div className="h-section">Cultivation Upgrades</div>
          <div className="h-eyebrow">Spend boop points to refine your path</div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-0 mb-4 border-b" style={{ borderColor: 'var(--rule)' }}>
        {UPGRADE_CATEGORIES.map((cat) => {
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer relative"
              style={{
                color: active ? cat.color : 'var(--ink-mute)',
                borderBottom: `2px solid ${active ? cat.color : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        {upgrades.map((t) => (
          <UpgradeRow key={t.id} template={t} currentBP={bp} accent={UPGRADE_CATEGORIES.find((c) => c.id === selected)?.color ?? 'var(--gold)'} />
        ))}
      </div>
    </div>
  );
}

function UpgradeRow({ template, currentBP, accent }: { template: UpgradeTemplate; currentBP: number; accent: string }) {
  const level = engine.upgrade.getLevel(template.id);
  const cost = engine.upgrade.getCost(template.id);
  const maxed = level >= template.maxLevel;
  const canBuy = !maxed && engine.upgrade.canPurchase(template.id, currentBP);
  const reqsMet = !template.requires || template.requires.every(
    (req) => engine.upgrade.getLevel(req.upgradeId) >= req.level
  );

  return (
    <div
      className="panel p-3"
      style={{
        background: 'rgba(0,0,0,0.3)',
        borderColor: maxed ? 'var(--jade-deep)' : `${accent}33`,
        opacity: reqsMet ? 1 : 0.4,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>
          {template.name}
        </span>
        <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>
          Lv {level}/{template.maxLevel}
        </span>
      </div>
      <div className="meter mb-2" style={{ height: 4 }}>
        <div
          className={`meter-fill ${maxed ? 'jade' : ''}`}
          style={{ width: `${(level / template.maxLevel) * 100}%`, background: maxed ? undefined : `linear-gradient(90deg, ${accent}66, ${accent})` }}
        />
      </div>

      <p className="text-xs mb-2" style={{ color: 'var(--ink-mute)' }}>{template.description}</p>

      {template.requires && !reqsMet && (
        <div className="font-mono text-[10px] mb-2" style={{ color: 'var(--vermillion-bright)' }}>
          Requires: {template.requires.map((req) => {
            const reqT = UPGRADE_TEMPLATES.find((t) => t.id === req.upgradeId);
            const met = engine.upgrade.getLevel(req.upgradeId) >= req.level;
            return (
              <span key={req.upgradeId} style={{ color: met ? 'var(--jade-bright)' : undefined }}>
                {reqT?.name ?? req.upgradeId} Lv{req.level}{' '}
              </span>
            );
          })}
        </div>
      )}

      {!maxed && reqsMet && (
        <button
          className={`btn w-full ${canBuy ? 'btn-primary' : ''}`}
          disabled={!canBuy}
          onClick={() => engine.purchaseUpgrade(template.id)}
        >
          {cost === Infinity ? 'Maxed' : `Refine · ${formatNumber(cost)} bp`}
        </button>
      )}

      {maxed && (
        <div className="text-center font-display text-[11px] tracking-[0.16em] uppercase" style={{ color: 'var(--jade-bright)' }}>
          ✦ Mastered
        </div>
      )}
    </div>
  );
}
