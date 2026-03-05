/**
 * CatPanel - Cat collection view with recruitment, details, and management.
 */

'use client';

import { useState } from 'react';
import { useCatStore } from '@/store/cat-store';
import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { CAT_REALMS, REALM_ORDER, CAT_ELEMENTS, CAT_PERSONALITIES, STAR_BONUSES, RECRUITMENT_COSTS } from '@/engine/data/cats';
import type { Cat, CatRealmId } from '@/engine/types';

export default function CatPanel() {
  const cats = useCatStore((s) => s.cats);
  const selectedCatId = useCatStore((s) => s.selectedCatId);
  const selectCat = useCatStore((s) => s.selectCat);
  const bp = useGameStore((s) => s.currencies.bp);
  const [recruitRealm, setRecruitRealm] = useState<CatRealmId>('kittenMortal');

  const selectedCat = selectedCatId ? cats.find((c) => c.instanceId === selectedCatId) : null;

  const handleRecruit = () => {
    engine.recruitCat(recruitRealm);
  };

  const cost = RECRUITMENT_COSTS[recruitRealm];
  const canRecruit = bp >= cost;

  return (
    <div>
      <h2 className="text-sm font-mono text-[#FFD700] font-bold mb-3">
        Cat Sanctuary ({cats.length})
      </h2>

      {/* Recruitment */}
      <div className="mb-4 p-3 rounded border border-white/10 bg-black/20">
        <div className="text-[10px] font-mono text-white/50 mb-2">RECRUIT CAT</div>
        <div className="flex gap-2 mb-2 flex-wrap">
          {REALM_ORDER.slice(0, 5).map((realmId) => {
            const realm = CAT_REALMS[realmId];
            return (
              <button
                key={realmId}
                className="px-2 py-1 rounded text-[9px] font-mono cursor-pointer transition-all"
                style={{
                  backgroundColor: recruitRealm === realmId ? `${realm.color}30` : 'rgba(255,255,255,0.05)',
                  color: recruitRealm === realmId ? realm.color : 'rgba(255,255,255,0.4)',
                  borderBottom: recruitRealm === realmId ? `2px solid ${realm.color}` : '2px solid transparent',
                }}
                onClick={() => setRecruitRealm(realmId)}
              >
                {realm.emoji} {realm.name}
              </button>
            );
          })}
        </div>
        <button
          className={`w-full py-1.5 rounded text-[10px] font-mono font-bold transition-all ${
            canRecruit
              ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/30 cursor-pointer'
              : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
          onClick={handleRecruit}
          disabled={!canRecruit}
        >
          Recruit — {formatNumber(cost)} BP
        </button>
      </div>

      {/* Cat List */}
      <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto">
        {cats.length === 0 ? (
          <p className="text-[10px] text-white/30 font-mono text-center py-4">
            No cats yet. Recruit your first feline disciple!
          </p>
        ) : (
          cats.map((cat) => (
            <CatRow
              key={cat.instanceId}
              cat={cat}
              selected={selectedCatId === cat.instanceId}
              onClick={() => selectCat(selectedCatId === cat.instanceId ? null : cat.instanceId)}
            />
          ))
        )}
      </div>

      {/* Selected Cat Detail */}
      {selectedCat && <CatDetail cat={selectedCat} />}
    </div>
  );
}

// ─── Cat Row ─────────────────────────────────────────────────

function CatRow({ cat, selected, onClick }: { cat: Cat; selected: boolean; onClick: () => void }) {
  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const stars = '★'.repeat(cat.stars) + '☆'.repeat(6 - cat.stars);

  return (
    <button
      className="flex items-center gap-2 p-2 rounded border transition-all cursor-pointer text-left w-full"
      style={{
        borderColor: selected ? realm.color : 'rgba(255,255,255,0.05)',
        backgroundColor: selected ? `${realm.color}15` : 'rgba(0,0,0,0.2)',
      }}
      onClick={onClick}
    >
      <span className="text-sm">{cat.emoji ?? '🐱'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-bold text-white/90 truncate">{cat.name}</span>
          {cat.legendary && <span className="text-[8px] text-[#FFD700]">★</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono" style={{ color: realm.color }}>
            {realm.name}
          </span>
          <span className="text-[8px] font-mono" style={{ color: element?.color ?? '#888' }}>
            {element?.name ?? '?'}
          </span>
          <span className="text-[8px] font-mono text-[#FFD700]">{stars}</span>
        </div>
      </div>
      {/* Happiness bar */}
      <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${cat.happiness}%`,
            backgroundColor: cat.happiness > 70 ? '#50C878' : cat.happiness > 30 ? '#FFD700' : '#E94560',
          }}
        />
      </div>
    </button>
  );
}

// ─── Cat Detail ──────────────────────────────────────────────

function CatDetail({ cat }: { cat: Cat }) {
  const realm = CAT_REALMS[cat.realm];
  const element = CAT_ELEMENTS[cat.element];
  const personalityData = CAT_PERSONALITIES[cat.personality];
  const xpNeeded = engine.cat.getXPToLevel(cat);

  return (
    <div className="mt-4 p-3 rounded border border-white/10 bg-black/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{cat.emoji ?? '🐱'}</span>
        <div>
          <span className="text-xs font-mono font-bold text-white/90">{cat.name}</span>
          {cat.legendary && <span className="text-[9px] text-[#FFD700] ml-1">LEGENDARY</span>}
          <div className="text-[9px] font-mono text-white/40">
            {realm.name} · {element?.name} · {personalityData?.name}
          </div>
        </div>
      </div>

      <p className="text-[9px] font-mono text-white/50 mb-2">{cat.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1 mb-2">
        <StatBar label="Snoot" value={cat.stats.snootMeridians} color="#E94560" />
        <StatBar label="Purr" value={cat.stats.innerPurr} color="#FFD700" />
        <StatBar label="Floof" value={cat.stats.floofArmor} color="#4169E1" />
        <StatBar label="Zoom" value={cat.stats.zoomieSteps} color="#50C878" />
        <StatBar label="Loaf" value={cat.stats.loafMastery} color="#9370DB" />
      </div>

      {/* Cultivation */}
      <div className="text-[9px] font-mono text-white/40 mb-1">
        Level {cat.level} · XP {formatNumber(cat.cultivationXP)}/{formatNumber(xpNeeded)}
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-[#00BFFF] rounded-full transition-all"
          style={{ width: `${Math.min(100, (cat.cultivationXP / xpNeeded) * 100)}%` }}
        />
      </div>

      {/* Happiness */}
      <div className="text-[9px] font-mono text-white/40">
        Happiness: {Math.round(cat.happiness)}%
      </div>

      {/* Stars */}
      <div className="text-[9px] font-mono text-[#FFD700]">
        {'★'.repeat(cat.stars)}{'☆'.repeat(6 - cat.stars)}
        {cat.stars >= 6 && <span className="text-[#FF69B4] ml-1">AWAKENED</span>}
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxDisplay = 10;
  const percent = Math.min(100, (value / maxDisplay) * 100);

  return (
    <div className="flex items-center gap-1">
      <span className="text-[8px] font-mono text-white/40 w-8">{label}</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
      <span className="text-[8px] font-mono text-white/50 w-6 text-right">{value.toFixed(1)}</span>
    </div>
  );
}
