/**
 * MasterSelect — wuxia-style character selection.
 * Same logic as the prior screen, reskinned with the wuxia visual language.
 */

'use client';

import { useState, useEffect } from 'react';
import { MASTERS, MASTER_IDS } from '@/engine/data/masters';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { engine } from '@/engine/engine';
import type { MasterId } from '@/engine/types';

import WorldCanvas from '../shell/WorldCanvas';
import ParallaxMountains from '../shell/ParallaxMountains';

// One Chinese-character glyph per role.
const ROLE_GLYPHS: Record<string, string> = {
  'Sect Leader': '尊',  // venerated
  'War General':  '戰', // war
  'Strategist':   '謀', // strategy
  'Scout':        '速', // speed
  'Assassin':     '影', // shadow
  'Healer':       '蓮', // lotus
  'Guardian':     '山', // mountain
};

export default function MasterSelect() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const setScreen = useUIStore((s) => s.setScreen);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const activeId = hoveredId ?? selectedForDetail;
  const hovered = activeId ? MASTERS[activeId] : null;

  useEffect(() => {
    if (hovered) {
      setDetailVisible(false);
      const t = setTimeout(() => setDetailVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setDetailVisible(false);
    }
  }, [hovered]);

  function commit(masterId: string) {
    engine.master.selectMaster(masterId as MasterId);
    useGameStore.setState({ selectedMaster: masterId as MasterId });
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-8 py-16 overflow-hidden">
      <WorldCanvas />
      <ParallaxMountains />

      {/* Title */}
      <div className="relative z-10 text-center mb-12" style={{ zIndex: 5 }}>
        <div className="h-eyebrow mb-3">Sect of the Sleeping Loaf</div>
        <h1
          className="font-display text-[44px] md:text-[56px] font-black gold-text"
          style={{ letterSpacing: '0.20em' }}
        >
          CHOOSE YOUR PATH
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="diamond" />
          <span className="h-eyebrow">Select a Master to lead the sect</span>
          <span className="diamond" />
        </div>
      </div>

      {/* Master grid */}
      <div
        className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-10 max-w-5xl"
        style={{ zIndex: 5 }}
      >
        {MASTER_IDS.map((id) => {
          const master = MASTERS[id];
          const glyph = ROLE_GLYPHS[master.role] ?? '士';
          const isActive = activeId === id;

          return (
            <button
              key={id}
              className="panel relative flex flex-col items-center p-4 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
              style={{
                borderColor: isActive ? master.color : 'rgba(230, 194, 117, 0.22)',
                boxShadow: isActive
                  ? `0 0 0 1px ${master.color}, 0 0 28px -4px ${master.color}99, inset 0 1px 0 rgba(255,225,170,0.12)`
                  : undefined,
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleSelect(id)}
              aria-label={`Select ${master.name}, ${master.title}`}
            >
              {/* Portrait — big tinted glyph badge */}
              <div
                className="rune mb-3"
                style={{
                  width: 64,
                  height: 64,
                  background: `radial-gradient(circle at 35% 30%, ${master.color}55, ${master.color}22 60%, rgba(0,0,0,0.4))`,
                  border: `1px solid ${master.color}88`,
                  color: '#fff7df',
                  fontSize: 28,
                  textShadow: `0 0 14px ${master.color}cc`,
                }}
              >
                {glyph}
              </div>
              <span
                className="font-display text-[13px] font-bold tracking-[0.10em] uppercase"
                style={{ color: master.color, textShadow: `0 0 8px ${master.color}66` }}
              >
                {master.name}
              </span>
              <span className="h-eyebrow mt-0.5">{master.role}</span>
            </button>
          );
        })}
      </div>

      {/* Detail card */}
      <div
        className="relative panel panel-ornate w-full max-w-2xl p-6 transition-all duration-300 min-h-[200px]"
        style={{
          borderColor: hovered ? `${hovered.color}aa` : 'rgba(230, 194, 117, 0.22)',
          transform: detailVisible ? 'translateY(0)' : 'translateY(8px)',
          opacity: hovered ? (detailVisible ? 1 : 0) : 1,
          zIndex: 5,
        }}
      >
        {hovered ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div
                className="rune"
                style={{
                  width: 48,
                  height: 48,
                  background: `radial-gradient(circle at 35% 30%, ${hovered.color}55, ${hovered.color}22 60%, rgba(0,0,0,0.4))`,
                  border: `1px solid ${hovered.color}88`,
                  color: '#fff7df',
                  fontSize: 22,
                  textShadow: `0 0 14px ${hovered.color}cc`,
                }}
              >
                {ROLE_GLYPHS[hovered.role] ?? '士'}
              </div>
              <div className="leading-tight">
                <div
                  className="font-display text-[20px] font-black tracking-[0.10em] uppercase"
                  style={{ color: hovered.color, textShadow: `0 0 10px ${hovered.color}66` }}
                >
                  {hovered.name}
                </div>
                <div className="h-eyebrow">{hovered.title}</div>
              </div>
            </div>

            <p className="text-base mb-4" style={{ color: 'var(--ink)' }}>
              {hovered.description}
            </p>

            <div className="p-3 mb-4" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--rule)' }}>
              <div className="h-eyebrow mb-1">Passive · {hovered.passive.name}</div>
              <div className="text-sm" style={{ color: 'var(--jade-bright)' }}>
                {hovered.passive.description}
              </div>
            </div>

            <p
              className="text-sm italic mb-4"
              style={{ color: 'var(--ink-mute)' }}
            >
              &ldquo;{hovered.quotes[0]}&rdquo;
            </p>

            {isTouchDevice && selectedForDetail === activeId && (
              <button
                className="btn btn-primary w-full"
                onClick={() => commit(activeId as MasterId)}
              >
                Begin · {hovered.name}
              </button>
            )}
            {!isTouchDevice && (
              <button
                className="btn btn-primary w-full"
                onClick={() => commit(activeId as MasterId)}
              >
                Begin Cultivation
              </button>
            )}
          </>
        ) : (
          <p
            className="text-center text-sm pt-12"
            style={{ color: 'var(--ink-dim)' }}
          >
            {isTouchDevice
              ? 'Tap a master to read their scroll'
              : 'Hover over a master to read their scroll'}
          </p>
        )}
      </div>

      {/* Footer maxim */}
      <p
        className="relative font-display italic text-sm mt-10 tracking-[0.16em]"
        style={{ color: 'var(--ink-dim)', zIndex: 5 }}
      >
        &ldquo;The journey of a thousand boops begins with a single snoot.&rdquo;
      </p>
    </div>
  );
}
