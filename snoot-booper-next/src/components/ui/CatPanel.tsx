/**
 * CatPanel — Sanctuary Roster (wuxia reskin).
 * Reads from cat-store + game-store; calls engine.recruitCat / cat.getXPToLevel.
 */

'use client';

import { useState, useEffect } from 'react';
import { useCatStore } from '@/store/cat-store';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import {
  CAT_REALMS, REALM_ORDER, CAT_ELEMENTS, CAT_PERSONALITIES, RECRUITMENT_COSTS,
} from '@/engine/data/cats';
import { TRAITS, type TraitId } from '@/engine/data/traits';
import type { Cat, CatRealmId, ElementType } from '@/engine/types';

const ELEMENT_GLYPHS: Record<ElementType, string> = {
  metal: '金', wood: '木', water: '水', fire: '火',
  earth: '土', void: '玄', chaos: '亂',
};

export default function CatPanel() {
  const cats = useCatStore((s) => s.cats);
  const selectedCatId = useCatStore((s) => s.selectedCatId);
  const selectCat = useCatStore((s) => s.selectCat);
  const bp = useGameStore((s) => s.currencies.bp);
  const [recruitRealm, setRecruitRealm] = useState<CatRealmId>('kittenMortal');
  const [flashId, setFlashId] = useState<string | null>(null);

  // React to barks from BarkToast — flash the targeted cat row.
  useEffect(() => {
    function onBark(e: Event) {
      const detail = (e as CustomEvent<{ catInstanceId: string }>).detail;
      if (!detail?.catInstanceId) return;
      setFlashId(detail.catInstanceId);
      const t = setTimeout(() => setFlashId((id) => (id === detail.catInstanceId ? null : id)), 480);
      return () => clearTimeout(t);
    }
    window.addEventListener('snoot:bark', onBark);
    return () => window.removeEventListener('snoot:bark', onBark);
  }, []);

  const selectedCat = selectedCatId ? cats.find((c) => c.instanceId === selectedCatId) : null;
  const cost = RECRUITMENT_COSTS[recruitRealm];
  const capacity = engine.getCatCapacity();
  const hasCapacity = cats.length < capacity;
  const canRecruit = bp >= cost && hasCapacity;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="glyph-badge" style={{ color: 'var(--gold-bright)', width: 38, height: 38 }}>
            <span style={{ fontSize: 16 }}>貓</span>
          </div>
          <div>
            <div className="h-section">Sanctuary Roster</div>
            <div className="h-eyebrow">{cats.length} / {capacity} disciples cultivate within</div>
          </div>
        </div>
      </div>

      {/* Recruitment */}
      <div className="panel p-4 mb-5" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="h-eyebrow mb-3">Recruit a wandering cat</div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {REALM_ORDER.slice(0, 5).map((realmId) => {
            const realm = CAT_REALMS[realmId];
            const active = recruitRealm === realmId;
            return (
              <button
                key={realmId}
                onClick={() => setRecruitRealm(realmId)}
                className="px-3 py-1.5 font-display text-[10px] tracking-[0.16em] uppercase transition-all cursor-pointer"
                style={{
                  background: active ? `${realm.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? realm.color : 'var(--rule)'}`,
                  color: active ? realm.color : 'var(--ink-mute)',
                  borderRadius: 1,
                }}
              >
                {realm.emoji ? `${realm.emoji} ` : ''}{realm.name}
              </button>
            );
          })}
        </div>
        <button
          className={`btn w-full ${canRecruit ? 'btn-primary' : ''}`}
          onClick={() => engine.recruitCat(recruitRealm)}
          disabled={!canRecruit}
        >
          {hasCapacity ? `Recruit - ${formatNumber(cost)} bp` : `Sanctuary full - ${cats.length}/${capacity}`}
        </button>
      </div>

      {/* Roster grid */}
      {cats.length === 0 ? (
        <p className="text-center py-12 italic" style={{ color: 'var(--ink-dim)' }}>
          The sanctuary halls are empty. Recruit your first feline disciple.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cats.map((cat) => (
            <CatCard
              key={cat.instanceId}
              cat={cat}
              selected={selectedCatId === cat.instanceId}
              flash={flashId === cat.instanceId}
              onClick={() => selectCat(selectedCatId === cat.instanceId ? null : cat.instanceId)}
            />
          ))}
        </div>
      )}

      {/* Selected cat detail */}
      {selectedCat && (
        <div className="mt-5">
          <CatDetail cat={selectedCat} />
        </div>
      )}
    </div>
  );
}

// ─── Cat Card ──────────────────────────────────────────────

function CatCard({
  cat, selected, flash, onClick,
}: {
  cat: Cat; selected: boolean; flash: boolean; onClick: () => void;
}) {
  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const traits = (cat.traits ?? []) as TraitId[];

  return (
    <button
      onClick={onClick}
      className={`panel card-row relative p-3 text-left ${selected ? 'selected-ring' : ''} ${flash ? 'cat-flash' : ''}`}
      style={{
        borderColor: selected ? 'var(--jade-bright)' : `${realm.color}55`,
        background: 'rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Portrait rune */}
        <div
          className="rune flex-shrink-0"
          style={{
            width: 56, height: 56, fontSize: 24,
            background: `radial-gradient(circle at 35% 30%, ${element.color}55, ${element.color}22 60%, rgba(0,0,0,0.4))`,
            border: `1px solid ${element.color}88`,
            color: '#fff7df',
            textShadow: `0 0 10px ${element.color}cc`,
          }}
        >
          {ELEMENT_GLYPHS[cat.element]}
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[13px] font-bold tracking-[0.06em] truncate" style={{ color: '#fff7df' }}>
              {cat.name}
            </span>
            {cat.legendary && (
              <span className="font-display text-[10px]" style={{ color: 'var(--gold-bright)' }}>★</span>
            )}
          </div>
          <div className="h-eyebrow mt-0.5 flex flex-wrap gap-x-2">
            <span style={{ color: realm.color }}>{realm.name}</span>
            <span style={{ color: element.color }}>{element.name}</span>
            <span>{CAT_PERSONALITIES[cat.personality]?.name}</span>
          </div>

          {/* Traits */}
          {traits.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {traits.map((id) => {
                const t = TRAITS[id];
                if (!t) return null;
                return (
                  <span
                    key={id}
                    className="trait-chip"
                    style={{ color: t.color, borderColor: `${t.color}66`, background: `${t.color}14` }}
                    title={t.description}
                  >
                    {t.glyph} {t.name}
                  </span>
                );
              })}
            </div>
          )}

          {/* Stars + happiness */}
          <div className="flex items-center gap-3 mt-2">
            <span className="font-mono text-[10px]" style={{ color: 'var(--gold-bright)' }}>
              {'★'.repeat(cat.stars)}{'☆'.repeat(6 - cat.stars)}
            </span>
            <div className="meter flex-1">
              <div
                className={`meter-fill ${cat.happiness > 70 ? 'jade' : cat.happiness > 30 ? '' : 'crimson'}`}
                style={{ width: `${Math.max(2, cat.happiness)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Cat Detail ─────────────────────────────────────────────

function CatDetail({ cat }: { cat: Cat }) {
  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const personality = CAT_PERSONALITIES[cat.personality];
  const xpNeeded = engine.cat.getXPToLevel(cat);
  const xpPct = Math.min(100, (cat.cultivationXP / xpNeeded) * 100);

  return (
    <div className="panel panel-ornate p-5" style={{ borderColor: `${realm.color}88` }}>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="rune"
          style={{
            width: 64, height: 64, fontSize: 28,
            background: `radial-gradient(circle at 35% 30%, ${element.color}55, ${element.color}22 60%, rgba(0,0,0,0.4))`,
            border: `1px solid ${element.color}88`,
            color: '#fff7df',
            textShadow: `0 0 12px ${element.color}cc`,
          }}
        >
          {ELEMENT_GLYPHS[cat.element]}
        </div>
        <div className="flex-1">
          <div className="font-display text-[18px] font-black tracking-[0.06em]" style={{ color: '#fff7df' }}>
            {cat.name}{cat.legendary && <span className="ml-2 text-[12px]" style={{ color: 'var(--gold-bright)' }}>★ LEGENDARY</span>}
          </div>
          <div className="h-eyebrow">
            <span style={{ color: realm.color }}>{realm.name}</span> ·{' '}
            <span style={{ color: element.color }}>{element.name}</span> ·{' '}
            <span>{personality?.name}</span>
          </div>
        </div>
      </div>

      <p className="text-sm mb-4 italic" style={{ color: 'var(--ink-mute)' }}>
        {cat.description}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <StatRow label="Snoot" value={cat.stats.snootMeridians} hue="var(--vermillion)" />
        <StatRow label="Purr"  value={cat.stats.innerPurr}      hue="var(--gold)" />
        <StatRow label="Floof" value={cat.stats.floofArmor}     hue="#76b6d4" />
        <StatRow label="Zoom"  value={cat.stats.zoomieSteps}    hue="var(--jade)" />
        <StatRow label="Loaf"  value={cat.stats.loafMastery}    hue="#8a7cc0" />
      </div>

      {/* XP */}
      <div className="mb-3">
        <div className="flex justify-between h-eyebrow mb-1">
          <span>Cultivation · Level {cat.level}</span>
          <span>{formatNumber(cat.cultivationXP)} / {formatNumber(xpNeeded)}</span>
        </div>
        <div className="meter">
          <div className="meter-fill jade" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Stars + happiness */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-eyebrow mb-1">Awakening</div>
          <div className="font-display text-[14px]" style={{ color: 'var(--gold-bright)' }}>
            {'★'.repeat(cat.stars)}{'☆'.repeat(6 - cat.stars)}
            {cat.stars >= 6 && <span className="ml-2 text-[10px]" style={{ color: '#FF69B4' }}>AWAKENED</span>}
          </div>
        </div>
        <div>
          <div className="h-eyebrow mb-1">Happiness</div>
          <div className="meter">
            <div
              className={`meter-fill ${cat.happiness > 70 ? 'jade' : cat.happiness > 30 ? '' : 'crimson'}`}
              style={{ width: `${cat.happiness}%` }}
            />
          </div>
          <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--ink-mute)' }}>
            {Math.round(cat.happiness)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, hue }: { label: string; value: number; hue: string }) {
  const pct = Math.min(100, (value / 10) * 100);
  return (
    <div>
      <div className="flex justify-between h-eyebrow mb-0.5">
        <span>{label}</span>
        <span style={{ color: 'var(--ink-mute)' }}>{value.toFixed(1)}</span>
      </div>
      <div className="meter">
        <div className="meter-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${hue}88, ${hue})` }} />
      </div>
    </div>
  );
}
