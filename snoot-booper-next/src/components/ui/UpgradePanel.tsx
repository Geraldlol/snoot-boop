/**
 * UpgradePanel - Purchase upgrades from the 3 categories.
 */

'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { UPGRADE_CATEGORIES, UPGRADE_TEMPLATES, type UpgradeTemplate } from '@/engine/systems/core/upgrade-system';
import { useState } from 'react';

export default function UpgradePanel() {
  const [selectedCategory, setSelectedCategory] = useState(UPGRADE_CATEGORIES[0].id);
  const bp = useGameStore((s) => s.currencies.bp);

  const upgrades = UPGRADE_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div>
      <h2 className="text-sm font-mono text-[#50C878] font-bold mb-3">Upgrades</h2>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4">
        {UPGRADE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className="px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: selectedCategory === cat.id ? `${cat.color}30` : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.4)',
              borderBottom: selectedCategory === cat.id ? `2px solid ${cat.color}` : '2px solid transparent',
            }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Upgrade list */}
      <div className="flex flex-col gap-2">
        {upgrades.map((template) => (
          <UpgradeRow key={template.id} template={template} currentBP={bp} />
        ))}
      </div>
    </div>
  );
}

function UpgradeRow({ template, currentBP }: { template: UpgradeTemplate; currentBP: number }) {
  const level = engine.upgrade.getLevel(template.id);
  const cost = engine.upgrade.getCost(template.id);
  const maxed = level >= template.maxLevel;
  const canBuy = !maxed && engine.upgrade.canPurchase(template.id, currentBP);

  // Check requirements
  const reqsMet = !template.requires || template.requires.every(
    (req) => engine.upgrade.getLevel(req.upgradeId) >= req.level
  );

  const handlePurchase = () => {
    if (!canBuy) return;
    engine.purchaseUpgrade(template.id);
  };

  return (
    <div
      className={`p-3 rounded border transition-all ${
        !reqsMet ? 'opacity-40' : ''
      }`}
      style={{
        borderColor: maxed ? 'rgba(80, 200, 120, 0.3)' : canBuy ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
        backgroundColor: maxed ? 'rgba(80, 200, 120, 0.05)' : 'rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono font-bold text-white/90">{template.name}</span>
        <span className="text-[10px] font-mono text-white/40">
          Lv {level}/{template.maxLevel}
        </span>
      </div>

      <p className="text-[10px] font-mono text-white/50 mb-2">{template.description}</p>

      {/* Requirements */}
      {template.requires && !reqsMet && (
        <div className="text-[9px] font-mono text-red-400/70 mb-2">
          Requires:{' '}
          {template.requires.map((req) => {
            const reqTemplate = UPGRADE_TEMPLATES.find((t) => t.id === req.upgradeId);
            const met = engine.upgrade.getLevel(req.upgradeId) >= req.level;
            return (
              <span key={req.upgradeId} className={met ? 'text-green-400/70' : ''}>
                {reqTemplate?.name ?? req.upgradeId} Lv{req.level}
              </span>
            );
          })}
        </div>
      )}

      {!maxed && reqsMet && (
        <button
          className={`w-full py-1.5 rounded text-[10px] font-mono font-bold transition-all ${
            canBuy
              ? 'bg-[#E94560]/20 text-[#E94560] border border-[#E94560]/30 hover:bg-[#E94560]/30 cursor-pointer'
              : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
          onClick={handlePurchase}
          disabled={!canBuy}
        >
          {cost === Infinity ? 'MAX' : `Buy — ${formatNumber(cost)} BP`}
        </button>
      )}

      {maxed && (
        <div className="text-[10px] font-mono text-[#50C878] text-center">
          MASTERED
        </div>
      )}
    </div>
  );
}
