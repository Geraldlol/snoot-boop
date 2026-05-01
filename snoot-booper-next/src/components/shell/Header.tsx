'use client';

import { useGameStore } from '@/store/game-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { starterArt } from '@/lib/art-assets';
import ResourceChip from './ResourceChip';

/**
 * Sticky HUD top bar: sect crest, title, and resource chips.
 * Reads currencies from game-store, derived rates/counts from engine.
 */
export default function Header() {
  const currencies = useGameStore((s) => s.currencies);
  const ascensions = engine.prestige.totalRebirths;
  const passiveBpPerSec = engine.upgrade.getCombinedEffects().passiveBpPerSecond;
  const ppPerSec = engine.cat.calculatePPPerSecond(engine.getModifiers());

  return (
    <div className="hud-top sticky top-0 z-30 relative">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[76px] md:h-[84px] flex items-center gap-3 md:gap-4 overflow-hidden">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div
            className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
            style={{
              backgroundImage:
                `radial-gradient(circle at 35% 30%, rgba(255,225,170,0.54), rgba(120,80,30,0.44) 60%, rgba(0,0,0,0.36)), url("${starterArt.ui.goldBadge}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              border: '1px solid var(--gold)',
              boxShadow:
                '0 0 24px rgba(230,194,117,0.5), inset 0 1px 0 rgba(255,225,170,0.4)',
              borderRadius: 2,
            }}
            aria-hidden
          >
            <span
              className="font-display text-xl font-black"
              style={{ color: '#fff7df', textShadow: '0 0 14px rgba(255,225,170,0.7)' }}
            >
              SB
            </span>
          </div>
          <div className="leading-tight">
            <div
              className="font-display text-[18px] md:text-[22px] font-black gold-text leading-none whitespace-nowrap"
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

        <div className="ml-auto flex min-w-0 items-center gap-4 overflow-x-auto overflow-y-hidden py-2">
          <ResourceChip
            imageSrc={starterArt.icons.boopCoin}
            imageAlt="Boop coin"
            label="Boop"
            value={formatNumber(currencies.bp)}
            sub={`+${formatNumber(passiveBpPerSec)}/s`}
            tone="var(--gold-bright)"
          />
          <ResourceChip
            imageSrc={starterArt.icons.pawSpirit}
            imageAlt="Purr token"
            label="Purr"
            value={formatNumber(currencies.pp)}
            sub={`+${formatNumber(ppPerSec)}/s`}
            tone="var(--jade-bright)"
          />
          <ResourceChip
            imageSrc={starterArt.icons.qiOrb}
            imageAlt="Spirit orb"
            label="Stones"
            value={formatNumber(currencies.spiritStones)}
            sub="dungeon"
            tone="var(--vermillion-bright)"
          />
          <ResourceChip
            imageSrc={starterArt.icons.talisman}
            imageAlt="Heavenly seal"
            label="Seals"
            value={formatNumber(currencies.heavenlySeals)}
            sub={`asc x${ascensions}`}
            tone="#d3b8ff"
          />
          <ResourceChip
            imageSrc={starterArt.icons.tournamentMedallion}
            imageAlt="Sect honor medallion"
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
