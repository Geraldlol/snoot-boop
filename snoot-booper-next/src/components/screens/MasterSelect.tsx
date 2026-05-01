/**
 * MasterSelect: wuxia-style character selection with generated portrait art.
 */

'use client';

import Image from 'next/image';
import { useState, useEffect, type CSSProperties } from 'react';
import { MASTERS, MASTER_IDS } from '@/engine/data/masters';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import { saveGameNow } from '@/hooks/useAutoSave';
import { starterArt } from '@/lib/art-assets';
import type { MasterId } from '@/engine/types';

import WorldCanvas from '../shell/WorldCanvas';
import ParallaxMountains from '../shell/ParallaxMountains';
import SceneBackdrop from '../shell/SceneBackdrop';

type ArtStyle = CSSProperties & { '--panel-art'?: string };
type MasterPortraitId = keyof typeof starterArt.masters;

const ROLE_INITIALS: Record<string, string> = {
  'Sect Leader': 'SL',
  'War General': 'WG',
  Strategist: 'ST',
  Scout: 'SC',
  Assassin: 'AS',
  Healer: 'HL',
  Guardian: 'GD',
};

function portraitFor(id: string) {
  return starterArt.masters[id as MasterPortraitId];
}

export default function MasterSelect() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const setScreen = useUIStore((s) => s.setScreen);

  useEffect(() => {
    const media = window.matchMedia('(hover: none)');
    const updateTouchState = () => setIsTouchDevice(media.matches);
    const touchTimer = window.setTimeout(updateTouchState, 0);

    media.addEventListener('change', updateTouchState);
    return () => {
      window.clearTimeout(touchTimer);
      media.removeEventListener('change', updateTouchState);
    };
  }, []);

  const activeId = hoveredId ?? selectedForDetail;
  const hovered = activeId ? MASTERS[activeId] : null;
  const hoveredPortrait = activeId ? portraitFor(activeId) : null;

  useEffect(() => {
    const t = window.setTimeout(() => setDetailVisible(Boolean(hovered)), hovered ? 30 : 0);
    return () => window.clearTimeout(t);
  }, [hovered]);

  function commit(masterId: string) {
    engine.master.selectMaster(masterId as MasterId);
    useGameStore.setState({ selectedMaster: masterId as MasterId });
    saveGameNow();
    setScreen('game');
  }

  function handleSelect(masterId: string) {
    if (isTouchDevice && selectedForDetail !== masterId) {
      setSelectedForDetail(masterId);
      return;
    }
    commit(masterId);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start md:justify-center px-4 md:px-8 py-10 md:py-16 overflow-x-hidden">
      <SceneBackdrop src={starterArt.backgrounds.sanctuary} tone="bright" />
      <WorldCanvas />
      <ParallaxMountains />

      <div className="relative z-10 text-center mb-8 md:mb-10 max-w-full" style={{ zIndex: 5 }}>
        <div className="h-eyebrow mb-3">Sect of the Sleeping Loaf</div>
        <h1
          className="font-display text-[32px] sm:text-[44px] md:text-[56px] font-black gold-text leading-tight"
          style={{ letterSpacing: '0.05em' }}
        >
          <span className="block sm:inline">CHOOSE</span>{' '}
          <span className="block sm:inline">YOUR PATH</span>
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="diamond" />
          <span className="h-eyebrow">Select a Master to lead the sect</span>
          <span className="diamond" />
        </div>
      </div>

      <div
        className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 mb-8 max-w-6xl"
        style={{ zIndex: 5 }}
      >
        {MASTER_IDS.map((id) => {
          const master = MASTERS[id];
          const portrait = portraitFor(id);
          const initials = ROLE_INITIALS[master.role] ?? master.name.slice(0, 2).toUpperCase();
          const isActive = activeId === id;

          return (
            <button
              key={id}
              className="panel art-panel relative flex min-w-0 flex-col items-center p-3 md:p-4 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
              style={{
                '--panel-art': `url("${starterArt.ui.inkPanel}")`,
                borderColor: isActive ? master.color : 'rgba(230, 194, 117, 0.22)',
                boxShadow: isActive
                  ? `0 0 0 1px ${master.color}, 0 0 28px -4px ${master.color}99, inset 0 1px 0 rgba(255,225,170,0.12)`
                  : undefined,
                transform: isActive ? 'translateY(-3px) scale(1.02)' : 'translateY(0) scale(1)',
              } as ArtStyle}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(id)}
              aria-label={`Select ${master.name}, ${master.title}`}
            >
              <div
                className="master-portrait-frame mb-3"
                style={{
                  width: 82,
                  height: 82,
                  border: `1px solid ${master.color}aa`,
                  boxShadow: isActive
                    ? `0 0 24px -4px ${master.color}, inset 0 1px 0 rgba(255,225,170,0.25)`
                    : undefined,
                }}
              >
                {portrait ? (
                  <Image
                    src={portrait}
                    alt=""
                    fill
                    sizes="82px"
                    className="master-portrait-image"
                  />
                ) : (
                  <span className="font-display text-lg font-black">{initials}</span>
                )}
              </div>
              <span
                className="font-display text-[13px] font-bold tracking-[0.10em] uppercase"
                style={{ color: master.color, textShadow: `0 0 8px ${master.color}66` }}
              >
                {master.name}
              </span>
              <span className="h-eyebrow mt-0.5 max-w-full text-center leading-snug [overflow-wrap:anywhere]">{master.role}</span>
            </button>
          );
        })}
      </div>

      <div
        className="relative panel panel-ornate art-panel w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl p-5 sm:p-6 transition-all duration-300 min-h-[220px]"
        style={{
          '--panel-art': `url("${starterArt.ui.parchmentPanel}")`,
          borderColor: hovered ? `${hovered.color}aa` : 'rgba(230, 194, 117, 0.22)',
          transform: detailVisible ? 'translateY(0)' : 'translateY(8px)',
          opacity: hovered ? (detailVisible ? 1 : 0) : 1,
          zIndex: 5,
        } as ArtStyle}
      >
        {hovered ? (
          <>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-4 text-center sm:text-left">
              <div
                className="master-portrait-frame flex-shrink-0"
                style={{
                  width: 96,
                  height: 96,
                  border: `1px solid ${hovered.color}aa`,
                  boxShadow: `0 0 28px -8px ${hovered.color}`,
                }}
              >
                {hoveredPortrait ? (
                  <Image
                    src={hoveredPortrait}
                    alt=""
                    fill
                    sizes="96px"
                    className="master-portrait-image"
                    priority
                  />
                ) : (
                  <span className="font-display text-xl font-black">
                    {ROLE_INITIALS[hovered.role] ?? hovered.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="leading-tight min-w-0">
                <div
                  className="font-display text-[22px] font-black tracking-[0.10em] uppercase"
                  style={{ color: hovered.color, textShadow: `0 0 10px ${hovered.color}66` }}
                >
                  {hovered.name}
                </div>
                <div className="h-eyebrow">{hovered.title}</div>
                <p className="text-sm mt-3" style={{ color: 'var(--ink)' }}>
                  {hovered.description}
                </p>
              </div>
            </div>

            <Image
              src={starterArt.ui.lotusDivider}
              alt=""
              width={365}
              height={58}
              className="art-divider-image mb-4"
            />

            <div className="p-3 mb-4" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--rule)' }}>
              <div className="h-eyebrow mb-1">Passive: {hovered.passive.name}</div>
              <div className="text-sm" style={{ color: 'var(--jade-bright)' }}>
                {hovered.passive.description}
              </div>
            </div>

            <p className="text-sm italic mb-4" style={{ color: 'var(--ink-mute)' }}>
              &ldquo;{hovered.quotes[0]}&rdquo;
            </p>

            {isTouchDevice && selectedForDetail === activeId && (
              <button className="btn btn-primary w-full" onClick={() => commit(activeId as MasterId)}>
                Begin: {hovered.name}
              </button>
            )}
            {!isTouchDevice && (
              <button className="btn btn-primary w-full" onClick={() => commit(activeId as MasterId)}>
                Begin Cultivation
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[160px] px-4">
            <Image
              src={starterArt.ui.lotusDivider}
              alt=""
              width={365}
              height={58}
              className="art-divider-image mb-4 opacity-70"
            />
            <p className="text-center text-sm" style={{ color: 'var(--ink-dim)' }}>
              {isTouchDevice
                ? 'Tap a master to read their scroll'
                : 'Hover over a master to read their scroll'}
            </p>
          </div>
        )}
      </div>

      <p
        className="relative font-display italic text-xs sm:text-sm mt-8 w-full max-w-[calc(100vw-2rem)] min-w-0 px-2 text-center leading-relaxed tracking-[0.02em] sm:tracking-[0.16em]"
        style={{ color: 'var(--ink-dim)', zIndex: 5 }}
      >
        <span className="block">&ldquo;The journey of a thousand boops</span>
        <span className="block">begins with a single snoot.&rdquo;</span>
      </p>
    </div>
  );
}
