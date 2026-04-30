'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { REBIRTH_TIERS, KARMA_SHOP, CELESTIAL_BONUSES } from '@/engine/systems/progression/prestige-system';
import { useState } from 'react';

type Tab = 'rebirth' | 'reincarnation' | 'transcendence';

export default function PrestigePanel() {
  const [tab, setTab] = useState<Tab>('rebirth');
  const [, forceUpdate] = useState(0);

  const prestige = engine.prestige;
  const showReincarnation = prestige.currentTier >= 7 || prestige.reincarnationCount > 0;
  const showTranscendence = prestige.reincarnationCount >= 5 || prestige.transcendenceCount > 0;

  const tabs: { id: Tab; label: string; visible: boolean }[] = [
    { id: 'rebirth', label: '🔄 Rebirth', visible: true },
    { id: 'reincarnation', label: '🌀 Reincarnation', visible: showReincarnation },
    { id: 'transcendence', label: '🌟 Transcendence', visible: showTranscendence },
  ];

  return (
    <div>
      <h2 className="text-sm font-mono text-[#FFD700] font-bold mb-3">✨ Prestige</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.filter((t) => t.visible).map((t) => (
          <button
            key={t.id}
            className="px-3 py-1.5 rounded text-xs font-mono font-bold transition-all cursor-pointer"
            style={{
              backgroundColor: tab === t.id ? '#FFD70030' : 'rgba(255,255,255,0.05)',
              color: tab === t.id ? '#FFD700' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t.id ? '2px solid #FFD700' : '2px solid transparent',
            }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'rebirth' && <RebirthTab forceUpdate={() => forceUpdate((n) => n + 1)} />}
      {tab === 'reincarnation' && showReincarnation && <ReincarnationTab forceUpdate={() => forceUpdate((n) => n + 1)} />}
      {tab === 'transcendence' && showTranscendence && <TranscendenceTab forceUpdate={() => forceUpdate((n) => n + 1)} />}
    </div>
  );
}

function RebirthTab({ forceUpdate }: { forceUpdate: () => void }) {
  const prestige = engine.prestige;
  const progress = prestige.getRebirthProgress();
  const totalMult = prestige.getTotalMultiplier();
  const canRebirth = prestige.canRebirth();
  const currentTierData = prestige.currentTier < REBIRTH_TIERS.length ? REBIRTH_TIERS[prestige.currentTier] : null;
  const prevTierData = prestige.currentTier > 0 ? REBIRTH_TIERS[prestige.currentTier - 1] : null;

  function handleRebirth() {
    engine.performRebirth();
    forceUpdate();
  }

  return (
    <div>
      {/* Current tier */}
      <div className="mb-4 p-3 rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono font-bold text-[#FFD700]">
            Tier {prestige.currentTier} — {prevTierData?.title ?? 'Uninitiated'}
          </span>
          <span className="text-[9px] font-mono text-white/40">
            x{totalMult.toFixed(2)} multiplier
          </span>
        </div>
        <div className="text-[9px] font-mono text-white/40">
          Total Rebirths: {prestige.totalRebirths} | Lifetime BP: {formatNumber(prestige.lifetimeBP)}
        </div>
      </div>

      {/* Next tier progress */}
      {currentTierData && (
        <div className="mb-4">
          <div className="flex justify-between text-[9px] font-mono text-white/40 mb-1">
            <span>Next: {currentTierData.name} (x{currentTierData.multiplier})</span>
            <span>{formatNumber(prestige.lifetimeBP)} / {formatNumber(currentTierData.bpRequired)}</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 bg-[#FFD700]"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-1">
            Perks: {currentTierData.perks.join(', ')}
          </div>
        </div>
      )}

      {/* Rebirth button */}
      <button
        className="w-full px-3 py-2.5 rounded text-xs font-mono font-bold transition-all mb-4"
        style={{
          backgroundColor: canRebirth.can ? '#FFD70020' : 'rgba(255,255,255,0.05)',
          color: canRebirth.can ? '#FFD700' : 'rgba(255,255,255,0.2)',
          border: canRebirth.can ? '1px solid #FFD70030' : '1px solid transparent',
          cursor: canRebirth.can ? 'pointer' : 'not-allowed',
        }}
        disabled={!canRebirth.can}
        onClick={handleRebirth}
      >
        {canRebirth.can ? '⚡ Perform Rebirth (resets progress!)' : canRebirth.reason ?? 'Cannot rebirth'}
      </button>

      {/* Unlocked perks */}
      {prestige.unlockedPerks.size > 0 && (
        <div>
          <h3 className="text-xs font-mono text-white/60 font-bold mb-2">Unlocked Perks</h3>
          <div className="flex flex-wrap gap-1">
            {[...prestige.unlockedPerks].map((perk) => (
              <span key={perk} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFD700]/10 text-[#FFD700]/70">
                {perk.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tier overview */}
      <div className="mt-4">
        <h3 className="text-xs font-mono text-white/60 font-bold mb-2">All Tiers</h3>
        <div className="flex flex-col gap-1">
          {REBIRTH_TIERS.map((tier) => {
            const reached = prestige.currentTier >= tier.tier;
            return (
              <div
                key={tier.tier}
                className="flex items-center gap-2 text-[9px] font-mono"
                style={{ opacity: reached ? 1 : 0.4 }}
              >
                <span className={reached ? 'text-[#FFD700]' : 'text-white/50'}>
                  {reached ? '✦' : '○'}
                </span>
                <span className="text-white/60 w-8">T{tier.tier}</span>
                <span className="text-white/50 flex-1">{tier.name}</span>
                <span className="text-white/50">x{tier.multiplier}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReincarnationTab({ forceUpdate }: { forceUpdate: () => void }) {
  const prestige = engine.prestige;
  const canReincarnate = prestige.canReincarnate();
  const karmaPreview = prestige.calculateKarmaEarned();
  const reincMult = prestige.getReincarnationMultiplier();

  function handleReincarnate() {
    engine.performReincarnation();
    forceUpdate();
  }

  function handlePurchase(itemId: string) {
    engine.purchaseKarma(itemId);
    forceUpdate();
  }

  return (
    <div>
      {/* Karma info */}
      <div className="mb-4 p-3 rounded-lg border border-[#9370DB]/20 bg-[#9370DB]/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono font-bold text-[#9370DB]">
            Karma Points: {prestige.karmaPoints}
          </span>
          <span className="text-[9px] font-mono text-white/40">
            x{reincMult.toFixed(1)} multiplier
          </span>
        </div>
        <div className="text-[9px] font-mono text-white/40">
          Reincarnations: {prestige.reincarnationCount} | Would earn: +{karmaPreview} karma
        </div>
      </div>

      {/* Reincarnate button */}
      <button
        className="w-full px-3 py-2.5 rounded text-xs font-mono font-bold transition-all mb-4"
        style={{
          backgroundColor: canReincarnate.can ? '#9370DB20' : 'rgba(255,255,255,0.05)',
          color: canReincarnate.can ? '#9370DB' : 'rgba(255,255,255,0.2)',
          border: canReincarnate.can ? '1px solid #9370DB30' : '1px solid transparent',
          cursor: canReincarnate.can ? 'pointer' : 'not-allowed',
        }}
        disabled={!canReincarnate.can}
        onClick={handleReincarnate}
      >
        {canReincarnate.can ? `🌀 Reincarnate (+${karmaPreview} Karma)` : canReincarnate.reason ?? 'Cannot reincarnate'}
      </button>

      {/* Karma Shop */}
      <h3 className="text-xs font-mono text-white/60 font-bold mb-2">Karma Shop</h3>
      <div className="flex flex-col gap-2">
        {KARMA_SHOP.map((item) => {
          const purchased = prestige.karmaShopPurchases[item.id] ?? 0;
          const maxed = purchased >= item.maxPurchases;
          const canBuy = prestige.canPurchaseKarma(item.id);

          return (
            <div key={item.id} className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-mono font-bold text-white/80">{item.name}</span>
                <span className="text-[10px] font-mono text-white/50">
                  {purchased}/{item.maxPurchases}
                </span>
              </div>
              <div className="text-[9px] font-mono text-white/40 mb-1.5">{item.description}</div>
              {!maxed && (
                <button
                  className="px-2 py-1 rounded text-[9px] font-mono font-bold transition-all"
                  style={{
                    backgroundColor: canBuy ? '#9370DB20' : 'rgba(255,255,255,0.05)',
                    color: canBuy ? '#9370DB' : 'rgba(255,255,255,0.2)',
                    cursor: canBuy ? 'pointer' : 'not-allowed',
                  }}
                  disabled={!canBuy}
                  onClick={() => handlePurchase(item.id)}
                >
                  {item.cost} Karma
                </button>
              )}
              {maxed && (
                <span className="text-[10px] font-mono text-[#FFD700]/60">✦ Maxed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TranscendenceTab({ forceUpdate }: { forceUpdate: () => void }) {
  const prestige = engine.prestige;
  const canTranscend = prestige.canTranscend();
  const transMult = prestige.getTranscendenceMultiplier();

  function handleTranscend() {
    engine.performTranscendence();
    forceUpdate();
  }

  return (
    <div>
      {/* Info */}
      <div className="mb-4 p-3 rounded-lg border border-[#FFFFFF]/10 bg-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono font-bold text-white">
            Transcendence Points: {prestige.transcendencePoints}
          </span>
          <span className="text-[9px] font-mono text-white/40">
            x{transMult.toFixed(2)} multiplier
          </span>
        </div>
        <div className="text-[9px] font-mono text-white/40">
          Total Transcendences: {prestige.transcendenceCount}
        </div>
      </div>

      {/* Transcend button */}
      <button
        className="w-full px-3 py-2.5 rounded text-xs font-mono font-bold transition-all mb-4"
        style={{
          backgroundColor: canTranscend.can ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
          color: canTranscend.can ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
          border: canTranscend.can ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
          cursor: canTranscend.can ? 'pointer' : 'not-allowed',
        }}
        disabled={!canTranscend.can}
        onClick={handleTranscend}
      >
        {canTranscend.can ? '🌟 Transcend (near-total reset!)' : canTranscend.reason ?? 'Cannot transcend'}
      </button>

      {/* Celestial Bonuses */}
      <h3 className="text-xs font-mono text-white/60 font-bold mb-2">Celestial Bonuses</h3>
      <div className="flex flex-col gap-2">
        {CELESTIAL_BONUSES.map((bonus) => {
          const unlocked = prestige.transcendencePoints >= bonus.minPoints;
          return (
            <div
              key={bonus.name}
              className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]"
              style={{ opacity: unlocked ? 1 : 0.4 }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-mono font-bold" style={{ color: unlocked ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                  {unlocked ? '✦' : '○'} {bonus.name}
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  {bonus.minPoints} pts
                </span>
              </div>
              <div className="text-[9px] font-mono text-white/40">{bonus.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
