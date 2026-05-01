'use client';

import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import ResourceChip from './ResourceChip';

/**
 * Sticky HUD top bar — sect crest + title + 5 resource chips.
 * Reads currencies from game-store, derived rates/counts from engine.
 */
export default function Header() {
  const currencies = useGameStore((s) => s.currencies);
  const ascensions = engine.prestige.totalRebirths;
  const passiveBpPerSec = engine.upgrade.getCombinedEffects().passiveBpPerSecond;
  const ppPerSec = engine.cat.calculatePPPerSecond(engine.getModifiers());

  return (
    <div className="hud-top sticky top-0 z-30 relative">
      <div className="max-w-[1600px] mx-auto px-8 h-[84px] flex items-center gap-4 overflow-hidden">
        {/* Sect crest + title */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            className="relative w-14 h-14 flex items-center justify-center"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255,225,170,0.5), rgba(120,80,30,0.6) 60%, rgba(0,0,0,0.4))',
              border: '1px solid var(--gold)',
              boxShadow:
                '0 0 24px rgba(230,194,117,0.5), inset 0 1px 0 rgba(255,225,170,0.4)',
              borderRadius: 2,
            }}
          >
            <span
              className="font-display text-3xl font-black"
              style={{ color: '#fff7df', textShadow: '0 0 14px rgba(255,225,170,0.7)' }}
            >
              鼻
            </span>
          </div>
          <div className="leading-tight">
            <div
              className="font-display text-[22px] font-black gold-text leading-none whitespace-nowrap"
              style={{ letterSpacing: '0.20em' }}
            >
              SNOOT BOOPER
            </div>
            <div className="h-eyebrow hidden sm:flex items-center gap-2 whitespace-nowrap">
              <span>Sect of the Sleeping Loaf</span>
              <span className="diamond" />
              <span>Chapter {ascensions + 1}</span>
            </div>
          </div>
        </div>

        {/* Resource chips */}
        <div className="ml-auto flex min-w-0 items-center gap-4 overflow-x-auto overflow-y-hidden py-2">
        <ResourceChip
          glyph="鼻"
          label="Boop"
          value={formatNumber(currencies.bp)}
          sub={`+${formatNumber(passiveBpPerSec)}/s`}
          tone="var(--gold-bright)"
        />
        <ResourceChip
          glyph="鳴"
          label="Purr"
          value={formatNumber(currencies.pp)}
          sub={`+${formatNumber(ppPerSec)}/s`}
          tone="var(--jade-bright)"
        />
        <ResourceChip
          glyph="玉"
          label="Stones"
          value={formatNumber(currencies.spiritStones)}
          sub="dungeon"
          tone="var(--vermillion-bright)"
        />
        <ResourceChip
          glyph="道"
          label="Seals"
          value={formatNumber(currencies.heavenlySeals)}
          sub={`asc ×${ascensions}`}
          tone="#d3b8ff"
        />
        <ResourceChip
          glyph="譽"
          label="Honor"
          value={formatNumber(currencies.sectReputation)}
          sub={`${formatNumber(currencies.destinyThreads)} threads`}
          tone="#ffd6a3"
        />
        </div>
      </div>
    </div>
  );
}
