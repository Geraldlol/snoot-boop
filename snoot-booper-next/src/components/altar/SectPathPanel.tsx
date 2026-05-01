'use client';

import { useGameStore } from '@/store/game-store';
import { useCatStore } from '@/store/cat-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import { formatNumber } from '@/engine/big-number';
import { RECRUITMENT_COSTS } from '@/engine/data/cats';

interface SectGoal {
  id: string;
  title: string;
  detail: string;
  current: number;
  target: number;
  reward: string;
  actionLabel?: string;
  onAction?: () => void;
  complete: boolean;
}

function pct(goal: SectGoal): number {
  if (goal.complete) return 100;
  if (goal.target <= 0) return 0;
  return Math.max(0, Math.min(100, (goal.current / goal.target) * 100));
}

function progressText(goal: SectGoal): string {
  return `${formatNumber(Math.min(goal.current, goal.target))}/${formatNumber(goal.target)}`;
}

export default function SectPathPanel({ className = '' }: { className?: string }) {
  const bp = useGameStore((s) => s.currencies.bp);
  const pp = useGameStore((s) => s.currencies.pp);
  const stats = useGameStore((s) => s.stats);
  const cats = useCatStore((s) => s.cats);
  const openPanel = useUIStore((s) => s.openPanel);
  const setScreen = useUIStore((s) => s.setScreen);

  const capacity = engine.getCatCapacity();
  const kittenCost = RECRUITMENT_COSTS.kittenMortal;
  const canRecruit = bp >= kittenCost && cats.length < capacity;
  const gentlePalm = engine.upgrade.getLevel('gentle_palm');
  const qiCirculation = engine.upgrade.getLevel('qi_circulation');
  const ironFur = engine.upgrade.getLevel('iron_fur_body');
  const catPagoda = engine.upgrade.getLevel('cat_pagoda');
  const foundationLevels = gentlePalm + qiCirculation + ironFur + catPagoda;
  const pagodaRuns = engine.pagoda.stats.totalRuns;
  const highestFloor = engine.pagoda.highestFloor;

  const recruitKitten = () => {
    if (!canRecruit || !engine.recruitCat('kittenMortal')) {
      openPanel('cats');
    }
  };

  const buyGentlePalm = () => {
    if (!engine.purchaseUpgrade('gentle_palm')) {
      openPanel('upgrades');
    }
  };

  const openDungeon = () => {
    setScreen('dungeon');
  };

  const goals: SectGoal[] = [
    {
      id: 'first-boop',
      title: 'Wake the altar',
      detail: 'Begin the sect record with one clean boop.',
      current: stats.totalBoops,
      target: 1,
      reward: 'First Steps merit',
      complete: stats.totalBoops >= 1,
    },
    {
      id: 'recruit-fund',
      title: 'Gather recruit tribute',
      detail: 'Hold enough BP to invite the first wandering disciple.',
      current: bp,
      target: kittenCost,
      reward: 'Roster momentum',
      actionLabel: canRecruit ? 'Recruit disciple' : 'Open roster',
      onAction: canRecruit ? recruitKitten : () => openPanel('cats'),
      complete: cats.length > 0 || bp >= kittenCost,
    },
    {
      id: 'first-disciple',
      title: 'Recruit first disciple',
      detail: 'A cat turns idle purrs into steady PP.',
      current: cats.length,
      target: 1,
      reward: 'Cat Whisperer merit',
      actionLabel: canRecruit ? 'Recruit disciple' : 'Open roster',
      onAction: recruitKitten,
      complete: cats.length >= 1,
    },
    {
      id: 'gentle-palm',
      title: 'Refine Gentle Palm',
      detail: 'Turn raw boops into stronger baseline gains.',
      current: gentlePalm,
      target: 1,
      reward: '+0.5 BP per boop',
      actionLabel: bp >= engine.upgrade.getCost('gentle_palm') ? 'Refine now' : 'Open upgrades',
      onAction: buyGentlePalm,
      complete: gentlePalm >= 1,
    },
    {
      id: 'purr-engine',
      title: 'Start the purr engine',
      detail: 'Let disciples cultivate enough PP for the wider path.',
      current: pp,
      target: 25,
      reward: 'Stable idle rhythm',
      actionLabel: cats.length > 0 ? 'View roster' : undefined,
      onAction: cats.length > 0 ? () => openPanel('cats') : undefined,
      complete: pp >= 25,
    },
    {
      id: 'three-disciples',
      title: 'Form a small chorus',
      detail: 'Three disciples make the sanctuary feel alive.',
      current: cats.length,
      target: 3,
      reward: 'Better PP base',
      actionLabel: canRecruit ? 'Recruit disciple' : 'Open roster',
      onAction: canRecruit ? recruitKitten : () => openPanel('cats'),
      complete: cats.length >= 3,
    },
    {
      id: 'combo-ten',
      title: 'Land a ten-chain',
      detail: 'Keep the rhythm long enough to awaken combo rewards.',
      current: stats.maxCombo,
      target: 10,
      reward: 'Combo Starter merit',
      complete: stats.maxCombo >= 10,
    },
    {
      id: 'foundations',
      title: 'Raise four foundations',
      detail: 'Buy one level in each early cultivation branch.',
      current: foundationLevels,
      target: 4,
      reward: 'Balanced growth',
      actionLabel: 'Open upgrades',
      onAction: () => openPanel('upgrades'),
      complete: foundationLevels >= 4,
    },
    {
      id: 'first-pagoda',
      title: 'Enter the pagoda',
      detail: 'Test the sect in a real tribulation run.',
      current: pagodaRuns,
      target: 1,
      reward: 'Tokens and relic rolls',
      actionLabel: 'Enter pagoda',
      onAction: openDungeon,
      complete: pagodaRuns >= 1 || highestFloor >= 1,
    },
    {
      id: 'floor-three',
      title: 'Claim Floor 3',
      detail: 'Push far enough to make pagoda rewards matter.',
      current: highestFloor,
      target: 3,
      reward: 'Spirit stone cadence',
      actionLabel: 'Enter pagoda',
      onAction: openDungeon,
      complete: highestFloor >= 3,
    },
  ];

  const activeIndex = goals.findIndex((goal) => !goal.complete);
  const primary = activeIndex >= 0 ? goals[activeIndex] : goals[goals.length - 1];
  const routeStage = activeIndex >= 0 ? activeIndex : goals.length;
  const rowsStart = Math.max(0, (activeIndex < 0 ? goals.length - 1 : activeIndex) - 1);
  const rows = goals.slice(rowsStart, rowsStart + 5);
  const pathPercent = (routeStage / goals.length) * 100;

  return (
    <aside
      className={`pointer-events-auto panel sect-path-panel ${className}`}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      aria-label="Sect path"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="h-eyebrow">Sect Path</div>
          <div className="font-display text-[15px] font-black tracking-[0.06em]" style={{ color: '#fff7df' }}>
            First Whisker Route
          </div>
        </div>
        <div className="text-right">
          <div className="h-eyebrow">Stage</div>
          <div className="font-display nums text-[14px] font-bold" style={{ color: 'var(--gold-bright)' }}>
            {routeStage}/{goals.length}
          </div>
        </div>
      </div>

      <div className="meter mb-4" role="progressbar" aria-label="Sect path completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pathPercent)}>
        <div className="meter-fill jade" style={{ width: `${pathPercent}%` }} />
      </div>

      <div className="sect-path-focus mb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="h-eyebrow">{primary.complete ? 'Current loop' : 'Next objective'}</div>
            <div className="font-display text-[13px] font-bold tracking-[0.05em]" style={{ color: 'var(--gold-bright)' }}>
              {primary.title}
            </div>
          </div>
          <span className={`sect-path-state ${primary.complete ? 'done' : ''}`}>
            {primary.complete ? 'done' : progressText(primary)}
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--ink-mute)' }}>
          {primary.detail}
        </p>
        <div className="meter mb-3" role="progressbar" aria-label={`${primary.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct(primary))}>
          <div className={`meter-fill ${primary.complete ? 'jade' : ''}`} style={{ width: `${pct(primary)}%` }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="h-eyebrow min-w-0 truncate">{primary.reward}</span>
          {primary.onAction && (
            <button type="button" className="btn btn-primary shrink-0" style={{ padding: '7px 10px', fontSize: 9 }} onClick={primary.onAction}>
              {primary.actionLabel}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((goal) => (
          <div key={goal.id} className={`sect-path-row ${goal.complete ? 'complete' : ''}`}>
            <span className="sect-path-mark">{goal.complete ? 'OK' : progressText(goal)}</span>
            <span className="min-w-0 truncate">{goal.title}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
