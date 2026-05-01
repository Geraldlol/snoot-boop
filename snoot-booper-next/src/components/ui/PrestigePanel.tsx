/**
 * PrestigePanel — Dao Tree (wuxia reskin).
 * Three tabs: Rebirth / Reincarnation / Transcendence.
 * Reincarnation is also accessible as its own panel (panelId 'reincarnation')
 * which routes here pre-selected on the reincarnation tab via the tabHint prop.
 */

'use client';

import { formatNumber } from '@/engine/big-number';
import { engine } from '@/engine/engine';
import { REBIRTH_TIERS, KARMA_SHOP, CELESTIAL_BONUSES } from '@/engine/systems/progression/prestige-system';
import { useState } from 'react';

type Tab = 'rebirth' | 'reincarnation' | 'transcendence';

export default function PrestigePanel({ tabHint }: { tabHint?: Tab } = {}) {
  const [tab, setTab] = useState<Tab>(tabHint ?? 'rebirth');
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);

  const prestige = engine.prestige;
  const showReinc = prestige.currentTier >= 7 || prestige.reincarnationCount > 0;
  const showTrans = prestige.reincarnationCount >= 5 || prestige.transcendenceCount > 0;
  const previewReinc = tabHint === 'reincarnation' || tab === 'reincarnation';

  const tabs: { id: Tab; label: string; visible: boolean; color: string }[] = [
    { id: 'rebirth',       label: 'Rebirth',       visible: true,       color: 'var(--gold-bright)' },
    { id: 'reincarnation', label: 'Reincarnation', visible: showReinc || previewReinc, color: '#9370DB' },
    { id: 'transcendence', label: 'Transcendence', visible: showTrans,  color: '#fff7df' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
          <span style={{ fontSize: 16 }}>道</span>
        </div>
        <div>
          <div className="h-section">Dao Tree</div>
          <div className="h-eyebrow">The infinite paths of ascension</div>
        </div>
      </div>

      <div className="flex gap-0 mb-5 border-b" style={{ borderColor: 'var(--rule)' }}>
        {tabs.filter((t) => t.visible).map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="font-display text-[11px] tracking-[0.16em] uppercase px-4 py-2 cursor-pointer"
              style={{
                color: active ? t.color : 'var(--ink-mute)',
                borderBottom: `2px solid ${active ? t.color : 'transparent'}`,
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'rebirth' && <Rebirth refresh={refresh} />}
      {tab === 'reincarnation' && <Reincarnation refresh={refresh} locked={!showReinc} />}
      {tab === 'transcendence' && showTrans && <Transcendence refresh={refresh} />}
    </div>
  );
}

// ─── Rebirth ───────────────────────────────────────────────

function Rebirth({ refresh }: { refresh: () => void }) {
  const prestige = engine.prestige;
  const progress = prestige.getRebirthProgress();
  const totalMult = prestige.getTotalMultiplier();
  const canRebirth = prestige.canRebirth();
  const nextTier = prestige.currentTier < REBIRTH_TIERS.length ? REBIRTH_TIERS[prestige.currentTier] : null;
  const prevTier = prestige.currentTier > 0 ? REBIRTH_TIERS[prestige.currentTier - 1] : null;

  function go() {
    engine.performRebirth();
    window.dispatchEvent(new CustomEvent('snoot:ascend', { detail: { title: 'Reborn', subtitle: 'tier ascended' } }));
    refresh();
  }

  return (
    <div>
      {/* Hero card */}
      <div className="panel panel-ornate panel-elite p-5 mb-4 relative" style={{ borderColor: 'var(--gold)' }}>
        <div className="flex items-start gap-4 mb-3">
          <div
            className="rune"
            style={{
              width: 64, height: 64, fontSize: 30,
              background: 'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.6), rgba(120,80,30,0.5) 60%, rgba(0,0,0,0.4))',
              border: '1px solid var(--gold)',
              color: '#fff7df',
              textShadow: '0 0 16px rgba(255,225,170,0.8)',
            }}
          >
            輪
          </div>
          <div className="flex-1">
            <div className="font-display text-[18px] font-black tracking-[0.08em] gold-text">
              Tier {prestige.currentTier} · {prevTier?.title ?? 'Uninitiated'}
            </div>
            <div className="h-eyebrow mt-1">×{totalMult.toFixed(2)} multiplier · {prestige.totalRebirths} rebirths</div>
            <div className="h-eyebrow">lifetime bp · {formatNumber(prestige.lifetimeBP)}</div>
          </div>
        </div>

        {nextTier && (
          <>
            <div className="flex justify-between h-eyebrow mb-1">
              <span>Next · {nextTier.name} (×{nextTier.multiplier})</span>
              <span>{formatNumber(prestige.lifetimeBP)} / {formatNumber(nextTier.bpRequired)}</span>
            </div>
            <div className="meter mb-3">
              <div className="meter-fill" style={{ width: `${Math.min(100, progress * 100)}%` }} />
            </div>
            <div className="text-xs italic mb-3" style={{ color: 'var(--ink-mute)' }}>
              perks unlock: {nextTier.perks.join(' · ')}
            </div>
          </>
        )}

        <button
          className={`btn ascend-btn ${canRebirth.can ? 'ready' : ''} w-full`}
          disabled={!canRebirth.can}
          onClick={go}
        >
          {canRebirth.can ? '⚡ Perform Rebirth · resets progress' : canRebirth.reason ?? 'Cannot rebirth'}
        </button>
      </div>

      {/* Unlocked perks */}
      {prestige.unlockedPerks.size > 0 && (
        <div className="mb-4">
          <div className="h-section mb-2 text-left" style={{ fontSize: 11 }}>Unlocked Perks</div>
          <div className="flex flex-wrap gap-1.5">
            {[...prestige.unlockedPerks].map((perk) => (
              <span key={perk} className="trait-chip">
                {perk.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tier ladder */}
      <div className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-2">All Tiers</div>
        <div className="flex flex-col gap-0.5">
          {REBIRTH_TIERS.map((tier) => {
            const reached = prestige.currentTier >= tier.tier;
            return (
              <div
                key={tier.tier}
                className="flex items-center gap-3 font-mono text-[11px] py-0.5"
                style={{ opacity: reached ? 1 : 0.45 }}
              >
                <span style={{ color: reached ? 'var(--gold-bright)' : 'var(--ink-dim)' }}>
                  {reached ? '✦' : '○'}
                </span>
                <span style={{ color: 'var(--ink-dim)', minWidth: 28 }}>T{tier.tier}</span>
                <span className="flex-1" style={{ color: reached ? 'var(--ink)' : 'var(--ink-mute)' }}>{tier.name}</span>
                <span style={{ color: 'var(--ink-mute)' }}>×{tier.multiplier}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reincarnation ─────────────────────────────────────────

function Reincarnation({ refresh, locked }: { refresh: () => void; locked?: boolean }) {
  const prestige = engine.prestige;
  const canRein = prestige.canReincarnate();
  const karmaPreview = prestige.calculateKarmaEarned();
  const reincMult = prestige.getReincarnationMultiplier();

  function reincarnate() {
    engine.performReincarnation();
    window.dispatchEvent(new CustomEvent('snoot:ascend', { detail: { title: 'Reincarnated', subtitle: 'the wheel turns' } }));
    refresh();
  }

  return (
    <div>
      {locked && (
        <div className="panel p-3 mb-4" style={{ background: 'rgba(147,112,219,0.10)', borderColor: '#9370DB66' }}>
          <div className="font-display text-[12px] tracking-[0.08em] mb-1" style={{ color: '#C4A7E7' }}>
            Reincarnation Path Locked
          </div>
          <p className="text-xs" style={{ color: 'var(--ink-mute)' }}>
            Reach Rebirth Tier 7 to open the karma cycle. This tab stays visible here as a preview of the next long-term loop.
          </p>
        </div>
      )}

      <div className="panel panel-ornate p-5 mb-4" style={{ borderColor: '#9370DB' }}>
        <div className="flex items-start gap-4 mb-3">
          <div
            className="rune"
            style={{
              width: 64, height: 64, fontSize: 30,
              background: 'radial-gradient(circle at 35% 30%, rgba(147,112,219,0.6), rgba(72,61,139,0.5) 60%, rgba(0,0,0,0.4))',
              border: '1px solid #9370DB',
              color: '#fff7df',
              textShadow: '0 0 14px rgba(147,112,219,0.8)',
            }}
          >
            輪
          </div>
          <div className="flex-1">
            <div className="font-display text-[18px] font-black tracking-[0.08em]" style={{ color: '#9370DB' }}>
              Karma · {prestige.karmaPoints}
            </div>
            <div className="h-eyebrow mt-1">×{reincMult.toFixed(1)} multiplier · {prestige.reincarnationCount} reincarnations</div>
            <div className="h-eyebrow">would earn +{karmaPreview} karma</div>
          </div>
        </div>

        <button
          className={`btn ascend-btn ${canRein.can ? 'ready' : ''} w-full`}
          style={canRein.can ? { borderColor: '#9370DB', background: 'linear-gradient(180deg, rgba(147,112,219,0.45), rgba(72,61,139,0.32))' } : undefined}
          disabled={!canRein.can}
          onClick={reincarnate}
        >
          {canRein.can ? `🌀 Reincarnate · +${karmaPreview} Karma` : canRein.reason ?? 'Cannot reincarnate'}
        </button>
      </div>

      <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Karma Shop</div>
      <div className="flex flex-col gap-2">
        {KARMA_SHOP.map((item) => {
          const purchased = prestige.karmaShopPurchases[item.id] ?? 0;
          const maxed = purchased >= item.maxPurchases;
          const canBuy = prestige.canPurchaseKarma(item.id);
          return (
            <div key={item.id} className="panel p-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: '#fff7df' }}>{item.name}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--ink-mute)' }}>{purchased}/{item.maxPurchases}</span>
              </div>
              <p className="text-xs mb-2" style={{ color: 'var(--ink-mute)' }}>{item.description}</p>
              {!maxed ? (
                <button
                  className="btn"
                  style={{ borderColor: '#9370DB66', color: '#9370DB' }}
                  disabled={!canBuy}
                  onClick={() => { engine.purchaseKarma(item.id); refresh(); }}
                >
                  {item.cost} karma
                </button>
              ) : (
                <span className="font-display text-[10px] tracking-[0.16em] uppercase" style={{ color: 'var(--gold-bright)' }}>✦ Mastered</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Transcendence ─────────────────────────────────────────

function Transcendence({ refresh }: { refresh: () => void }) {
  const prestige = engine.prestige;
  const canT = prestige.canTranscend();
  const tMult = prestige.getTranscendenceMultiplier();

  function go() {
    engine.performTranscendence();
    window.dispatchEvent(new CustomEvent('snoot:ascend', { detail: { title: 'Transcended', subtitle: 'beyond the heavens' } }));
    refresh();
  }

  return (
    <div>
      <div className="panel panel-ornate p-5 mb-4" style={{ borderColor: '#fff7df' }}>
        <div className="flex items-start gap-4 mb-3">
          <div
            className="rune"
            style={{
              width: 64, height: 64, fontSize: 30,
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), rgba(180,180,180,0.4) 60%, rgba(0,0,0,0.4))',
              border: '1px solid #fff7df',
              color: '#fff7df',
              textShadow: '0 0 18px rgba(255,255,255,0.9)',
            }}
          >
            天
          </div>
          <div className="flex-1">
            <div className="font-display text-[18px] font-black tracking-[0.08em]" style={{ color: '#fff7df' }}>
              Transcendence · {prestige.transcendencePoints}
            </div>
            <div className="h-eyebrow mt-1">×{tMult.toFixed(2)} multiplier · {prestige.transcendenceCount} transcendences</div>
          </div>
        </div>

        <button
          className={`btn ascend-btn ${canT.can ? 'ready' : ''} w-full`}
          disabled={!canT.can}
          onClick={go}
        >
          {canT.can ? '🌟 Transcend · near-total reset' : canT.reason ?? 'Cannot transcend'}
        </button>
      </div>

      <div className="h-section text-left mb-2" style={{ fontSize: 11 }}>Celestial Bonuses</div>
      <div className="flex flex-col gap-2">
        {CELESTIAL_BONUSES.map((bonus) => {
          const unlocked = prestige.transcendencePoints >= bonus.minPoints;
          return (
            <div
              key={bonus.name}
              className="panel p-3"
              style={{ background: 'rgba(0,0,0,0.3)', opacity: unlocked ? 1 : 0.45 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-[12px] tracking-[0.06em]" style={{ color: unlocked ? 'var(--gold-bright)' : 'var(--ink-mute)' }}>
                  {unlocked ? '✦' : '○'} {bonus.name}
                </span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--ink-dim)' }}>{bonus.minPoints} pts</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--ink-mute)' }}>{bonus.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
